import { Actor } from "../spdx2model/actor";
import type {
  RelationshipOptions,
  RelationshipType,
} from "../spdx2model/relationship";
import { Relationship } from "../spdx2model/relationship";
import type { PackageVerificationCode } from "../spdx2model/package";
import { Package } from "../spdx2model/package";
import { Document } from "../spdx2model/document";
import { DocumentCreationInfo } from "../spdx2model/document-creation-info";
import { ExternalDocumentRef } from "../spdx2model/external-document-ref";
import type { ChecksumAlgorithm } from "../spdx2model/checksum";
import { Checksum } from "../spdx2model/checksum";
import { v4 as uuidv4 } from "uuid";
import type { FileType } from "../spdx2model/file";
import { File } from "../spdx2model/file";

export interface Creator {
  name: string;
  type: string;
  email?: string;
}

export interface DocumentRef {
  documentRefId: string;
  documentUri: string;
  checksum_value: string;
  checksum_algorithm: string;
}

export interface InputChecksum {
  checksumValue: string;
  checksumAlgorithm: string;
}

export interface CreateDocumentOptions {
  spdxVersion: string;
  created: Date;
  namespace: string;
  externalDocumentRefs: DocumentRef[];
  creatorComment: string;
  licenseListVersion: string;
  documentComment: string;
}

// TODO: Add prperties
export interface AddPackagesOptions {
  filesAnalyzed: boolean;
  spdxId: string;
  comment: string;
  verificationCode: PackageVerificationCode;
}

export interface AddFileOptions {
  spdxId: string;
  fileTypes: string[];
}

export class SPDXDocument extends Document {
  private static formatCreators(creators: Creator | Creator[]): Actor[] {
    return Array.isArray(creators)
      ? creators.map((creator) => Actor.fromCreator(creator))
      : [Actor.fromCreator(creators)];
  }

  private static formatSpdxVersion(spdxVersion?: string): string {
    return "SPDX-" + (spdxVersion ?? "2.3");
  }

  private static generateNamespace(documentName: string): string {
    return "https://" + documentName + "-" + uuidv4();
  }

  private static formatExternalDocumentRefs(
    refs?: DocumentRef[],
  ): ExternalDocumentRef[] | undefined {
    return refs
      ? refs.map(
          (ref) =>
            new ExternalDocumentRef(
              ref.documentRefId,
              ref.documentUri,
              new Checksum(
                ref.checksum_algorithm as ChecksumAlgorithm,
                ref.checksum_value,
              ),
            ),
        )
      : undefined;
  }

  static createDocument(
    name: string,
    creators: Creator | Creator[],
    options?: Partial<CreateDocumentOptions>,
  ): SPDXDocument {
    const creationInfo = new DocumentCreationInfo(
      this.formatSpdxVersion(options?.spdxVersion),
      name,
      options?.namespace ?? this.generateNamespace(name),
      this.formatCreators(creators),
      options?.created ?? new Date(),
      {
        ...options,
        externalDocumentRefs: this.formatExternalDocumentRefs(
          options?.externalDocumentRefs,
        ),
      },
    );

    return new SPDXDocument(creationInfo);
  }

  // TODO: Do we want to allow relationships as argument?
  addPackage(
    name: string,
    downloadLocation: string,
    options?: Partial<AddPackagesOptions>,
  ): this {
    this.packages = this.packages.concat(
      new Package(name, downloadLocation, options),
    );
    return this;
  }

  addFile(
    name: string,
    checksums: [InputChecksum] | InputChecksum,
    options?: Partial<AddFileOptions>,
  ): this {
    const formattedChecksums = Array.isArray(checksums)
      ? checksums.map(
          (checksum) =>
            new Checksum(
              checksum.checksumAlgorithm as ChecksumAlgorithm,
              checksum.checksumValue,
            ),
        )
      : [
          new Checksum(
            checksums.checksumAlgorithm as ChecksumAlgorithm,
            checksums.checksumValue,
          ),
        ];
    const fileTypes = options?.fileTypes
      ? options.fileTypes.map((fileType) => fileType as FileType)
      : undefined;

    const file = new File(name, formattedChecksums, {
      spdxId: options?.spdxId ?? undefined,
      fileTypes,
    });

    this.files = this.files ? this.files.concat(file) : [file];
    return this;
  }

  addRelationship(
    spdxElementId: string,
    relatedSpdxElementId: string,
    relationshipType: string,
    options?: Partial<RelationshipOptions>,
  ): this {
    const relationship = new Relationship(
      "SPDXRef-" + spdxElementId,
      "SPDXRef-" + relatedSpdxElementId,
      relationshipType as RelationshipType,
      { comment: options?.comment },
    );

    this.relationships = this.relationships.concat(relationship);
    return this;
  }

  async write(location: string, allowInvalid: boolean = false): Promise<void> {
    const validationIssues = this.validate();
    if (validationIssues.length > 0) {
      console.error(`Document is invalid: ${validationIssues.join("\n")}`);
      if (!allowInvalid) {
        return;
      }
    }

    await this.writeSBOM(location);
  }

  writeSync(location: string, allowInvalid: boolean = false): void {
    const validationIssues = this.validate();
    if (validationIssues.length > 0) {
      console.error(`Document is invalid: ${validationIssues.join("\n")}`);
      if (!allowInvalid) {
        return;
      }
    }

    this.writeSBOM(location)
      .then(() => {
        console.log("Wrote SBOM successfully: " + location);
      })
      .catch((error) => {
        console.error("Error writing sample SBOM: " + error);
      });
  }
}

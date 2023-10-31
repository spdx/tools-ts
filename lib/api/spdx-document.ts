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
  spdxId: string;
  creators: Creator | Creator[];
  created: Date;
  namespace: string;
  externalDocumentRefs: DocumentRef[];
  creatorComment: string;
  licenseListVersion: string;
  documentComment: string;
}

// TODO: Add properties
export interface AddPackagesOptions {
  filesAnalyzed: boolean;
  spdxId: string;
  comment: string;
  downloadLocation: string;
  verificationCode: PackageVerificationCode;
}

export interface AddFileOptions {
  spdxId: string;
  fileTypes: string[];
}

export class SPDXDocument extends Document {
  private static formatCreators(
    creators: Creator | Creator[] | undefined,
  ): Actor[] {
    if (!creators) {
      return [];
    } else if (Array.isArray(creators)) {
      return creators.map((creator) => Actor.fromCreator(creator));
    } else {
      return [Actor.fromCreator(creators)];
    }
  }

  private static formatSpdxVersion(spdxVersion?: string): string {
    return "SPDX-" + (spdxVersion ?? "2.3");
  }

  private static generateNamespace(documentName: string): string {
    // Remove/replace invalid characters (https://datatracker.ietf.org/doc/html/rfc2141#section-2.1)
    const formattedDocumentName = documentName
      .replace(/^[^A-Za-z0-9]+/, "")
      .replace(/[^A-Za-z0-9-]/g, "-");
    return "urn:" + (formattedDocumentName ?? "document") + ":" + uuidv4();
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
    options?: Partial<CreateDocumentOptions>,
  ): SPDXDocument {
    const creationInfo = new DocumentCreationInfo(
      this.formatSpdxVersion(options?.spdxVersion),
      name,
      options?.namespace ?? this.generateNamespace(name),
      this.formatCreators(options?.creators).concat(Actor.tools()),
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

  addPackage(name: string, options?: Partial<AddPackagesOptions>): Package {
    const pkg = new Package(name, options);
    this.packages = this.packages.concat(pkg);
    return pkg;
  }

  addFile(
    name: string,
    checksums: [InputChecksum] | InputChecksum,
    options?: Partial<AddFileOptions>,
  ): File {
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

    this.files = this.files.concat(file);
    return file;
  }

  addRelationship(
    spdxElement: Document | Package | File | string,
    relatedSpdxElement: Document | Package | File | string,
    relationshipType: string,
    options?: Partial<RelationshipOptions>,
  ): this {
    function getSpdxId(
      spdxElement: Document | Package | File | string,
    ): string {
      if (typeof spdxElement === "string") {
        return spdxElement;
      } else if (spdxElement instanceof Document) {
        return spdxElement.creationInfo.spdxId;
      } else {
        return spdxElement.spdxId;
      }
    }
    const relationship = new Relationship(
      getSpdxId(spdxElement),
      getSpdxId(relatedSpdxElement),
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

    await this.writeFile(location);
  }

  writeSync(location: string, allowInvalid: boolean = false): void {
    const validationIssues = this.validate();
    if (validationIssues.length > 0 && !allowInvalid) {
      console.error(`Document is invalid: ${validationIssues.join("\n")}`);
      return;
    }

    this.writeFile(location)
      .then(() => {
        console.log("Wrote SBOM successfully: " + location);
      })
      .catch((error) => {
        console.error("Error writing sample SBOM: " + error);
      });
  }
}

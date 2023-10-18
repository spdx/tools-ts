import { Actor } from "../spdx2model/actor";
import type { RelationshipOptions } from "../spdx2model/relationship";
import { Relationship, RelationshipType } from "../spdx2model/relationship";
import { Package } from "../spdx2model/package";
import { writeSBOM } from "../writers/json-writer";
import { Document } from "../spdx2model/document";
import { DocumentCreationInfo } from "../spdx2model/document-creation-info";
import { ExternalDocumentRef } from "../spdx2model/external-document-ref";
import type { ChecksumAlgorithm } from "../spdx2model/checksum";
import { Checksum } from "../spdx2model/checksum";
import { v4 as uuidv4 } from "uuid";

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

export interface CreateDocumentOptions {
  spdxVersion: string;
  created: Date;
  namespace: string;
  dataLicense: string;
  externalDocumentRefs: DocumentRef[];
  creatorComment: string;
  licenseListVersion: string;
  documentComment: string;
}

// TODO: Add prperties
export interface AddPackagesOptions {
  filesAnalyzed: boolean;
  spdxId: string;
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
    const pkg = new Package(name, downloadLocation, options);
    const describesRelationship = new Relationship(
      this.creationInfo.spdxId,
      pkg.spdxId,
      RelationshipType.DESCRIBES,
    );

    this.packages = this.packages.concat(pkg);
    this.relationships = this.relationships.concat(describesRelationship);
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

  writeSync(location: string): void {
    writeSBOM(this, location)
      .then(() => {
        console.log("Wrote sample SBOM successfully");
      })
      .catch((error) => {
        console.error("Error writing sample SBOM: " + error);
      });
  }

  async write(location: string): Promise<void> {
    await writeSBOM(this, location);
  }
}

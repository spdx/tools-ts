import { Actor } from "../spdx2model/actor";
import { Relationship } from "../spdx2model/relationship";
import type { Package } from "../spdx2model/package";
import { writeSBOM } from "../writers/json-writer";
import { Document } from "../spdx2model/document";
import { DocumentCreationInfo } from "../spdx2model/document-creation-info";
import { ExternalDocumentRef } from "../spdx2model/external-document-ref";
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
              new Checksum(ref.checksum_algorithm, ref.checksum_value),
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

  addRelationships(relationships: Relationship[]): this {
    this.relationships = this.relationships.concat(relationships);
    return this;
  }

  addPackages(packages: Package[]): this {
    this.packages = this.packages.concat(packages);
    packages.forEach((pkg: Package) => {
      this.addRelationships([
        new Relationship(this.creationInfo.spdxId, pkg.spdxId, "DESCRIBES"),
      ]);
    });
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

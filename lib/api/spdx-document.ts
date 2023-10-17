import { Actor } from "../spdx2model/actor";
import { Relationship } from "../spdx2model/relationship";
import type { Package } from "../spdx2model/package";
import { writeSBOM } from "../writers/json-writer";
import { Document } from "../spdx2model/document";
import { DocumentCreationInfo } from "../spdx2model/document-creation-info";
import * as crypto from "crypto";
import type { ExternalDocumentRef } from "../spdx2model/external-document-ref";

export interface Creator {
  name: string;
  type: string;
  email?: string;
}

export interface CreateDocumentOptions {
  spdxVersion: string;
  created: Date;
  namespace: string;
  dataLicense: string;
  externalDocumentRefs: ExternalDocumentRef[];
  creatorComment: string;
  licenseListVersion: string;
  documentComment: string;
}

// TODO: This function is based on https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid/2117523#2117523
// How do deal with this, compliance-wise?
function generateUuidV4(): string {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (digit) =>
    (
      parseInt(digit) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] &
        (15 >> (parseInt(digit) / 4)))
    ).toString(16),
  );
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
    return "https://" + documentName + "-" + generateUuidV4();
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
      options,
    );

    return new SPDXDocument(creationInfo);
  }

  addRelationships(relationships: Relationship[]): void {
    this.relationships = this.relationships.concat(relationships);
  }

  addPackages(packages: Package[]): void {
    this.packages = this.packages.concat(packages);
    packages.forEach((pkg: Package) => {
      this.addRelationships([
        new Relationship(this.creationInfo.spdxId, pkg.spdxId, "DESCRIBES"),
      ]);
    });
  }

  write(location: string): void {
    writeSBOM(this, location);
  }
}

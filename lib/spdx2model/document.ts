import type { Package } from "./package";
import { Relationship } from "./relationship";
import { DocumentCreationInfo } from "./document-creation-info";
import type { DocumentCreationInfoOptions } from "./document-creation-info";
import { writeSBOM } from "../writers/json-writer";
import { Actor } from "./actor";

interface DocumentOptions {
  packages: Package[];
  relationships: Relationship[];
}

export class Document {
  creationInfo: DocumentCreationInfo;
  packages: Package[];
  relationships: Relationship[];

  constructor(
    creationInfo: DocumentCreationInfo,
    options?: Partial<DocumentOptions>,
  ) {
    this.creationInfo = creationInfo;
    this.packages = options?.packages ?? [];
    this.relationships = options?.relationships ?? [];
  }
}

// TODO: Where should the following (user-facing) part live?
export interface Creator {
  name: string;
  type: string;
  email?: string;
}

export class SPDXDocument extends Document {
  static createDocument(
    name: string,
    namespace: string,
    creators: Creator | Creator[],
    options?: Partial<DocumentCreationInfoOptions>,
  ): SPDXDocument {
    const formattedCreators = Array.isArray(creators)
      ? creators.map((creator) => Actor.fromCreator(creator))
      : [Actor.fromCreator(creators)];

    const creationInfo = new DocumentCreationInfo(
      name,
      namespace,
      formattedCreators,
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

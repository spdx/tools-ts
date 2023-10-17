import type { Package } from "./package";
import type { Relationship } from "./relationship";
import type { DocumentCreationInfo } from "./document-creation-info";

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

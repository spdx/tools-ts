import type { Actor } from "./actor";
import type { ExternalDocumentRef } from "./external-document-ref";

export interface DocumentCreationInfoOptions {
  created: Date;
  dataLicense: string;
  externalDocumentRefs: ExternalDocumentRef[];
  creatorComment: string;
  licenseListVersion: string;
  documentComment: string;
}

export class DocumentCreationInfo {
  spdxVersion: string;
  dataLicense: string;
  spdxId: string = "SPDXRef-DOCUMENT";
  name: string;
  documentNamespace: string;
  externalDocumentRefs?: ExternalDocumentRef[];
  licenseListVersion?: string;
  creators: Actor[];
  created: Date;
  creatorComment?: string;
  documentComment?: string;

  constructor(
    spdxVersion: string,
    name: string,
    documentNamespace: string,
    creators: Actor[],
    created: Date,
    options?: Partial<DocumentCreationInfoOptions>,
  ) {
    this.spdxVersion = spdxVersion;
    this.name = name;
    this.documentNamespace = documentNamespace;
    this.creators = creators;
    this.created = created;
    this.dataLicense = options?.dataLicense ?? "CC0-1.0";
    this.externalDocumentRefs = options?.externalDocumentRefs ?? [];
    this.creatorComment = options?.creatorComment ?? undefined;
    this.licenseListVersion = options?.licenseListVersion ?? undefined;
    this.documentComment = options?.documentComment ?? undefined;
  }
}

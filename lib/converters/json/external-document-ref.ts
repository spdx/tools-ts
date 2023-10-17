import { JsonChecksum } from "./checksum";
import type { ExternalDocumentRef } from "../../spdx2model/external-document-ref";

export class JsonExternalDocumentRef {
  checksum: JsonChecksum;
  externalDocumentId: string;
  spdxDocument: string;

  constructor(
    checksum: JsonChecksum,
    externalDocumentId: string,
    spdxDocument: string,
  ) {
    this.checksum = checksum;
    this.externalDocumentId = externalDocumentId;
    this.spdxDocument = spdxDocument;
  }

  static fromExternalDocumentRef(
    ref: ExternalDocumentRef,
  ): JsonExternalDocumentRef {
    const jsonChecksum: JsonChecksum = JsonChecksum.fromChecksum(ref.checksum);

    return new JsonExternalDocumentRef(
      jsonChecksum,
      ref.documentRefId,
      ref.documentUri,
    );
  }
}

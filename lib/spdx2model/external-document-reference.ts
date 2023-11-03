import { Checksum } from "./checksum";
import type { SpdxDocumentReference } from "../api/spdx-document";

export class ExternalDocumentReference {
  documentRefId: string;
  documentUri: string;
  checksum: Checksum;

  constructor(documentRefId: string, documentUri: string, checksum: Checksum) {
    // TODO: What are the constraints for this?
    this.documentRefId = documentRefId;
    this.documentUri = documentUri;
    this.checksum = checksum;
  }

  static fromApi(ref: SpdxDocumentReference): ExternalDocumentReference {
    return new ExternalDocumentReference(
      ref.documentRefId,
      ref.documentUri,
      Checksum.fromSpdxChecksum({
        checksumValue: ref.checksumValue,
        checksumAlgorithm: ref.checksumAlgorithm,
      }),
    );
  }
}

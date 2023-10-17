import type { Checksum } from "./checksum";

export class ExternalDocumentRef {
  documentRefId: string;
  documentUri: string;
  checksum: Checksum;

  constructor(documentRefId: string, documentUri: string, checksum: Checksum) {
    // TODO: What are the constraints for this?
    this.documentRefId = documentRefId;
    this.documentUri = documentUri;
    this.checksum = checksum;
  }
}

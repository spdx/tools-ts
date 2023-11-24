// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { JsonChecksum } from "./checksum";
import type { ExternalDocumentReference } from "../../spdx2model/external-document-reference";

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
    ref: ExternalDocumentReference,
  ): JsonExternalDocumentRef {
    const jsonChecksum: JsonChecksum = JsonChecksum.fromChecksum(ref.checksum);

    return new JsonExternalDocumentRef(
      jsonChecksum,
      ref.documentRefId,
      ref.documentUri,
    );
  }
}

// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { Checksum } from "./checksum";
import type { SpdxDocumentReference } from "../api/spdx-document";

export class ExternalDocumentReference {
  documentRefId: string;
  documentUri: string;
  checksum: Checksum;

  constructor(documentRefId: string, documentUri: string, checksum: Checksum) {
    if (!documentRefId.match(/^DocumentRef-[\da-zA-Z.+-]+$/)) {
      throw new Error(
        `DocumentRefId must only contain letters, numbers, ".", "-" and "+", ` +
          `and must start with "DocumentRef-, but is: ${documentRefId}.`,
      );
    }

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

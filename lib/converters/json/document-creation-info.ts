// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { Document } from "../../spdx2model/document";
import { formatDatetime } from "./utils";

export class JsonDocumentCreationInfo {
  created: string;
  creators: string[];
  comment?: string;
  licenseListVersion?: string;

  constructor(
    created: string,
    creators: string[],
    comment?: string,
    licenseListVersion?: string,
  ) {
    this.created = created;
    this.creators = creators;
    this.comment = comment;
    this.licenseListVersion = licenseListVersion;
  }

  static fromDocument(document: Document): JsonDocumentCreationInfo {
    return new JsonDocumentCreationInfo(
      formatDatetime(document.creationInfo.created),
      document.creationInfo.creators.map((creator) => creator.toString()),
      document.creationInfo.creatorComment ?? undefined,
      document.creationInfo.licenseListVersion ?? undefined,
    );
  }
}

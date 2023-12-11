// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { OtherLicensingInfo } from "../../spdx2model/other-licensing-info";
import { v4 as uuidv4 } from "uuid";

export class JsonHasExtractedLicensingInfos {
  extractedText: string;
  licenseId: string;
  comment?: string;
  name?: string;
  seeAlsos?: string[];

  constructor(
    extractedText: string,
    licenseId: string,
    comment?: string,
    name?: string,
    seeAlsos?: string[],
  ) {
    this.extractedText = extractedText;
    this.licenseId = licenseId;
    this.comment = comment;
    this.name = name;
    this.seeAlsos = seeAlsos;
  }

  static fromOtherLicensingInfo(
    otherLicensingInfo: OtherLicensingInfo,
  ): JsonHasExtractedLicensingInfos {
    return new JsonHasExtractedLicensingInfos(
      otherLicensingInfo.extractedText ?? "",
      otherLicensingInfo.licenseId ?? "SPDXRef-" + uuidv4(),
      otherLicensingInfo.comment,
      otherLicensingInfo.licenseName?.toString(),
      otherLicensingInfo.crossReferences,
    );
  }
}

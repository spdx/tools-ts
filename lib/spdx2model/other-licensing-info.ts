// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { SpdxNoAssertion } from "./utils";
import { toSpdxType } from "./utils";
import type { AddOtherLicensingInfoOptions } from "../api/spdx-document";

export interface OtherLicensingInfoOptions {
  licenseId: string;
  extractedText: string;
  licenseName: string | SpdxNoAssertion;
  crossReferences: string[];
  comment: string;
}

export class OtherLicensingInfo {
  licenseId?: string;
  extractedText?: string;
  licenseName?: string | SpdxNoAssertion;
  crossReferences: string[];
  comment?: string;

  constructor(options?: Partial<OtherLicensingInfoOptions>) {
    this.licenseId = options?.licenseId ?? undefined;
    this.extractedText = options?.extractedText ?? undefined;
    this.licenseName = options?.licenseName ?? undefined;
    this.crossReferences = options?.crossReferences ?? [];
    this.comment = options?.comment ?? undefined;
  }

  static fromApi(
    options?: Partial<AddOtherLicensingInfoOptions>,
  ): OtherLicensingInfo {
    return new OtherLicensingInfo({
      licenseId: options?.licenseId,
      extractedText: options?.extractedText,
      licenseName: options?.licenseName && toSpdxType(options.licenseName),
      crossReferences: options?.crossReferences,
      comment: options?.comment,
    });
  }
}

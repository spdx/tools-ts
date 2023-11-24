// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { ExternalPackageRef } from "../../spdx2model/external-package-reference";

export class JsonExternalPackageRef {
  comment?: string;
  referenceCategory: string;
  referenceLocator: string;
  referenceType: string;

  constructor(
    referenceCategory: string,
    referenceLocator: string,
    referenceType: string,
    comment?: string,
  ) {
    this.referenceCategory = referenceCategory;
    this.referenceLocator = referenceLocator;
    this.referenceType = referenceType;
    this.comment = comment;
  }

  static fromExternalPackageRef(
    ref: ExternalPackageRef,
  ): JsonExternalPackageRef {
    return new JsonExternalPackageRef(
      ref.category.toString(),
      ref.locator,
      ref.type,
      ref.comment,
    );
  }
}

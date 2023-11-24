// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { SpdxExternalPackageReference } from "../api/spdx-document";

export enum ExternalPackageRefCategory {
  "OTHER" = "OTHER",
  "PERSISTENT-ID" = "PERSISTENT-ID",
  "PERSISTENT_ID" = "PERSISTENT_ID",
  "SECURITY" = "SECURITY",
  "PACKAGE-MANAGER" = "PACKAGE-MANAGER",
  "PACKAGE_MANAGER" = "PACKAGE_MANAGER",
}

export class ExternalPackageRef {
  category: ExternalPackageRefCategory;
  type: string;
  locator: string;
  comment?: string;

  constructor(
    category: ExternalPackageRefCategory,
    type: string,
    locator: string,
    comment?: string,
  ) {
    this.category = category;
    this.type = type;
    this.locator = locator;
    this.comment = comment;
  }

  static fromSpdxExternalPackageRefs(
    refs: SpdxExternalPackageReference[],
  ): ExternalPackageRef[] {
    return refs.map((ref) => {
      const referenceCategory =
        ExternalPackageRefCategory[
          ref.referenceCategory as keyof typeof ExternalPackageRefCategory
        ];
      if (!referenceCategory) {
        throw new Error(
          "Invalid external package reference category: " +
            ref.referenceCategory,
        );
      }
      return new ExternalPackageRef(
        referenceCategory,
        ref.referenceType,
        ref.referenceLocator,
        ref.comment,
      );
    });
  }
}

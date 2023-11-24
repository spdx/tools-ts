// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import {
  ExternalPackageRef,
  ExternalPackageRefCategory,
} from "../external-package-reference";

describe("ExternalPackageReference", () => {
  it("Creates correct external package references from api", () => {
    const testType = "type";
    const testLocator = "locator";
    const testComment = "comment";
    expect(
      ExternalPackageRef.fromSpdxExternalPackageRefs([
        {
          referenceType: testType,
          referenceCategory: "PACKAGE-MANAGER",
          referenceLocator: testLocator,
          comment: testComment,
        },
      ]),
    ).toStrictEqual([
      new ExternalPackageRef(
        ExternalPackageRefCategory["PACKAGE-MANAGER"],
        testType,
        testLocator,
        testComment,
      ),
    ]);
  });

  it("Throws for invalid external package reference category from api", () => {
    expect(() =>
      ExternalPackageRef.fromSpdxExternalPackageRefs([
        {
          referenceType: "type",
          referenceCategory: "invalid",
          referenceLocator: "locator",
        },
      ]),
    ).toThrow("Invalid external package reference category: invalid");
  });
});

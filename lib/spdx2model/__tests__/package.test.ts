// SPDX-FileCopyrightText: 2023 spdx contributors
//
// SPDX-License-Identifier: MIT

import {
  formatPackagePurpose,
  formatVendor,
  Package,
  PackagePurpose,
} from "../package";
import { SpdxNoAssertion } from "../utils";
import { Actor, ActorType } from "../actor";

describe("formatPackagePurpose", () => {
  it("Returns the correct package purpose", () => {
    expect(formatPackagePurpose("APPLICATION")).toBe(
      PackagePurpose.APPLICATION,
    );
  });

  it("Throws for invalid purpose", () => {
    expect(() => formatPackagePurpose("invalid")).toThrow(
      "Invalid package purpose: invalid",
    );
  });
});

describe("formatVendor", () => {
  it("Formats actor type", () => {
    const testVendorName = "test vendor";
    const testVendorEMail = "test@vendor.com";
    expect(
      formatVendor({
        name: testVendorName,
        type: "Person",
        email: testVendorEMail,
      }),
    ).toStrictEqual(
      new Actor("test vendor", ActorType.Person, testVendorEMail),
    );
  });

  it("Formats SPDX no assertion type", () => {
    expect(formatVendor("NOASSERTION")).toStrictEqual(new SpdxNoAssertion());
  });

  it("Returns undefined for undefined", () => {
    expect(formatVendor(undefined)).toBe(undefined);
  });

  it("Throws for SPDX None type", () => {
    expect(() => formatVendor("NONE")).toThrow(
      "Invalid entry: NONE is not allowed.",
    );
  });

  it("Throws for invalid SPDX type", () => {
    expect(() => formatVendor("invalid")).toThrow(
      "Invalid entry: invalid is not allowed.",
    );
  });

  it("Throws for invalid actor type", () => {
    expect(() =>
      formatVendor(new Actor("test vendor", ActorType.Tool)),
    ).toThrow("Invalid vendor type: Tool");
  });
});

describe("Package", () => {
  it("Creates correct package from api with no options", () => {
    const testPackage = Package.fromApi("test package");

    expect(testPackage.name).toBe("test package");
    expect(testPackage.downloadLocation).toBeInstanceOf(SpdxNoAssertion);
    expect(testPackage.spdxId.slice(0, 8)).toBe("SPDXRef-");
    expect(testPackage.version).toBe(undefined);
    expect(testPackage.fileName).toBe(undefined);
    expect(testPackage.supplier).toBe(undefined);
    expect(testPackage.originator).toBe(undefined);
    expect(testPackage.filesAnalyzed).toBe(false);
    expect(testPackage.verificationCode).toBe(undefined);
    expect(testPackage.checksums).toStrictEqual([]);
    expect(testPackage.homepage).toBe(undefined);
    expect(testPackage.sourceInfo).toBe(undefined);
    expect(testPackage.licenseConcluded).toBe(undefined);
    expect(testPackage.licenseInfoFromFiles).toStrictEqual([]);
    expect(testPackage.licenseDeclared).toBe(undefined);
    expect(testPackage.licenseComment).toBe(undefined);
    expect(testPackage.copyrightText).toBe(undefined);
    expect(testPackage.summary).toBe(undefined);
    expect(testPackage.description).toBe(undefined);
    expect(testPackage.comment).toBe(undefined);
    expect(testPackage.externalReferences).toStrictEqual([]);
    expect(testPackage.attributionTexts).toStrictEqual([]);
    expect(testPackage.primaryPackagePurpose).toBe(undefined);
    expect(testPackage.releaseDate).toBe(undefined);
    expect(testPackage.builtDate).toBe(undefined);
    expect(testPackage.validUntilDate).toBe(undefined);
  });
});

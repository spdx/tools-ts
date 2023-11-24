// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import {
  formatPackagePurpose,
  formatVendor,
  Package,
  PackagePurpose,
} from "../package";
import { SpdxNoAssertion, SpdxNone } from "../utils";
import { Actor, ActorType } from "../actor";
import { Checksum, ChecksumAlgorithm } from "../checksum";
import {
  ExternalPackageRef,
  ExternalPackageRefCategory,
} from "../external-package-reference";

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
  const testName = "test package";

  it("Creates correct package from api with no options", () => {
    const testPackage = Package.fromApi(testName);

    expect(testPackage.name).toBe(testName);
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

  it("Creates correct package from api with all options", () => {
    const testId = "SPDXRef-test-id";
    const testVersion = "V2.4";
    const testFileName = "test-file-name";
    const testVerificationCode = {
      value: "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d",
      excludedFiles: ["foo.txt"],
    };
    const testChecksumValue = "84a516841ba77a5b4648de2cd0dfcb30ea46dbb4";
    const testSourceInfo = "test source info";
    const testLicenseConcluded = "MIT";
    const testLicenseComment = "test license comment";
    const testSummary = "test summary";
    const testDescription = "test description";
    const testComment = "test comment";
    const referenceComment = "test reference comment";
    const testAttributionText = "test attribution text";
    const testReleaseDate = new Date();
    const testBuiltDate = new Date();
    const testValidUntilDate = new Date();

    const testPackage = Package.fromApi(testName, {
      downloadLocation: "NONE",
      spdxId: testId,
      version: testVersion,
      fileName: testFileName,
      supplier: { name: "test supplier", type: "Person" },
      originator: "NOASSERTION",
      filesAnalyzed: true,
      verificationCode: testVerificationCode,
      checksums: [
        {
          checksumAlgorithm: "SHA1",
          checksumValue: testChecksumValue,
        },
      ],
      homepage: "NOASSERTION",
      sourceInfo: testSourceInfo,
      licenseConcluded: testLicenseConcluded,
      licenseInfoFromFiles: ["NOASSERTION", "license info", "NONE"],
      licenseDeclared: "NONE",
      licenseComment: testLicenseComment,
      copyrightText: "NOASSERTION",
      summary: testSummary,
      description: testDescription,
      comment: testComment,
      externalReferences: [
        {
          referenceType: "npm",
          referenceLocator: "http-server@0.3.0",
          referenceCategory: "PACKAGE-MANAGER",
          comment: referenceComment,
        },
      ],
      attributionTexts: [testAttributionText],
      primaryPackagePurpose: "FRAMEWORK",
      releaseDate: testReleaseDate,
      builtDate: testBuiltDate,
      validUntilDate: testValidUntilDate,
    });

    expect(testPackage.name).toBe(testName);
    expect(testPackage.downloadLocation).toBeInstanceOf(SpdxNone);
    expect(testPackage.spdxId).toBe(testId);
    expect(testPackage.version).toBe(testVersion);
    expect(testPackage.fileName).toBe(testFileName);
    expect(testPackage.supplier).toStrictEqual(
      new Actor("test supplier", ActorType.Person),
    );
    expect(testPackage.originator).toBeInstanceOf(SpdxNoAssertion);
    expect(testPackage.filesAnalyzed).toBe(true);
    expect(testPackage.verificationCode).toBe(testVerificationCode);
    expect(testPackage.checksums).toStrictEqual([
      new Checksum(ChecksumAlgorithm.SHA1, testChecksumValue),
    ]);
    expect(testPackage.homepage).toBeInstanceOf(SpdxNoAssertion);
    expect(testPackage.sourceInfo).toBe(testSourceInfo);
    expect(testPackage.licenseConcluded).toBe(testLicenseConcluded);
    expect(testPackage.licenseInfoFromFiles.length).toBe(3);
    expect(testPackage.licenseInfoFromFiles[0]).toBeInstanceOf(SpdxNoAssertion);
    expect(testPackage.licenseInfoFromFiles[1]).toBe("license info");
    expect(testPackage.licenseInfoFromFiles[2]).toBeInstanceOf(SpdxNone);
    expect(testPackage.licenseDeclared).toBeInstanceOf(SpdxNone);
    expect(testPackage.licenseComment).toBe(testLicenseComment);
    expect(testPackage.copyrightText).toBeInstanceOf(SpdxNoAssertion);
    expect(testPackage.summary).toBe(testSummary);
    expect(testPackage.description).toBe(testDescription);
    expect(testPackage.comment).toBe(testComment);
    expect(testPackage.externalReferences).toStrictEqual([
      new ExternalPackageRef(
        ExternalPackageRefCategory["PACKAGE-MANAGER"],
        "npm",
        "http-server@0.3.0",
        referenceComment,
      ),
    ]);
    expect(testPackage.attributionTexts).toStrictEqual([testAttributionText]);
    expect(testPackage.primaryPackagePurpose).toBe(PackagePurpose.FRAMEWORK);
    expect(testPackage.releaseDate).toBe(testReleaseDate);
    expect(testPackage.builtDate).toBe(testBuiltDate);
    expect(testPackage.validUntilDate).toBe(testValidUntilDate);
  });
});

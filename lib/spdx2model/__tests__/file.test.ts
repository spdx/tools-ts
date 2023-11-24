// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { File, FileType, formatFileType } from "../file";
import { Checksum, ChecksumAlgorithm } from "../checksum";
import { SpdxNoAssertion, SpdxNone } from "../utils";

describe("formatFileType", () => {
  it("Formats file type correctly", () => {
    expect(formatFileType("TEXT")).toStrictEqual(FileType.TEXT);
  });

  it("Throws for invalid file type", () => {
    expect(() => formatFileType("invalid")).toThrow(
      "Invalid file type: invalid",
    );
  });
});

describe("File", () => {
  const testChecksumValue = "84a516841ba77a5b4648de2cd0dfcb30ea46dbb4";
  const testName = "name";

  it("Creates correct file from api with no options", () => {
    const file = File.fromApi(testName, [
      {
        checksumAlgorithm: "SHA1",
        checksumValue: testChecksumValue,
      },
    ]);

    expect(file.name).toBe(testName);
    expect(file.spdxId.slice(0, 8)).toBe("SPDXRef-");
    expect(file.checksums).toStrictEqual([
      new Checksum(ChecksumAlgorithm.SHA1, testChecksumValue),
    ]);
    expect(file.fileTypes).toStrictEqual([]);
    expect(file.licenseConcluded).toBe(undefined);
    expect(file.licenseInfoInFiles).toStrictEqual([]);
    expect(file.licenseComment).toBe(undefined);
    expect(file.copyrightText).toBe(undefined);
    expect(file.comment).toBe(undefined);
    expect(file.notice).toBe(undefined);
    expect(file.contributors).toStrictEqual([]);
    expect(file.attributionTexts).toStrictEqual([]);
  });

  it("Creates correct file from api with all options", () => {
    const testId = "SPDXRef-test-id";
    const testLicenseComment = "test license comment";
    const testComment = "test comment";
    const testNotice = "test notice";
    const testContributor = "test contributor";
    const testAttributionText = "test attribution text";

    const file = File.fromApi(
      testName,
      [
        {
          checksumAlgorithm: "SHA1",
          checksumValue: testChecksumValue,
        },
      ],
      {
        spdxId: testId,
        fileTypes: ["VIDEO"],
        licenseConcluded: "NONE",
        licenseInfoInFiles: ["NOASSERTION"],
        licenseComment: testLicenseComment,
        copyrightText: "NOASSERTION",
        comment: testComment,
        notice: testNotice,
        contributors: [testContributor],
        attributionTexts: [testAttributionText],
      },
    );

    expect(file.name).toBe(testName);
    expect(file.spdxId).toBe(testId);
    expect(file.checksums).toStrictEqual([
      new Checksum(ChecksumAlgorithm.SHA1, testChecksumValue),
    ]);
    expect(file.fileTypes).toStrictEqual([FileType.VIDEO]);
    expect(file.licenseConcluded).toBeInstanceOf(SpdxNone);
    expect(file.licenseInfoInFiles.length).toBe(1);
    expect(file.licenseInfoInFiles[0]).toBeInstanceOf(SpdxNoAssertion);
    expect(file.licenseComment).toBe(testLicenseComment);
    expect(file.copyrightText).toBeInstanceOf(SpdxNoAssertion);
    expect(file.comment).toBe(testComment);
    expect(file.notice).toBe(testNotice);
    expect(file.contributors).toStrictEqual([testContributor]);
    expect(file.attributionTexts).toStrictEqual([testAttributionText]);
  });
});

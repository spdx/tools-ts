// SPDX-FileCopyrightText: 2023 spdx contributors
//
// SPDX-License-Identifier: MIT

import { File, FileType, formatFileType } from "../file";
import { Checksum, ChecksumAlgorithm } from "../checksum";

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
  const TEST_CHECKSUM_VALUE = "84a516841ba77a5b4648de2cd0dfcb30ea46dbb4";

  it("Creates correct file from api with no options", () => {
    const file = File.fromApi("name", [
      {
        checksumAlgorithm: "SHA1",
        checksumValue: TEST_CHECKSUM_VALUE,
      },
    ]);
    expect(file.name).toStrictEqual("name");
    expect(file.spdxId.slice(0, 8)).toBe("SPDXRef-");
    expect(file.checksums).toStrictEqual([
      new Checksum(ChecksumAlgorithm.SHA1, TEST_CHECKSUM_VALUE),
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
});

// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { Checksum, ChecksumAlgorithm } from "../checksum";

const TEST_CHECKSUM_VALUE = "84a516841ba77a5b4648de2cd0dfcb30ea46dbb4";

describe("Checksum", () => {
  it("Creates correct checksum from api", () => {
    expect(
      Checksum.fromSpdxChecksum({
        checksumAlgorithm: "SHA1",
        checksumValue: TEST_CHECKSUM_VALUE,
      }),
    ).toStrictEqual(new Checksum(ChecksumAlgorithm.SHA1, TEST_CHECKSUM_VALUE));
  });

  it("Creates multiple correct checksums from api", () => {
    expect(
      Checksum.fromSpdxChecksums([
        {
          checksumAlgorithm: "SHA1",
          checksumValue: TEST_CHECKSUM_VALUE,
        },
      ]),
    ).toStrictEqual([
      new Checksum(ChecksumAlgorithm.SHA1, TEST_CHECKSUM_VALUE),
    ]);
  });

  it("Throws for invalid checksum algorithm from api", () => {
    expect(() =>
      Checksum.fromSpdxChecksum({
        checksumAlgorithm: "invalid",
        checksumValue: TEST_CHECKSUM_VALUE,
      }),
    ).toThrow("Invalid checksum algorithm: invalid");
  });
});

import { Checksum, ChecksumAlgorithm } from "../checksum";

const TEST_HASH = "84a516841ba77a5b4648de2cd0dfcb30ea46dbb4";

describe("Checksum", () => {
  it("Creates correct checksum from api", () => {
    expect(
      Checksum.fromSpdxChecksum({
        checksumAlgorithm: "SHA1",
        checksumValue: TEST_HASH,
      }),
    ).toStrictEqual(new Checksum(ChecksumAlgorithm.SHA1, TEST_HASH));
  });

  it("Creates multiple correct checksums from api", () => {
    expect(
      Checksum.fromSpdxChecksums([
        {
          checksumAlgorithm: "SHA1",
          checksumValue: TEST_HASH,
        },
      ]),
    ).toStrictEqual([new Checksum(ChecksumAlgorithm.SHA1, TEST_HASH)]);
  });

  it("Throws for invalid checksum algorithm from api", () => {
    expect(() =>
      Checksum.fromSpdxChecksum({
        checksumAlgorithm: "invalid",
        checksumValue: TEST_HASH,
      }),
    ).toThrow("Invalid checksum algorithm: invalid");
  });
});

// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { ExternalDocumentReference } from "../external-document-reference";
import { Checksum, ChecksumAlgorithm } from "../checksum";

const TEST_CHECKSUM_VALUE = "84a516841ba77a5b4648de2cd0dfcb30ea46dbb4";

describe("ExternalDocumentReference", () => {
  it("Creates correct external document reference from api", () => {
    const testId = "DocumentRef-1.0";
    const testUri = "https://example.com";
    expect(
      ExternalDocumentReference.fromApi({
        documentRefId: testId,
        documentUri: testUri,
        checksumAlgorithm: ChecksumAlgorithm.SHA1.toString(),
        checksumValue: TEST_CHECKSUM_VALUE,
      }),
    ).toStrictEqual(
      new ExternalDocumentReference(
        testId,
        testUri,
        new Checksum(ChecksumAlgorithm.SHA1, TEST_CHECKSUM_VALUE),
      ),
    );
  });

  it("Throws for invalid document reference id", () => {
    expect(
      () =>
        new ExternalDocumentReference(
          "invalid",
          "https://example.com",
          new Checksum(ChecksumAlgorithm.SHA1, TEST_CHECKSUM_VALUE),
        ),
    ).toThrow(
      'DocumentRefId must only contain letters, numbers, ".", "-" and "+", and must start with "DocumentRef-, but is: invalid.',
    );
  });
});

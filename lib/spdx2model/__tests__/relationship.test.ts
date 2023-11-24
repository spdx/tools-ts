// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { Document } from "../document";
import { DocumentCreationInfo } from "../document-creation-info";
import { Actor, ActorType } from "../actor";
import {
  getSpdxIdFromElement,
  Relationship,
  RelationshipType,
} from "../relationship";
import { Package } from "../package";
import { Checksum, ChecksumAlgorithm } from "../checksum";
import { File } from "../file";

describe("getSpdxIdFromElement", () => {
  const TEST_ID = "SPDXRef-test-id";

  it("Returns correct SPDX ID from document", () => {
    const testDocument = new Document(
      new DocumentCreationInfo(
        "SPDX-2.3",
        "my name",
        "urn:namespace:9c297b20-a92e-4f58-822d-8b83ef105384",
        [new Actor("the creator", ActorType.Person)],
        {
          spdxId: TEST_ID,
        },
      ),
    );

    expect(getSpdxIdFromElement(testDocument)).toStrictEqual(TEST_ID);
  });

  it("Returns correct SPDX ID from package", () => {
    const testPackage = new Package("test package", {
      spdxId: TEST_ID,
    });

    expect(getSpdxIdFromElement(testPackage)).toStrictEqual(TEST_ID);
  });

  it("Returns correct SPDX ID from file", () => {
    const testFile = new File(
      "test file",
      [
        new Checksum(
          ChecksumAlgorithm.SHA1,
          "84a516841ba77a5b4648de2cd0dfcb30ea46dbb4",
        ),
      ],
      {
        spdxId: TEST_ID,
      },
    );

    expect(getSpdxIdFromElement(testFile)).toStrictEqual(TEST_ID);
  });

  it("Returns correct SPDX ID from string", () => {
    expect(getSpdxIdFromElement(TEST_ID)).toStrictEqual(TEST_ID);
  });
});

describe("Relationship", () => {
  it("Creates correct describes relationship from api with options", () => {
    const documentId = "SPDXRef-document-id";
    const fileId = "SPDXRef-file-id";

    const testDocument = new Document(
      new DocumentCreationInfo(
        "SPDX-2.3",
        "my name",
        "urn:namespace:9c297b20-a92e-4f58-822d-8b83ef105384",
        [new Actor("the creator", ActorType.Person)],
        {
          spdxId: documentId,
        },
      ),
    );
    const testFile = new File(
      "test file",
      [
        new Checksum(
          ChecksumAlgorithm.SHA1,
          "84a516841ba77a5b4648de2cd0dfcb30ea46dbb4",
        ),
      ],
      {
        spdxId: fileId,
      },
    );

    expect(
      Relationship.fromApi(testDocument, testFile, "DESCRIBES"),
    ).toStrictEqual(
      new Relationship(documentId, fileId, RelationshipType.DESCRIBES),
    );
  });

  it("Creates correct contains relationship from api with options", () => {
    const packageId = "SPDXRef-package-id";
    const fileId = "SPDXRef-file-id";

    const testPackage = new Package("test package", {
      spdxId: packageId,
    });
    const testFile = new File(
      "test file",
      [
        new Checksum(
          ChecksumAlgorithm.SHA1,
          "84a516841ba77a5b4648de2cd0dfcb30ea46dbb4",
        ),
      ],
      {
        spdxId: fileId,
      },
    );

    expect(
      Relationship.fromApi(testPackage, testFile, "CONTAINS", {
        comment: "test comment",
      }),
    ).toStrictEqual(
      new Relationship(packageId, fileId, RelationshipType.CONTAINS, {
        comment: "test comment",
      }),
    );
  });
});

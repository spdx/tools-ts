// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { DocumentCreationInfo } from "../document-creation-info";
import { Actor, ActorType } from "../actor";
import { Document, itemsHaveDuplicateId } from "../document";
import { Package } from "../package";
import { File } from "../file";
import { Checksum, ChecksumAlgorithm } from "../checksum";
import { Relationship, RelationshipType } from "../relationship";

const TEST_CHECKSUMS = [
  new Checksum(
    ChecksumAlgorithm.SHA1,
    "84a516841ba77a5b4648de2cd0dfcb30ea46dbb4",
  ),
];

describe("Document", () => {
  it("Supports all constructor options", () => {
    const testCreationInfo = getTestCreationInfo();
    const testPackage = new Package("package name");
    const testFile = new File("file name", TEST_CHECKSUMS);
    const testRelationship = new Relationship(
      testPackage.spdxId,
      testFile.spdxId,
      RelationshipType.CONTAINS,
    );
    const testDocument = new Document(testCreationInfo, {
      packages: [testPackage],
      files: [testFile],
      relationships: [testRelationship],
    });

    expect(testDocument.creationInfo).toBe(testCreationInfo);
    expect(testDocument.packages.length).toBe(1);
    expect(testDocument.packages[0]).toBe(testPackage);
    expect(testDocument.files.length).toBe(1);
    expect(testDocument.files[0]).toBe(testFile);
    expect(testDocument.relationships.length).toBe(1);
    expect(testDocument.relationships[0]).toBe(testRelationship);
  });

  it("Recognizes unsupported SPDX version", () => {
    const expectedValidationIssues = [
      "Invalid SPDX version. Currently only SPDX-2.3 is supported.",
    ];

    const document = new Document(getTestCreationInfo("SPDX-1.0"));
    document.packages.push(new Package("first package"));

    expect(document.collectValidationIssues()).toStrictEqual(
      expectedValidationIssues,
    );
  });

  it("Recognizes missing describes relationship for no packages", () => {
    const expectedValidationIssues = [
      "Missing DESCRIBES or DESCRIBED_BY relationships.\n" +
        "Document must have at least one DESCRIBES and one DESCRIBED_BY relationship, if there is not exactly one package present.",
    ];

    const document = new Document(getTestCreationInfo());

    expect(document.collectValidationIssues()).toStrictEqual(
      expectedValidationIssues,
    );
  });

  it("Recognizes missing describes relationship for multiple packages", () => {
    const expectedValidationIssues = [
      "Missing DESCRIBES or DESCRIBED_BY relationships.\n" +
        "Document must have at least one DESCRIBES and one DESCRIBED_BY relationship, if there is not exactly one package present.",
    ];

    const document = new Document(getTestCreationInfo());
    document.packages.push(new Package("first package"));
    document.packages.push(new Package("second package"));

    expect(document.collectValidationIssues()).toStrictEqual(
      expectedValidationIssues,
    );
  });

  it("Recognizes duplicate spdx ids in document and package", () => {
    const expectedValidationIssues = [
      "Duplicate SPDX IDs for document, packages or files.",
    ];

    const document = new Document(getTestCreationInfo());
    document.packages.push(
      new Package("package", { spdxId: "SPDXRef-DOCUMENT" }),
    );

    expect(document.collectValidationIssues()).toStrictEqual(
      expectedValidationIssues,
    );
  });

  it("Recognizes duplicate spdx ids in packages", () => {
    const expectedValidationIssues = [
      "Duplicate SPDX IDs for document, packages or files.",
    ];
    const testSpdxId = "SPDXRef-test-id";

    const document = new Document(getTestCreationInfo());
    document.packages.push(
      new Package("first package", { spdxId: testSpdxId }),
    );
    document.packages.push(
      new Package("second package", { spdxId: testSpdxId }),
    );
    document.relationships.push(
      new Relationship(
        document.creationInfo.spdxId,
        testSpdxId,
        RelationshipType.DESCRIBES,
      ),
    );

    expect(document.collectValidationIssues()).toStrictEqual(
      expectedValidationIssues,
    );
  });

  it("Recognizes duplicate spdx ids in package and file", () => {
    const expectedValidationIssues = [
      "Duplicate SPDX IDs for document, packages or files.",
    ];
    const testSpdxId = "SPDXRef-test-id";

    const document = new Document(getTestCreationInfo());
    document.packages.push(new Package("package", { spdxId: testSpdxId }));
    document.files.push(new File("file", [], { spdxId: testSpdxId }));
    document.relationships.push(
      new Relationship(
        document.creationInfo.spdxId,
        testSpdxId,
        RelationshipType.DESCRIBES,
      ),
    );

    expect(document.collectValidationIssues()).toStrictEqual(
      expectedValidationIssues,
    );
  });
});

describe("itemsHaveDuplicateSpdxId", () => {
  it("returns true for package with duplicate id", () => {
    const testSpdxId = "SPDXRef-test-id";
    const spdxIds = new Set(["SPDXRef-DOCUMENT", testSpdxId]);

    const testPackages = [new Package("first package", { spdxId: testSpdxId })];

    expect(itemsHaveDuplicateId(spdxIds, testPackages)).toBe(true);
  });

  it("returns true for file with duplicate id", () => {
    const testSpdxId = "SPDXRef-test-id";
    const spdxIds = new Set(["SPDXRef-DOCUMENT", testSpdxId]);

    const testFiles = [
      new File("first file", TEST_CHECKSUMS, { spdxId: testSpdxId }),
    ];

    expect(itemsHaveDuplicateId(spdxIds, testFiles)).toBe(true);
  });

  it("returns false for items with unique ids", () => {
    const spdxIds = new Set(["SPDXRef-DOCUMENT"]);
    const testPackages = [new Package("first package")];

    expect(itemsHaveDuplicateId(spdxIds, testPackages)).toBe(false);
  });
});

function getTestCreationInfo(spdxVersion?: string): DocumentCreationInfo {
  return new DocumentCreationInfo(
    spdxVersion ?? "SPDX-2.3",
    "my name",
    "urn:namespace:9c297b20-a92e-4f58-822d-8b83ef105384",
    [new Actor("the creator", ActorType.Person)],
  );
}

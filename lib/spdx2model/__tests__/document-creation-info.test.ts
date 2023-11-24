// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import {
  DocumentCreationInfo,
  formatSpdxVersion,
  generateNamespace,
} from "../document-creation-info";
import { Actor, ActorType } from "../actor";
import type { SpdxDocumentReference } from "../../api/spdx-document";
import { ExternalDocumentReference } from "../external-document-reference";

describe("formatSpdxVersion", () => {
  it("Formats spdx version correctly", () => {
    expect(formatSpdxVersion("2.3")).toBe("SPDX-2.3");
  });

  it("Creates spdx version correctly", () => {
    expect(formatSpdxVersion()).toBe("SPDX-2.3");
  });
});

describe("generateNamespace", () => {
  it("Generates valid namespace for document name without valid characters", () => {
    expect(generateNamespace("--:/").slice(0, 13)).toBe("urn:document:");
  });

  it("Generates valid namespace for document name with invalid characters", () => {
    expect(generateNamespace("- Test-N a:m/e").slice(0, 17)).toBe(
      "urn:Test-N-a-m-e:",
    );
  });
});

describe("DocumentCreationInfo", () => {
  it("Adds spdx id and data license to document creation info when initiating", () => {
    const documentCreationInfo = new DocumentCreationInfo(
      "SPDX-2.3",
      "my name",
      "urn:namespace:9c297b20-a92e-4f58-822d-8b83ef105384",
      [new Actor("the creator", ActorType.Person)],
    );

    expect(documentCreationInfo.spdxId).toBe("SPDXRef-DOCUMENT");
    expect(documentCreationInfo.dataLicense).toBe("CC0-1.0");
  });

  it("Creates correct creation info from api with no options", () => {
    const testName = "name";
    const documentCreationInfo = DocumentCreationInfo.fromApi(testName);

    expect(documentCreationInfo.spdxVersion).toBe("SPDX-2.3");
    expect(documentCreationInfo.dataLicense).toBe("CC0-1.0");
    expect(documentCreationInfo.spdxId).toBe("SPDXRef-DOCUMENT");
    expect(documentCreationInfo.name).toBe(testName);
    expect(documentCreationInfo.documentNamespace.slice(0, 9)).toBe(
      "urn:name:",
    );
    expect(documentCreationInfo.externalDocumentRefs).toStrictEqual([]);
    expect(documentCreationInfo.licenseListVersion).toBeUndefined();
    expect(documentCreationInfo.creators).toStrictEqual([Actor.tools()]);
    expect(documentCreationInfo.created).toBeInstanceOf(Date);
    expect(documentCreationInfo.creatorComment).toBeUndefined();
    expect(documentCreationInfo.documentComment).toBeUndefined();
  });

  it("Creates correct creation info from api with all options set", () => {
    const testName = "name";
    const testSpdxId = "SPDXRef-test-id";
    const testUrn = "urn:name:9c297b20-a92e-4f58-822d-8b83ef105384";
    const testSpdxDocumentRef = {
      documentRefId: "DocumentRef-document",
      documentUri: "document-uri",
      checksumValue: "checksum-value",
      checksumAlgorithm: "SHA1",
    };
    const testSpdxCreator = {
      name: "creator",
      type: "Person",
      email: "creator@person.com",
    };
    const testDocumentRefs: SpdxDocumentReference[] = [testSpdxDocumentRef];
    const testCreatorComment = "creator comment";
    const testLicenseListVersion = "3.14";
    const testDocumentComment = "document comment";
    const testCreators = [testSpdxCreator];
    const testCreated = new Date();
    const documentCreationInfo = DocumentCreationInfo.fromApi(testName, {
      spdxVersion: "2.3",
      spdxId: testSpdxId,
      creators: testCreators,
      created: testCreated,
      namespace: testUrn,
      externalDocumentRefs: testDocumentRefs,
      creatorComment: testCreatorComment,
      licenseListVersion: testLicenseListVersion,
      documentComment: testDocumentComment,
    });

    expect(documentCreationInfo.spdxVersion).toBe("SPDX-2.3");
    expect(documentCreationInfo.dataLicense).toBe("CC0-1.0");
    expect(documentCreationInfo.spdxId).toBe(testSpdxId);
    expect(documentCreationInfo.name).toBe(testName);
    expect(documentCreationInfo.documentNamespace).toBe(testUrn);
    expect(documentCreationInfo.externalDocumentRefs).toStrictEqual([
      ExternalDocumentReference.fromApi(testSpdxDocumentRef),
    ]);
    expect(documentCreationInfo.licenseListVersion).toBe(
      testLicenseListVersion,
    );
    expect(documentCreationInfo.creators).toStrictEqual([
      Actor.fromSpdxActor(testSpdxCreator),
      Actor.tools(),
    ]);
    expect(documentCreationInfo.created).toBe(testCreated);
    expect(documentCreationInfo.creatorComment).toBe(testCreatorComment);
    expect(documentCreationInfo.documentComment).toBe(testDocumentComment);
  });
});

// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import * as sbom from "../../spdx-tools";
import * as fs from "fs";
import mock from "mock-fs";
import type { JsonPackage } from "../../converters/json/package";
import type { JsonFile } from "../../converters/json/file";
import { Validator } from "jsonschema";
import * as spdxSchema from "./resources/spdx-schema.json";
import type { JsonHasExtractedLicensingInfos } from "../../converters/json/has-extracted-licensing-infos";

afterEach(() => {
  mock.restore();
});

test("Creates and writes minimal document", async () => {
  mock({ "root/dir": { "existingFile.txt": "" } });
  const testfile = "root/dir/sbom.spdx.json";

  const validator = new Validator();

  const document = sbom.createDocument("my project", { spdxVersion: "2.3" });
  document.addPackage("jest", {
    downloadLocation: "https://github.com/jestjs/jest.git",
    spdxId: "SPDXRef-jest-29.7.0",
  });
  await document.write(testfile).then(() => {
    expect(fs.lstatSync(testfile).isFile()).toBe(true);
    const writtenFileContent = fs.readFileSync(testfile, { encoding: "utf-8" });
    const parsedFileContent = JSON.parse(writtenFileContent);

    expect(parsedFileContent.name).toBe("my project");
    expect(parsedFileContent).toHaveProperty("packages");
    expect(parsedFileContent).not.toHaveProperty("files");
    expect(parsedFileContent).not.toHaveProperty("relationships");
    expect(parsedFileContent.packages[0].name).toBe("jest");

    expect(
      validator.validate(parsedFileContent, spdxSchema).valid,
    ).toBeTruthy();
  });
});

test("Fails when writing invalid document", async () => {
  mock({ "root/dir": { "existingFile.txt": "" } });
  const testfile = "root/dir/sbom.spdx.json";

  const document = sbom.createDocument("my project", { spdxVersion: "2.3" });
  document.addPackage("jest", {
    downloadLocation: "https://github.com/jestjs/jest.git",
    spdxId: "SPDXRef-jest-29.7.0",
  });
  document.addPackage("nunjucks", {
    downloadLocation: "https://github.com/mozilla/nunjucks.git",
    spdxId: "SPDXRef-nunjucks-3.2.4",
  });
  expect(() => {
    document.writeSync(testfile);
  }).toThrow(Error);
  expect(() => {
    document.writeSync(testfile);
  }).toThrow(
    "Missing DESCRIBES or DESCRIBED_BY relationships.\n" +
      "Document must have at least one DESCRIBES and one DESCRIBED_BY relationship, if there is not exactly one package present.",
  );
});

test("Succeeds when writing invalid document with allowInvalid flag", async () => {
  mock({ "root/dir": { "existingFile.txt": "" } });
  const testfile = "root/dir/sbom.spdx.json";

  const validator = new Validator();

  const document = sbom.createDocument("my project", { spdxVersion: "2.3" });
  document.addPackage("jest", {
    downloadLocation: "https://github.com/jestjs/jest.git",
    spdxId: "SPDXRef-jest-29.7.0",
  });
  document.addPackage("nunjucks", {
    downloadLocation: "https://github.com/mozilla/nunjucks.git",
    spdxId: "SPDXRef-nunjucks-3.2.4",
  });

  await document.write(testfile, true).then(() => {
    expect(fs.lstatSync(testfile).isFile()).toBe(true);
    const writtenFileContent = fs.readFileSync(testfile, { encoding: "utf-8" });
    const parsedFileContent = JSON.parse(writtenFileContent);

    expect(parsedFileContent.name).toBe("my project");
    expect(parsedFileContent).toHaveProperty("packages");
    expect(parsedFileContent).not.toHaveProperty("files");
    expect(parsedFileContent).not.toHaveProperty("relationships");

    const packageNames = parsedFileContent.packages.map(
      (pkg: JsonPackage) => pkg.name,
    );
    expect(packageNames).toContain("jest");
    expect(packageNames).toContain("nunjucks");

    expect(
      validator.validate(parsedFileContent, spdxSchema).valid,
    ).toBeTruthy();
  });
});

test("Creates and writes simple realistic document", async () => {
  mock({ "root/dir": { "existingFile.txt": "" } });
  const testfile = "root/dir/sbom.spdx.json";

  const validator = new Validator();

  const document = sbom.createDocument("SPDX Tools ts SBOM", {
    namespace:
      "https://github.com/spdx/tools-ts/examples/resources/spdx-tools-ts.sbom.json-21b3f009-ac30-4da3-a295-7172e0c4ba49",
    creators: {
      name: "Test Creator",
      type: "Person",
      email: "test@creator.com",
    },
  });

  const uuidPackage = document.addPackage("uuid", {
    downloadLocation: "https://github.com/uuidjs/uuid",
    verificationCode: {
      value: "b65013ce770696a72a0dded749a5058e5f8e2a4e",
    },
  });
  const eslintPackage = document.addPackage("eslint", {
    downloadLocation: "https://github.com/eslint/eslint",
    filesAnalyzed: false,
    comment: "This package is added for testing.",
  });

  document
    .addRelationship(document, uuidPackage, "DESCRIBES")
    .addRelationship(uuidPackage, eslintPackage, "DEPENDS_ON");

  const readmeFile = document.addFile(
    "README.md",
    {
      checksumValue: "de9f2c7fd25e1b3afad3e85a0bd17d9b100db4b4",
      checksumAlgorithm: "SHA1",
    },
    {
      fileTypes: ["TEXT"],
    },
  );

  document.addRelationship(uuidPackage, readmeFile, "CONTAINS");

  await document.write(testfile).then(() => {
    expect(fs.lstatSync(testfile).isFile()).toBe(true);
    const writtenFileContent = fs.readFileSync(testfile, { encoding: "utf-8" });
    const parsedFileContent = JSON.parse(writtenFileContent);

    expect(parsedFileContent.SPDXID).toBe("SPDXRef-DOCUMENT");
    expect(parsedFileContent.dataLicense).toBe("CC0-1.0");
    expect(parsedFileContent.name).toBe("SPDX Tools ts SBOM");
    expect(parsedFileContent.spdxVersion).toBe("SPDX-2.3");
    expect(parsedFileContent.documentNamespace).toBe(
      "https://github.com/spdx/tools-ts/examples/resources/spdx-tools-ts.sbom.json-21b3f009-ac30-4da3-a295-7172e0c4ba49",
    );

    expect(parsedFileContent.creationInfo.creators).toStrictEqual([
      "Person: Test Creator (test@creator.com)",
      "Tool: SPDX Tools TS",
    ]);

    const packageNames = parsedFileContent.packages.map(
      (pkg: JsonPackage) => pkg.name,
    );
    expect(packageNames.length).toBe(2);
    expect(packageNames).toContain("uuid");
    expect(packageNames).toContain("eslint");

    const fileNames = parsedFileContent.files.map(
      (file: JsonFile) => file.fileName,
    );
    expect(fileNames.length).toBe(1);
    expect(fileNames[0]).toBe("README.md");

    const relationships = parsedFileContent.relationships;
    expect(relationships).toContainEqual({
      spdxElementId: "SPDXRef-DOCUMENT",
      relatedSpdxElement: `${uuidPackage.spdxId}`,
      relationshipType: "DESCRIBES",
    });
    expect(relationships).toContainEqual({
      spdxElementId: `${uuidPackage.spdxId}`,
      relatedSpdxElement: `${eslintPackage.spdxId}`,
      relationshipType: "DEPENDS_ON",
    });
    expect(relationships).toContainEqual({
      spdxElementId: `${uuidPackage.spdxId}`,
      relatedSpdxElement: `${readmeFile.spdxId}`,
      relationshipType: "CONTAINS",
    });

    expect(
      validator.validate(parsedFileContent, spdxSchema).valid,
    ).toBeTruthy();
  });
});

test("Creates and writes elaborate document", async () => {
  mock({ "root/dir": { "existingFile.txt": "" } });
  const testfile = "root/dir/sbom.spdx.json";

  const validator = new Validator();

  const document = sbom.createDocument("test-document", {
    spdxVersion: "2.3",
    created: new Date(),
    creators: { name: "Test Creator", type: "Person" },
    namespace:
      "https://my-website.com/paths-to-spdx-document/my-document-21b3f009-ac30-4da3-a295-7172e0c4ba49",
    externalDocumentRefs: [
      {
        documentRefId: "DocumentRef-referenced-document-id",
        documentUri:
          "https://referenced-document.com/paths-to/document-4fced07f-b166-4203-a409-4275b7c5e642",
        checksumValue: "5d41402abc4b2a76b9719d911017c592cb8d5e0e",
        checksumAlgorithm: "SHA1",
      },
    ],
    creatorComment: "This document was created automatically",
    licenseListVersion: "3.14",
    documentComment: "This is a document for testing",
  });

  const firstPackage = document.addPackage("first package", {
    downloadLocation: "https://download-location.com",
    spdxId: "SPDXRef-first-package",
    version: "1.0.0",
    fileName: "first-package-1.0.0.tar.gz",
    supplier: { name: "test supplier", type: "Person" },
    originator: { name: "test originator", type: "Person" },
    filesAnalyzed: true,
    verificationCode: {
      value: "b65013ce770696a72a0dded749a5058e5f8e2a4d",
    },
    checksums: [
      {
        checksumValue: "6a204bd89f3c8348bff90840990a7ab50fdc30ce",
        checksumAlgorithm: "SHA1",
      },
    ],
    homepage: "https://homepage.com",
    sourceInfo: "https://source-info.com",
    licenseConcluded: "MIT",
    licenseInfoFromFiles: ["MIT"],
    licenseDeclared: "MIT",
    licenseComment: "This is a comment",
    copyrightText: "Copyright",
    summary: "This is a summary",
    description: "This is a description",
    comment: "This is a comment",
    externalReferences: [
      {
        referenceType: "test reference type",
        referenceLocator: "https://github.com/test-repo",
        referenceCategory: "OTHER",
        comment: "test reference comment",
      },
    ],
    attributionTexts: ["This is an attribution text"],
    primaryPackagePurpose: "APPLICATION",
    releaseDate: new Date(),
    builtDate: new Date(),
    validUntilDate: new Date(),
  });

  document.addRelationship(document, firstPackage, "DESCRIBES");
  const secondPackage = document.addPackage("second package", {
    downloadLocation: "https://download-location.com",
    filesAnalyzed: false,
    spdxId: "SPDXRef-second-package",
  });
  document.addRelationship(firstPackage, secondPackage, "DEPENDENCY_OF");

  const firstFile = document.addFile(
    "first file",
    [
      {
        checksumValue: "6a204bd89f3c8348bff90840990a7ab50fdc30ce",
        checksumAlgorithm: "SHA1",
      },
    ],
    {
      spdxId: "SPDXRef-first-file",
      fileTypes: ["TEXT"],
      licenseConcluded: "MIT",
      licenseInfoInFiles: ["MIT"],
      licenseComment: "This is a comment",
      copyrightText: "This is a copyright",
      comment: "This is a comment",
      notice: "This is a notice",
      contributors: ["Contributor"],
      attributionTexts: ["This is an attribution text"],
    },
  );

  document.addRelationship(firstPackage, firstFile, "CONTAINS");

  document.addOtherLicensingInformation({
    licenseId: "LicenseRef-test-license-id",
    extractedText: "This is an extracted text",
    licenseName: "Test license name",
    crossReferences: ["https://test-cross-reference.com"],
    comment: "This is a comment",
  });

  await document.write(testfile).then(() => {
    expect(fs.lstatSync(testfile).isFile()).toBe(true);
    const writtenFileContent = fs.readFileSync(testfile, { encoding: "utf-8" });
    const parsedFileContent = JSON.parse(writtenFileContent);

    expect(parsedFileContent.SPDXID).toBe("SPDXRef-DOCUMENT");
    expect(parsedFileContent.dataLicense).toBe("CC0-1.0");
    expect(parsedFileContent.name).toBe("test-document");
    expect(parsedFileContent.spdxVersion).toBe("SPDX-2.3");
    expect(parsedFileContent.documentNamespace).toBe(
      "https://my-website.com/paths-to-spdx-document/my-document-21b3f009-ac30-4da3-a295-7172e0c4ba49",
    );

    expect(parsedFileContent.creationInfo.creators).toStrictEqual([
      "Person: Test Creator",
      "Tool: SPDX Tools TS",
    ]);

    const packageNames = parsedFileContent.packages.map(
      (pkg: JsonPackage) => pkg.name,
    );
    expect(packageNames.length).toBe(2);
    expect(packageNames).toContain("first package");
    expect(packageNames).toContain("second package");

    const fileNames = parsedFileContent.files.map(
      (file: JsonFile) => file.fileName,
    );
    expect(fileNames.length).toBe(1);
    expect(fileNames).toContain("first file");

    const extractedLicensingInfos =
      parsedFileContent.hasExtractedLicensingInfos.map(
        (licensingInfo: JsonHasExtractedLicensingInfos) =>
          licensingInfo.licenseId,
      );
    expect(extractedLicensingInfos.length).toBe(1);
    expect(extractedLicensingInfos).toContain("LicenseRef-test-license-id");

    const relationships = parsedFileContent.relationships;
    expect(relationships).toContainEqual({
      spdxElementId: "SPDXRef-DOCUMENT",
      relatedSpdxElement: `${firstPackage.spdxId}`,
      relationshipType: "DESCRIBES",
    });
    expect(relationships).toContainEqual({
      spdxElementId: `${firstPackage.spdxId}`,
      relatedSpdxElement: `${secondPackage.spdxId}`,
      relationshipType: "DEPENDENCY_OF",
    });
    expect(relationships).toContainEqual({
      spdxElementId: `${firstPackage.spdxId}`,
      relatedSpdxElement: `${firstFile.spdxId}`,
      relationshipType: "CONTAINS",
    });

    expect(
      validator.validate(parsedFileContent, spdxSchema).valid,
    ).toBeTruthy();
  });
});

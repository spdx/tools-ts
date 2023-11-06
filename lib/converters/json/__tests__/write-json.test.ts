import * as sbom from "../../../spdx-tools";
import * as fs from "fs";
import mock from "mock-fs";
import { Validator } from "jsonschema";
import * as spdxSchema from "./resources/spdx-schema.json";

describe("validate SPDX documents with json schema", () => {
  afterEach(() => {
    mock.restore();
  });

  test("Minimal document is valid json", async () => {
    mock({ "root/dir": { "existingFile.txt": "" } });
    const testfile = "root/dir/sbom.spdx.json";

    const validator = new Validator();

    const document = sbom.createDocument("test document");
    const pkg = document.addPackage("test-package");
    document.addRelationship(document, pkg, "DESCRIBES");

    await document.write(testfile).then(() => {
      const writtenFileContent = fs.readFileSync(testfile, {
        encoding: "utf-8",
      });
      const parsedFileContent = JSON.parse(writtenFileContent);

      expect(
        validator.validate(parsedFileContent, spdxSchema).valid,
      ).toBeTruthy();
    });
  });

  test("Elaborate document is valid json", async () => {
    mock({ "root/dir": { "existingFile.txt": "" } });
    const testfile = "root/dir/sbom.spdx.json";

    const validator = new Validator();

    const document = sbom.createDocument("first-document", {
      spdxVersion: "2.3",
      created: new Date(),
      creators: { name: "test creator", type: "Person" },
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
        spdxId: "first-file",
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

    await document.write(testfile).then(() => {
      const writtenFileContent = fs.readFileSync(testfile, {
        encoding: "utf-8",
      });
      const parsedFileContent = JSON.parse(writtenFileContent);

      expect(
        validator.validate(parsedFileContent, spdxSchema).valid,
      ).toBeTruthy();
    });
  });
});

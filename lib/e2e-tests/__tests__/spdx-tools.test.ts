import * as sbom from "../../spdx-tools";
import * as fs from "fs";
import mock from "mock-fs";

afterEach(() => {
  mock.restore();
});

test("Creates and writes minimal document", async () => {
  mock({ "root/dir": { "existingFile.txt": "" } });
  const testfile = "root/dir/sbom.spdx.json";

  const document = sbom.createDocument("test document", {
    spdxVersion: "2.3",
  });
  const pkg = document.addPackage("test-package");
  document.addRelationship(document, pkg, "DESCRIBES");
  await document.write(testfile).then(() => {
    expect(fs.lstatSync(testfile).isFile()).toBe(true);
    const writtenFileContent = fs.readFileSync(testfile, { encoding: "utf-8" });
    const parsedFileContent = JSON.parse(writtenFileContent);
    expect(parsedFileContent.packages[0].name).toBe("test-package");
    expect(parsedFileContent.name).toBe("test document");
  });
});

// TODO: This test should fail since the document is invalid (missing describes relationship)
test("Creates and writes incomplete document", async () => {
  mock({ "root/dir": { "existingFile.txt": "" } });
  const testfile = "root/dir/sbom.spdx.json";

  const document = sbom.createDocument("test document", { spdxVersion: "2.3" });
  document.addPackage("test-package", {
    downloadLocation: "test/download/location",
    spdxId: "package-spdx-id",
  });
  await document.write(testfile).then(() => {
    expect(fs.lstatSync(testfile).isFile()).toBe(true);
    const writtenFileContent = fs.readFileSync(testfile, { encoding: "utf-8" });
    const parsedFileContent = JSON.parse(writtenFileContent);
    expect(parsedFileContent.packages[0].name).toBe("test-package");
    expect(parsedFileContent.name).toBe("test document");
  });
});

test("Creates and writes basic document", async () => {
  mock({ "root/dir": { "existingFile.txt": "" } });
  const testfile = "root/dir/sbom.spdx.json";

  const document = sbom.createDocument("SPDX Tools ts SBOM", {
    namespace:
      "https://github.com/spdx/tools-ts/examples/resources/spdx-tools-ts.sbom.json-21b3f009-ac30-4da3-a295-7172e0c4ba49",
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

  document
    .addRelationship(uuidPackage, eslintPackage, "DEPENDS_ON")
    .addRelationship(uuidPackage, readmeFile, "CONTAINS");

  await document.write(testfile).then(() => {
    expect(fs.lstatSync(testfile).isFile()).toBe(true);
    const writtenFileContent = fs.readFileSync(testfile, { encoding: "utf-8" });
    const parsedFileContent = JSON.parse(writtenFileContent);
    expect(parsedFileContent.packages[0].name).toBe("uuid");
    expect(parsedFileContent.name).toBe("SPDX Tools ts SBOM");
  });
});

import * as sbom from "../../spdx-tools";
import * as fs from "fs";
import mock from "mock-fs";
import type { Package } from "../../spdx2model/package";

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

test("Creates and writes incomplete document", async () => {
  mock({ "root/dir": { "existingFile.txt": "" } });
  const testfile = "root/dir/sbom.spdx.json";

  const document = sbom.createDocument("my project", { spdxVersion: "2.3" });
  document.addPackage("jest", {
    downloadLocation: "https://github.com/jestjs/jest.git",
    spdxId: "SPDXRef-jest-29.7.0",
  });
  await document.write(testfile).then(() => {
    expect(fs.lstatSync(testfile).isFile()).toBe(true);
    const writtenFileContent = fs.readFileSync(testfile, { encoding: "utf-8" });
    const parsedFileContent = JSON.parse(writtenFileContent);
    expect(parsedFileContent.packages[0].name).toBe("jest");
    expect(parsedFileContent.name).toBe("my project");
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
    const packageNames = parsedFileContent.packages.map(
      (pkg: Package) => pkg.name,
    );
    expect(packageNames).toContain("jest");
    expect(packageNames).toContain("nunjucks");
    expect(parsedFileContent.name).toBe("my project");
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

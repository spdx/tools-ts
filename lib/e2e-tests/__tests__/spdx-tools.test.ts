import * as sbom from "../../spdx-tools";
import * as fs from "fs";
import mock from "mock-fs";

afterEach(() => {
  mock.restore();
});

test("Creates and writes minimal document", async () => {
  mock({ "root/dir": { "existingFile.txt": "" } });
  const testfile = "root/dir/sbom.spdx.json";

  const document = sbom.createDocument(
    "test document",
    { name: "test creator", type: "Person" },
    { spdxVersion: "2.3" },
  );
  document.addPackage("test-package", "test/download/location", {
    spdxId: "package-spdx-id",
  });
  await document.write(testfile).then(() => {
    expect(fs.lstatSync(testfile).isFile()).toBe(true);
    const writtenFileContent = fs.readFileSync(testfile, { encoding: "utf-8" });
    const parsedFileContent = JSON.parse(writtenFileContent);
    expect(parsedFileContent.packages[0].name).toBe("test-package");
    expect(parsedFileContent.name).toBe("test document");
    expect(parsedFileContent.creationInfo.creators).toStrictEqual([
      "Person: test creator",
    ]);
  });
});

test("Creates and writes basic document", async () => {
  mock({ "root/dir": { "existingFile.txt": "" } });
  const testfile = "root/dir/sbom.spdx.json";

  const document = sbom.createDocument(
    "SPDX Tools ts SBOM",
    {
      name: "Test User",
      type: "Person",
    },
    {
      namespace:
        "https://github.com/spdx/tools-ts/examples/resources/spdx-tools-ts.sbom.json-21b3f009-ac30-4da3-a295-7172e0c4ba49",
    },
  );

  document
    .addPackage("uuid", "https://github.com/uuidjs/uuid", {
      verificationCode: {
        value: "b65013ce770696a72a0dded749a5058e5f8e2a4e",
      },
    })
    .addPackage("eslint", "https://github.com/eslint/eslint", {
      filesAnalyzed: false,
      comment: "This package is added for testing.",
    })
    .addRelationship("uuid", "eslint", "DEPENDS_ON");

  document
    .addFile(
      "README.md",
      {
        checksumValue: "de9f2c7fd25e1b3afad3e85a0bd17d9b100db4b4",
        checksumAlgorithm: "SHA1",
      },
      {
        fileTypes: ["TEXT"],
      },
    )
    .addRelationship("uuid", "README.md", "CONTAINS");

  document.writeSync("./examples/resources/spdx-tools-ts.spdx.json");

  await document.write(testfile).then(() => {
    expect(fs.lstatSync(testfile).isFile()).toBe(true);
    const writtenFileContent = fs.readFileSync(testfile, { encoding: "utf-8" });
    const parsedFileContent = JSON.parse(writtenFileContent);
    expect(parsedFileContent.packages[0].name).toBe("uuid");
    expect(parsedFileContent.name).toBe("SPDX Tools ts SBOM");
  });
});

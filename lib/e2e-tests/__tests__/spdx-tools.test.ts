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

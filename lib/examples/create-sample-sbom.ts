import * as sbom from "../spdx-tools";

const sampleSbom = "./lib/examples/resources/sample.sbom.json";
const document = sbom.createDocument(
  "first-document",
  { name: "test creator", type: "Person" },
  { spdxVersion: "2.3" },
);
document
  .addPackage("first package", "https://download-location.com", {
    filesAnalyzed: false,
    spdxId: "first-package",
  })
  .addPackage("second package", "https://download-location.com", {
    filesAnalyzed: false,
    spdxId: "second-package",
  })
  .addRelationship("first-package", "second-package", "DependencyOf");
document.writeSync(sampleSbom);

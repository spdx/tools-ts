import * as sbom from "../lib/spdx-tools";

const sampleSbom = "./examples/resources/minimal-sample.sbom.json";
const document = sbom.createDocument(
  "first-document",
  { name: "test creator", type: "Person" },
  { spdxVersion: "2.3" },
);
document.addPackage("first-package", "https://download-location.com", {
  filesAnalyzed: false,
});
document.writeSync(sampleSbom);

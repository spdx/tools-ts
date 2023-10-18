import * as sbom from "../spdx-tools";

const sampleSbom = "./lib/examples/resources/minimal-sample.sbom.json";
const document = sbom.createDocument(
  "first-document",
  { name: "test creator", type: "Person" },
  { spdxVersion: "2.3" },
);
document.addPackage("first-package", "https://download-location.com", {
  filesAnalyzed: false,
});
document.writeSync(sampleSbom);

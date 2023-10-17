import sbom from "../spdx-tools";
import { Package } from "../spdx2model/package";

const sampleSbom = "./lib/examples/resources/sample.sbom.json";
const document = sbom.createDocument(
  "first-document",
  { name: "test creator", type: "Person" },
  { spdxVersion: "2.3" },
);
document.addPackages([
  new Package("first-package", "https://download-location.com", {
    filesAnalyzed: false,
  }),
]);
document.write(sampleSbom);

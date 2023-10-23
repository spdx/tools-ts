import * as sbom from "../lib/spdx-tools";

const document = sbom.createDocument(
  "first-document",
  { name: "test creator", type: "Person" },
  { spdxVersion: "2.3" },
);
const pkg = document.addPackage(
  "first-package",
  "https://download-location.com",
  {
    filesAnalyzed: false,
  },
);
document.addRelationship(document, pkg, "DESCRIBES");
document.writeSync("./examples/resources/minimal-sample.spdx.json");

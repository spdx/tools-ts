import * as sbom from "../lib/spdx-tools";

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
  filesAnalyzed: true,
  spdxId: "SPDXRef-first-package",
  verificationCode: {
    value: "b65013ce770696a72a0dded749a5058e5f8e2a4d",
  },
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
  },
);

document.addRelationship(firstPackage, firstFile, "CONTAINS");
document.writeSync("./examples/resources/elaborate-sample.spdx.json");

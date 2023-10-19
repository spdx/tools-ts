import * as sbom from "../lib/spdx-tools";

const sampleSbom = "./examples/resources/elaborate-sample.sbom.json";
const document = sbom.createDocument(
  "first-document",
  { name: "test creator", type: "Person" },
  {
    spdxVersion: "2.3",
    created: new Date(),
    namespace:
      "https://my-website.com/paths-to-spdx-document/my-document-21b3f009-ac30-4da3-a295-7172e0c4ba49",
    externalDocumentRefs: [
      {
        documentRefId: "DocumentRef-referenced-document-id",
        documentUri:
          "https://referenced-document.com/paths-to/document-4fced07f-b166-4203-a409-4275b7c5e642",
        checksum_value: "5d41402abc4b2a76b9719d911017c592cb8d5e0e",
        checksum_algorithm: "SHA1",
      },
    ],
    creatorComment: "This document was created automatically",
    licenseListVersion: "3.14",
    documentComment: "This is a document for testing",
  },
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
  .addRelationship("first-package", "second-package", "DEPENDENCY_OF");

document.addFile("first file", {
  spdxId: "first-file",
  checksums: [
    {
      checksum_value: "6a204bd89f3c8348bff90840990a7ab50fdc30ce",
      checksum_algorithm: "SHA1",
    },
  ],
  fileTypes: ["TEXT"],
});
document.writeSync(sampleSbom);

import * as sbom from "../lib/spdx-tools";

const document = sbom.createDocument(
  "SPDX Tools ts SBOM",
  {
    name: "Anton Bauhofer",
    type: "Person",
    email: "anton.bauhofer@tngtech.com",
  },
  {
    namespace:
      "https://github.com/spdx/tools-ts/examples/resources/spdx-tools-ts.sbom.json-21b3f009-ac30-4da3-a295-7172e0c4ba49",
  },
);

document
  .addPackage("uuid", "https://github.com/uuidjs/uuid", {
    verificationCode: {
      value: "b65013ce770696a72a0dded749a5058e5f8e2a4d",
    },
  })
  .addPackage("eslint", "https://github.com/eslint/eslint", {
    filesAnalyzed: false,
    comment: "This package is added just for testing.",
  })
  .addRelationship("uuid", "eslint", "DEPENDS_ON");

document
  .addFile(
    "README.md",
    {
      checksumValue: "de9f2c7fd25e1b3afad3e85a0bd17d9b100db4b3",
      checksumAlgorithm: "SHA1",
    },
    {
      fileTypes: ["TEXT"],
    },
  )
  .addRelationship("uuid", "README.md", "CONTAINS");

document.writeSync("./examples/resources/spdx-tools-ts.sbom.json");

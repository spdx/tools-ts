// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import * as spdx from "../lib/spdx-tools";

const document = spdx.createDocument("SPDX Tools ts SBOM", {
  namespace:
    "https://github.com/spdx/tools-ts/examples/resources/spdx-tools-ts.sbom.json-21b3f009-ac30-4da3-a295-7172e0c4ba49",
  creators: {
    name: "Anton Bauhofer",
    type: "Person",
    email: "anton.bauhofer@tngtech.com",
  },
});

const uuidPackage = document.addPackage("uuid", {
  filesAnalyzed: true,
  downloadLocation: "https://github.com/uuidjs/uuid",
  verificationCode: {
    value: "b65013ce770696a72a0dded749a5058e5f8e2a4d",
  },
});
const eslintPackage = document.addPackage("eslint", {
  downloadLocation: "https://github.com/eslint/eslint",
  filesAnalyzed: false,
  comment: "This package is added just for testing.",
});

document
  .addRelationship(document, uuidPackage, "DESCRIBES")
  .addRelationship(uuidPackage, eslintPackage, "DEPENDS_ON");

const readmeFile = document.addFile(
  "README.md",
  {
    checksumValue: "de9f2c7fd25e1b3afad3e85a0bd17d9b100db4b3",
    checksumAlgorithm: "SHA1",
  },
  {
    fileTypes: ["TEXT"],
  },
);
document.addRelationship(uuidPackage, readmeFile, "CONTAINS");

document.writeSync("./examples/resources/spdx-tools-ts.spdx.json");

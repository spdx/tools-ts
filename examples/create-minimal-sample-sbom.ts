// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import * as sbom from "../lib/spdx-tools";

const document = sbom.createDocument("first-document", { spdxVersion: "2.3" });
const pkg = document.addPackage("first-package");
document.addRelationship(document, pkg, "DESCRIBES");
document.writeSync("./examples/resources/minimal-sample.spdx.json");

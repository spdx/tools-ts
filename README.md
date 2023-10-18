# Typescript library for creating SPDX documents

**Disclaimer**: This repository is work in progress and does not yet support all SPDX features.

## TL;DR

We provide a number of example workflows in the `lib/examples/` that demonstrate how this library can be used to create SBOMs.

## Usage
`SPDXSBOM` provides an API to compose and write SBOMs in the SPDX format.
The recommended way to use this library is to create a document, add contents to it and then write it to a file:

```javascript
import sbom from "../spdx-tools";
import { Package } from "../spdx2model/package";

const document = sbom.createDocument(
  "my-first-document",
  { name: "me", type: "Person" },
  { spdxVersion: "2.3" },
);
document.addPackages([
  new Package("first-package", "https://download-location.com", {
    filesAnalyzed: false,
  }),
]);
document.write("./sample.sbom.json");
```

# API
## Documents
Documents form the basis of SPDX SBOMs.
They contain all information and can be exported to different formats (currently only json is supported).
Documents can be created with the command `sbom.createDocument`:

```javascript
const document = sbom.createDocument(
    "my-first-document",
    [{ name: "My Name", type: "Person" }],
);
```

It requires the following arguments:

| Argument | Format | Description |
| ----------- | ----------- | ----------- |
| name | String | Name of the document |
| Creators | [{name: string, type: "Person" / "Organization" / "Tool", email?: string}] | Creators of the document |

In addition, it takes an object with the following optional parameters:

| Argument | Format | Default | Description |
| ----------- | ----------- | ----------- | ----------- |
| spdxVersion | string | 2.3 | SPDX version of the document |
| created | Date | current moment | Date of creation of the document |
| namespace | string | "https://\<documentName\>-\<UUID\>" | Namespace of the document |
| dataLicense | string | "CC0-1.0" | License of the document |
| externalDocumentRefs | {documentRefId: string, documentUri: string, checksum_value: string, checksum_algorithm: string} | - | External documents referenced by the document |
| creatorComment | string | - | Comment on the creator |
| licenseListVersion | string | - | Version of the license list used |
| documentComment | string | - | Comment on the document |

# Contributing
We welcome contributions to this repository.
See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

# License
[MIT](LICENSE)

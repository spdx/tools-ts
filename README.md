# Typescript library for creating SPDX documents

**Important:** This repository is in early development state and can not yet be used in production.

## TL;DR

We provide a number of example workflows in the `examples` directory that demonstrate how this library can be used to create SBOMs.

## Usage
`SPDXSBOM` provides an API to compose and write SBOMs in the SPDX format.
The recommended way to use this library is to create a document, add contents to it and then write it to a file:

```javascript
import sbom from "../spdx-tools";
import { Package } from "../spdx2model/package";

const document = sbom.createDocument("my-first-document");
const pkg = document.addPackage("my-package");
document.addRelationship(document, pkg, "DESCRIBES");

document.write("./sample.spdx.json");
```

# API
Please refer to [DOCUMENTATION.md](DOCUMENTATION.md) for a detailed API documentation.

## Supported features
This library is currently in early development state and not all features of SPDX are supported yet.
The following features are supported by this library:


### SPDX 2.3:
| Feature | State | Comment |
| ------- | ----- | ------- |
| Document creation | DONE
| Packages | PARTIAL | essential properties are supported
| Files | PARTIAL | essential properties are supported
| Relationships | DONE
| Snippets |  
| Annotations | 
| Other licensing information |

# Contributing
We welcome contributions to this repository.
See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

# License
[MIT](LICENSE)

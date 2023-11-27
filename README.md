<!--
SPDX-FileCopyrightText: 2023 SPDX contributors

SPDX-License-Identifier: CC0-1.0
-->

# @spdx/tools
Compose and write SBOMs in the SPDX format.

**Important:** This repository is in early development state and can not yet be used in production.

## Usage
The recommended way to use this library is to create a document, add contents to it and then write it to a file:

```javascript
import * as spdx from "../lib/spdx-tools";

const document = sbom.createDocument("my-first-document");
const pkg = document.addPackage("my-package");
document.addRelationship(document, pkg, "DESCRIBES");

document.write("./sample.spdx.json");
```

## Supported features
This library is currently in early development state and not all features of SPDX are supported yet.
The following features are supported by this library:

### SPDX 2.3:
| Feature | State |
| ------- | ----- |
| Document creation | DONE
| Packages | DONE
| Files | DONE
| Relationships | DONE
| Snippets | PLANNED
| Annotations | PLANNED
| Other licensing information | PLANNED

## API
We provide a number of example workflows in the `examples` directory that demonstrate how this library can be used to create SBOMs.

Please refer to [DOCUMENTATION.md](https://github.com/spdx/tools-ts/blob/main/DOCUMENTATION.md) for a detailed documentation of the API.

## Contributing
We welcome contributions to this repository.

See [CONTRIBUTING.md](https://github.com/spdx/tools-ts/blob/main/CONTRIBUTING.md) for more information.

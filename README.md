<!--
SPDX-FileCopyrightText: 2023 SPDX contributors

SPDX-License-Identifier: CC0-1.0
-->

# @spdx/tools
@spdx/tools is a lightweight JavaScript library for creating SBOMs in the SPDX format.
It enables you to create SPDX documents, add contents to it and write it to a file.

**Important:** This repository is in early development state and can not yet be used in production.

## Usage
Install the library using npm:

```bash
npm i @spdx/tools
```

The recommended way to use this library is to create a document, add contents to it and then write it to a file:

```javascript
import * as spdx from "@spdx/tools";

const document = spdx.createDocument("my-first-document");
const pkg = document.addPackage("my-package");
document.addRelationship(document, pkg, "DESCRIBES");

document.write("./sample.spdx.json");
```

## Supported features

This library is currently in early development state and supports only a limited set of features.
It allows for creating and writing of SPDX 2.3 documents in the JSON format.
Parsing and validation of existing documents is not yet supported.
Other output formats, besides JSON, as well as SPDX 3.0 are not yet supported.

The following features are supported by this library:
The library currently does not yet support all features of the SPDX 2.3 specification.
The following features are supported:

| Feature | State |
| ------- | ----- |
| Document creation | DONE
| Packages | DONE
| Files | DONE
| Relationships | DONE
| Other licensing information | DONE
| Snippets | PLANNED
| Annotations | PLANNED

## Documentation
Please refer to [DOCUMENTATION.md](https://github.com/spdx/tools-ts/blob/main/DOCUMENTATION.md) for a detailed documentation of the API.

We provide a number of example workflows in the `examples` directory that demonstrate how this library can be used to create SPDX documents.

## Contributing
We welcome contributions to this repository.

See [CONTRIBUTING.md](https://github.com/spdx/tools-ts/blob/main/CONTRIBUTING.md) for more information.

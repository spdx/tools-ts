<!--
SPDX-FileCopyrightText: 2023 spdx contributors

SPDX-License-Identifier: CC0-1.0
-->

# yarn-plugin-spdx

Create an SPDX SBOM file for the current project.

## Installation
```sh
yarn plugin import https://raw.githubusercontent.com/spdx/tools-ts/main/yarn-plugin/bundles/@yarnpkg/plugin-spdx.js
```

## Usage
```sh
yarn spdx --help
```

Note: Before using the plugin, make sure to run `yarn install` to install all dependencies for the current project.

## Limitations
- The plugin currently only supports SPDX json output format.
- For Yarn V3, the plugin currently only supports the `node-modules` linker.
- The plugin does currently not support monorepos.

## Attributions
Parts of the code in this plugin have been copied and / or adapted from https://github.com/mhassan1/yarn-plugin-licenses
We thank the authors for their work.

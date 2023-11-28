<!--
SPDX-FileCopyrightText: 2023 SPDX contributors

SPDX-License-Identifier: CC0-1.0
-->

# @spdx/yarn-plugin

A Yarn plugin to create SBOM files in the SPDX format.

When being run, this plugin will create an SBOM file for the current package.
The SBOM file will be written to the root directory of the package and have the name of the package.
It lists all contained dependencies and dev dependencies, as well as the relationship between them.

**Important:** This plugin is in early development state and can not yet be used in production.

## Usage
Install the package from `npm`:
```sh
yarn plugin import https://raw.githubusercontent.com/spdx/tools-ts/main/yarn-plugin/bundles/@yarnpkg/plugin-spdx.js
```

Create an SBOM file for the current package:
```sh
yarn spdx
```

Note: Before using the plugin, make sure to run `yarn install` to install all dependencies for the current project.

## Limitations
- The plugin currently only supports SPDX json output format.
- For Yarn V3, the plugin currently only supports the `node-modules` linker.
- The plugin does currently not support monorepos.

## Attributions
Parts of the code in this plugin have been copied and / or adapted from https://github.com/mhassan1/yarn-plugin-licenses
We thank the authors for their work.

<!--
SPDX-FileCopyrightText: 2023 SPDX contributors

SPDX-License-Identifier: CC0-1.0
-->

# @spdx/rollup-plugin
A Rollup plugin to create SBOM files in the SPDX format.

When added to a Rollup configuration, this plugin will create an SBOM file for the package that is being built.
The SBOM file will be written to the same directory as the output file.
It lists all built files and the source files they were built from, as well as the relationship between them.

**Important:** This plugin is in early development state and can not yet be used in production.

## Usage
Install the package from `npm`:
```bash
npm install --save-dev @spdx/rollup-plugin
```

Add the plugin to your `rollup.config.js`:
```javascript
import spdx from "@spdx/rollup-plugin";

const config = [
    // ...
    {
        input: "src/index.js",
        output: {
            file: "dist/index.js",
            format: "cjs"
        },
        plugins: [
            spdx("my-package")],
    },
];

export default config;
```

## Arguments
The plugin expects the name of the package as parameter.
The provided name will be used as the name of the created SBOM file.

## Contributing
We welcome contributions to this repository.

See [CONTRIBUTING.md](https://github.com/spdx/tools-ts/blob/main/CONTRIBUTING.md) for more information.

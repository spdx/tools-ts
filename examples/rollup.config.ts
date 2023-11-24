// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: [
    "examples/create-minimal-sample-sbom.ts",
    "examples/create-elaborate-sample-sbom.ts",
    "examples/create-basic-sbom.ts",
  ],
  plugins: [typescript({ sourceMap: true })],
  external: ["fs/promises", "uuid"],
  output: {
    dir: "examples/build",
    format: "es",
    sourcemap: true,
  },
});

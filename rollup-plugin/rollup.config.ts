// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const config = [
  {
    input: { "rollup-plugin-spdx": "sources/rollup-plugin-spdx.ts" },
    plugins: [typescript({ sourceMap: true })],
    external: ["@spdx/tools", "sha1-file", "path"],
    output: [
      {
        dir: "dist",
        format: "es",
        sourcemap: true,
        entryFileNames: "[name].mjs",
      },
      {
        dir: "dist",
        format: "cjs",
        sourcemap: true,
        entryFileNames: "[name].cjs",
      },
    ],
  },
  {
    input: { "rollup-plugin-spdx": "sources/rollup-plugin-spdx.ts" },
    plugins: [dts()],
    external: ["@spdx/tools"],
    output: [
      {
        dir: "dist",
        format: "es",
        sourcemap: true,
        entryFileNames: "[name].d.ts",
      },
    ],
  },
];

export default config;

// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const config = [
  {
    input: { "spdx-tools": "lib/spdx-tools.ts" },
    plugins: [typescript({ sourceMap: true })],
    external: ["fs/promises", "uuid"],
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
    input: { "spdx-tools": "lib/spdx-tools.ts" },
    plugins: [dts()],
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

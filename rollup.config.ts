import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";

const config = [
  {
    input: { "spdx-tools": "lib/spdx-tools.ts" },
    plugins: [typescript({ sourceMap: true }), json()],
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

import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: { "spdx-tools": "lib/spdx-tools.ts" },
  plugins: [typescript({ sourceMap: true })],
  external: ["fs"],
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
});

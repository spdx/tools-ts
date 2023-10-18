import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: "lib/examples/create-minimal-sample-sbom.ts",
  plugins: [typescript({ sourceMap: true })],
  external: ["fs"],
  output: {
    dir: "lib/examples/build",
    format: "es",
    sourcemap: true,
  },
});

import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: [
    "lib/examples/create-minimal-sample-sbom.ts",
    "lib/examples/create-elaborate-sample-sbom.ts",
  ],
  plugins: [typescript({ sourceMap: true })],
  external: ["fs/promises", "uuid"],
  output: {
    dir: "lib/examples/build",
    format: "es",
    sourcemap: true,
  },
});

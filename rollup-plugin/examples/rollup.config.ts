// SPDX-FileCopyrightText: 2023 spdx contributors
//
// SPDX-License-Identifier: MIT

import { defineConfig } from "rollup";
import spdx from "../sources/rollup-plugin-spdx";
import typescript from "@rollup/plugin-typescript";
import { fileURLToPath } from "url";

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  input: `${__dirname}index.ts`,
  plugins: [spdx("hello"), typescript({})],
  output: { dir: `${__dirname}dist`, format: "es" },
});

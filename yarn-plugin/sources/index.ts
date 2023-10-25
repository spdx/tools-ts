import type { Plugin } from "@yarnpkg/core";
import { SpdxCommand } from "./commands/spdx";

const plugin: Plugin = {
  commands: [SpdxCommand],
};

export default plugin;

// SPDX-FileCopyrightText: 2023 spdx contributors
//
// SPDX-License-Identifier: MIT

import type { Plugin } from "@yarnpkg/core";
import { SpdxCommand } from "./commands/spdx";

const plugin: Plugin = {
  commands: [SpdxCommand],
};

export default plugin;

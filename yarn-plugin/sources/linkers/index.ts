// SPDX-FileCopyrightText: 2023 spdx contributors
// SPDX-FileCopyrightText: 2023 Marc Hassan
//
// SPDX-License-Identifier: MIT

import type { Project, Package } from "@yarnpkg/core";
import * as nodeModules from "./node-modules";
import * as pnpm from "./pnpm";
import * as pnp from "./pnp";
import type { PortablePath, FakeFS } from "@yarnpkg/fslib";

/* istanbul ignore next */
/**
 * Resolve linker from `nodeLinker` configuration
 *
 * @param {string} nodeLinker - `nodeLinker` configuration
 * @returns {Linker} linker
 */
export const resolveLinker = (nodeLinker: string): Linker => {
  switch (nodeLinker) {
    case "pnp":
      return pnp;
    case "node-modules":
      return nodeModules as Linker;
    case "pnpm":
      return pnpm as Linker;
    default:
      throw new Error("Unsupported linker");
  }
};

export interface Linker {
  getPackagePath: (
    project: Project,
    pkg: Package,
  ) => Promise<PortablePath | null>;
  fs?: FakeFS<PortablePath>;
  getFs?: () => FakeFS<PortablePath>;
}

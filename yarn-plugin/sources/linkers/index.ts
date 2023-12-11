// SPDX-FileCopyrightText: 2023 SPDX contributors
// SPDX-FileCopyrightText: 2023 Marc Hassan
//
// SPDX-License-Identifier: MIT

import type { Project, Package } from "@yarnpkg/core";
import * as nodeModules from "./node-modules";
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
    case "node-modules":
      return nodeModules as Linker;
    default:
      throw new Error("Unsupported linker: " + nodeLinker);
  }
};

export interface Linker {
  getPackagePath: (
    project: Project,
    pkg: Package,
  ) => Promise<PortablePath | null>;
  fs: FakeFS<PortablePath>;
}

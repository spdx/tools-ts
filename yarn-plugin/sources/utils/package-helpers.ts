// SPDX-FileCopyrightText: 2023 SPDX contributors
// SPDX-FileCopyrightText: 2023 Marc Hassan
//
// SPDX-License-Identifier: MIT

import type { Descriptor, Package } from "@yarnpkg/core";
import type { IdentHash } from "@yarnpkg/core/lib/types";

export function getTopLevelPackages(
  packages: Map<Descriptor, Package>,
  allDependencies: IdentHash[],
): Map<Descriptor, Package> {
  const topLevelPackages = new Map<Descriptor, Package>();
  for (const [descriptor, pkg] of packages.entries()) {
    if (packageIsTopLevel(allDependencies, descriptor)) {
      topLevelPackages.set(descriptor, pkg);
    }
  }
  return topLevelPackages;
}

export function packageIsTopLevel(
  allDependencies: IdentHash[],
  descriptor: Descriptor,
): boolean {
  return !allDependencies.includes(descriptor.identHash);
}

export function getTopLevelDevDependencyPackages(
  topLevelPackages: Map<Descriptor, Package>,
  sortedMixedPackages: Map<Descriptor, Package>,
  devDependencyIdentHashes: Set<IdentHash>,
): Map<Descriptor, Package> {
  const topLevelDevDependencyPackages = new Map<Descriptor, Package>();

  for (const [, pkg] of topLevelPackages.entries()) {
    for (const [
      dependencyIdentHash,
      dependencyDescriptor,
    ] of pkg.dependencies.entries()) {
      if (devDependencyIdentHashes.has(dependencyIdentHash)) {
        topLevelDevDependencyPackages.set(
          dependencyDescriptor,
          sortedMixedPackages.get(dependencyDescriptor),
        );
      }
    }
  }

  return topLevelDevDependencyPackages;
}

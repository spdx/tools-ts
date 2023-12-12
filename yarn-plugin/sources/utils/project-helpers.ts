// SPDX-FileCopyrightText: 2023 SPDX contributors
// SPDX-FileCopyrightText: 2023 Marc Hassan
//
// SPDX-License-Identifier: MIT

import type { Descriptor, Package, Report, Workspace } from "@yarnpkg/core";
import {
  Cache,
  Configuration,
  miscUtils,
  structUtils,
  ThrowReport,
  Project,
} from "@yarnpkg/core";
import type { InstallOptions } from "@yarnpkg/core/lib/Project";
import type { IdentHash } from "@yarnpkg/core/lib/types";
import { WorkspaceRequiredError } from "@yarnpkg/cli";
import type { SpdxCommand } from "../commands/spdx";
import type { Linker } from "../linkers";
import { resolveLinker } from "../linkers";
import * as nodeModules from "../linkers/node-modules";

export async function setupProject(
  command: SpdxCommand,
): Promise<[Project, Workspace]> {
  const configuration = await Configuration.find(
    command.context.cwd,
    command.context.plugins,
  );
  const { project, workspace } = await Project.find(
    configuration,
    command.context.cwd,
  );
  if (!workspace) {
    throw new WorkspaceRequiredError(project.cwd, command.context.cwd);
  }
  await project.restoreInstallState();
  return [project, workspace];
}

export function getLinker(project: Project): Linker {
  const nodeLinker = project.configuration.get("nodeLinker");
  let linker: Linker;
  if (typeof nodeLinker === "string") {
    linker = resolveLinker(nodeLinker);
  } else {
    linker = nodeModules as Linker;
  }
  return linker;
}

export const getDevDependencies = (project: Project): Set<IdentHash> => {
  const devDependencies = new Set<IdentHash>();
  for (const workspace of project.workspaces) {
    workspace.manifest.devDependencies.forEach((descriptor, identHash) => {
      devDependencies.add(identHash);
    });
  }

  return devDependencies;
};

export const clearDevDependencies = async (project: Project): Promise<void> => {
  for (const workspace of project.workspaces) {
    workspace.manifest.devDependencies.clear();
  }
  const cache: Cache = await Cache.find(project.configuration);
  const report: Report = new ThrowReport();
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  await project.resolveEverything({
    report,
    cache,
  } as Pick<
    InstallOptions,
    `report` | `resolver` | `checkResolutions` | `mode`
  > &
    (
      | {
          report: Report;
          lockfileOnly: true;
        }
      | {
          lockfileOnly?: boolean;
          cache: Cache;
        }
    ));
};

export const getSortedPackages = async (
  project: Project,
): Promise<Map<Descriptor, Package>> => {
  const packages = new Map<Descriptor, Package>();

  const storedDescriptors: Iterable<Descriptor> =
    project.storedDescriptors.values();
  const sortedDescriptors = miscUtils.sortMap(storedDescriptors, [
    (descriptor) => structUtils.stringifyIdent(descriptor),
    // store virtual descriptors before non-virtual descriptors because the `node-modules` linker prefers virtual
    (descriptor) => (structUtils.isVirtualDescriptor(descriptor) ? "0" : "1"),
    (descriptor) => descriptor.range,
  ]);

  const seenDescriptorHashes = new Set<string>();
  for (const descriptor of sortedDescriptors.values()) {
    const identHash = project.storedResolutions.get(descriptor.descriptorHash);
    if (!identHash) continue;
    const pkg = project.storedPackages.get(identHash);
    if (!pkg) continue;

    const { descriptorHash } = structUtils.isVirtualDescriptor(descriptor)
      ? structUtils.devirtualizeDescriptor(descriptor)
      : descriptor;
    if (seenDescriptorHashes.has(descriptorHash)) continue;
    seenDescriptorHashes.add(descriptorHash);

    packages.set(descriptor, pkg);
  }

  return packages;
};

export interface ManifestWithLicenseInfo {
  license?: string;
  repository?: { url: string } | string;
}

// TODO: Add credits: This is copied from https://github.com/mhassan1/yarn-plugin-licenses
import type { Descriptor, Package, Project, Report } from "@yarnpkg/core";
import { Cache, miscUtils, structUtils, ThrowReport } from "@yarnpkg/core";
import type { InstallOptions } from "@yarnpkg/core/lib/Project";

export const getSortedPackages = async (
  project: Project,
  recursive: boolean,
  production: boolean,
): Promise<Map<Descriptor, Package>> => {
  const packages = new Map<Descriptor, Package>();
  let storedDescriptors: Iterable<Descriptor>;
  if (recursive) {
    if (production) {
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
    }
    storedDescriptors = project.storedDescriptors.values();
  } else {
    storedDescriptors = project.workspaces.flatMap((workspace) => {
      const dependencies = [workspace.anchoredDescriptor];
      for (const [
        identHash,
        dependency,
      ] of workspace.anchoredPackage.dependencies.entries()) {
        if (production && workspace.manifest.devDependencies.has(identHash)) {
          continue;
        }
        dependencies.push(dependency);
      }
      return dependencies;
    });
  }

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
  name: string;
  license?: ManifestLicenseValue;
  licenses?: ManifestLicenseValue | ManifestLicenseValue[];
  repository?: { url: string } | string;
  homepage?: string;
  author?: { name: string; url: string };
}

type ManifestLicenseValue = string | { type: string };

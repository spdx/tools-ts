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
import { WorkspaceRequiredError } from "@yarnpkg/cli";
import type { Linker } from "./linkers";
import { resolveLinker } from "./linkers";
import * as nodeModules from "./linkers/node-modules";

const spdxNoAssertion = "NOASSERTION";
const spdxIdPrependix = "SPDXRef-";

const urlRegex =
  "(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/|" +
  "ssh:\\/\\/|git:\\/\\/|svn:\\/\\/|sftp:\\/\\/|" +
  "ftp:\\/\\/)?([\\w\\-.!~*'()%;:&=+$,]+@)?[a-z0-9]+" +
  "([\\-\\.]{1}[a-z0-9]+){0,100}\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?";

const supportedDownloadRepos = "(git|hg|svn|bzr)";
const gitRegex = "(git\\+git@[a-zA-Z0-9\\.\\-]+:[a-zA-Z0-9/\\\\.@\\-]+)";
const bazaarRegex = "(bzr\\+lp:[a-zA-Z0-9\\.\\-]+)";
const downloadLocationRegex =
  "^(((" +
  supportedDownloadRepos +
  "\\+)?" +
  urlRegex +
  ")|" +
  gitRegex +
  "|" +
  bazaarRegex +
  ")$";

export interface ManifestWithLicenseInfo {
  name: string;
  license?: ManifestLicenseValue;
  licenses?: ManifestLicenseValue | ManifestLicenseValue[];
  repository?: { url: string } | string;
  homepage?: string;
  author?: { name: string; url: string };
}

type ManifestLicenseValue = string | { type: string };

export async function setupProject(): Promise<[Project, Workspace]> {
  const configuration = await Configuration.find(
    this.context.cwd,
    this.context.plugins,
  );
  const { project, workspace } = await Project.find(
    configuration,
    this.context.cwd,
  );
  if (!workspace) {
    throw new WorkspaceRequiredError(project.cwd, this.context.cwd);
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

/**
 * Get a sorted map of packages for the project
 *
 * @param {Project} project - Yarn project
 * @param {boolean} recursive - Whether to get packages recursively
 * @param {boolean} production - Whether to exclude devDependencies
 * @returns {Promise<Map<Descriptor, Package>>} Map of packages in the project
 */
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

export async function getPackageInfos(
  packageManifest: ManifestWithLicenseInfo,
): Promise<string> {
  const { repository } = packageManifest;
  const formattedRepository: string = getDownloadLocation(repository);
  return formattedRepository;
}

export function getDownloadLocation(
  repository: { url: string } | string | undefined,
): string {
  if (
    repository &&
    typeof repository === "object" &&
    isValidDownloadLocation(repository.url)
  ) {
    return repository.url;
  } else {
    return spdxNoAssertion;
  }
}

function isValidDownloadLocation(downloadLocation: string): boolean {
  return (
    new RegExp(urlRegex).test(downloadLocation) &&
    new RegExp(downloadLocationRegex).test(downloadLocation)
  );
}

export function getSpdxId(pkg: Package): string {
  const pkgName = pkg.name.replace(/^@/, "").replace(/_/g, "-");
  const pkgVersion = pkg.version.replace(/\//g, ".").replace(/_/g, "-");
  return spdxIdPrependix + pkgName + "-" + pkgVersion;
}

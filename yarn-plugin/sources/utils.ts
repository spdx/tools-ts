// TODO: Add credits: This is copied from https://github.com/mhassan1/yarn-plugin-licenses
import type { Descriptor, Package, Project, Report } from "@yarnpkg/core";
import { Cache, miscUtils, structUtils, ThrowReport } from "@yarnpkg/core";
import type { InstallOptions } from "@yarnpkg/core/lib/Project";
// import * as hostedGitInfo from "hosted-git-info";

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

interface Author {
  name?: string;
  email?: string;
  url?: string;
}

/**
 * Get author information from a manifest's author string
 *
 * @param {string} author - format: "name (url) <email>"
 * @returns {Author} parsed author information
 */
export function parseAuthor(author: string): Author {
  const result: Author = {};

  const nameMatch = author.match(/^([^(<]+)/);
  if (nameMatch) {
    const name = nameMatch[0].trim();
    if (name) {
      result.name = name;
    }
  }

  const emailMatch = author.match(/<([^>]+)>/);
  if (emailMatch) {
    result.email = emailMatch[1];
  }

  const urlMatch = author.match(/\(([^)]+)\)/);
  if (urlMatch) {
    result.url = urlMatch[1];
  }

  return result;
}

type ManifestLicenseValue = string | { type: string };

/**
 * Get license information from a manifest
 *
 * @param {ManifestWithLicenseInfo} manifest - Manifest with license information
 * @returns {LicenseInfo} License information
 */
export const getLicenseInfoFromManifest = (
  manifest: ManifestWithLicenseInfo,
): LicenseInfo => {
  const { license, licenses, repository, homepage, author } = manifest;

  const vendor = typeof author === "string" ? parseAuthor(author) : author;

  const getNormalizedLicense = (): string => {
    if (license) {
      return normalizeManifestLicenseValue(license);
    }
    if (licenses) {
      if (!Array.isArray(licenses)) {
        return normalizeManifestLicenseValue(licenses);
      }
      if (licenses.length === 1) {
        return normalizeManifestLicenseValue(licenses[0]);
      }
      if (licenses.length > 1) {
        return `(${licenses.map(normalizeManifestLicenseValue).join(" OR ")})`;
      }
    }
    return UNKNOWN_LICENSE;
  };

  return {
    license: getNormalizedLicense(),
    url: repository,
    // TODO: Properly fix this
    // url: normalizeManifestRepositoryUrl(repository) || homepage,
    vendorName: vendor?.name,
    vendorUrl: homepage || vendor?.url,
  };
};

interface ManifestWithLicenseInfo {
  name: string;
  license?: ManifestLicenseValue;
  licenses?: ManifestLicenseValue | ManifestLicenseValue[];
  repository?: { url: string } | string;
  homepage?: string;
  author?: { name: string; url: string };
}

const UNKNOWN_LICENSE = "UNKNOWN";

/**
 * Normalize a manifest license value into a license string
 *
 * @param {ManifestLicenseValue} manifestLicenseValue - Manifest license value
 * @returns {string} License string
 */
const normalizeManifestLicenseValue = (
  manifestLicenseValue: ManifestLicenseValue,
): string =>
  (typeof manifestLicenseValue !== "string"
    ? manifestLicenseValue.type
    : manifestLicenseValue) || UNKNOWN_LICENSE;

interface LicenseInfo {
  license: string;
  url?: { url: string } | string;
  // url?: string;
  vendorName?: string;
  vendorUrl?: string;
}

// /**
//  * Normalize a manifest repository value into a repository URL, if found
//  *
//  * @param {ManifestWithLicenseInfo['repository']} manifestRepositoryValue - Manifest repository value
//  * @returns {string|undefined} Repository URL, if found
//  */
// const normalizeManifestRepositoryUrl = (
//   manifestRepositoryValue: ManifestWithLicenseInfo["repository"],
// ): string | undefined => {
//   const rawRepositoryUrl =
//     typeof manifestRepositoryValue === "string"
//       ? manifestRepositoryValue
//       : manifestRepositoryValue?.url;
//   if (!rawRepositoryUrl) return rawRepositoryUrl;
//   const hosted = hostedGitInfo.fromUrl(rawRepositoryUrl);
//   return !hosted || hosted.getDefaultRepresentation() !== "shortcut"
//     ? rawRepositoryUrl
//     : hosted.https();
// };

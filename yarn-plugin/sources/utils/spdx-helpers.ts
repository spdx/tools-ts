// SPDX-FileCopyrightText: 2023 spdx contributors
//
// SPDX-License-Identifier: MIT

import type { Package, Descriptor, Project } from "@yarnpkg/core";
import type { SPDXDocument as SPDX2Document } from "../../../lib/api/spdx-document";
import type { Linker } from "../linkers";
import type { ManifestWithLicenseInfo } from "./project-helpers";
import { Filename, ppath } from "@yarnpkg/fslib";

const spdxNoAssertion = "NOASSERTION";
const spdxIdPrependix = "SPDXRef-";
const spdxDescribes = "DESCRIBES";
const spdxDependsOn = "DEPENDS_ON";
const spdxDevDependsOf = "DEV_DEPENDENCY_OF";

const urlExpression =
  "(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/|" +
  "ssh:\\/\\/|git:\\/\\/|svn:\\/\\/|sftp:\\/\\/|" +
  "ftp:\\/\\/)?([\\w\\-.!~*'()%;:&=+$,]+@)?[a-z0-9]+" +
  "([\\-\\.]{1}[a-z0-9]+){0,100}\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?";
const supportedDownloadRepos = "(git|hg|svn|bzr)";
const gitExpression = "(git\\+git@[a-zA-Z0-9\\.\\-]+:[a-zA-Z0-9/\\\\.@\\-]+)";
const bazaarExpression = "(bzr\\+lp:[a-zA-Z0-9\\.\\-]+)";
const downloadLocationExpression =
  "^(((" +
  supportedDownloadRepos +
  "\\+)?" +
  urlExpression +
  ")|" +
  gitExpression +
  "|" +
  bazaarExpression +
  ")$";

const urlRegex = new RegExp(urlExpression);
const downloadLocationRegex = new RegExp(downloadLocationExpression);

export function getDownloadLocation(
  repository: { url: string } | string | undefined,
): string | undefined {
  if (
    repository &&
    typeof repository === "object" &&
    isValidDownloadLocation(repository.url)
  ) {
    return repository.url;
  } else if (repository && typeof repository === "object") {
    return undefined;
  } else {
    return spdxNoAssertion;
  }
}

function isValidDownloadLocation(downloadLocation: string): boolean {
  return (
    urlRegex.test(downloadLocation) &&
    downloadLocationRegex.test(downloadLocation)
  );
}

export function getSpdxId(pkg: Package): string {
  const pkgName = pkg.name.replace(/^@/, "").replace(/_/g, "-");
  const pkgVersion = pkg.version.replace(/\//g, ".").replace(/_/g, "-");
  return spdxIdPrependix + pkgName + "-" + pkgVersion;
}

export async function addPackagesToSpdxDocument(
  packages: Map<Descriptor, Package>,
  spdxDocument: SPDX2Document,
  project: Project,
  linker: Linker,
  existingSpdxIds: Set<string>,
): Promise<void> {
  for (const [, pkg] of packages.entries()) {
    if (!pkg) continue;
    const packagePath = await linker.getPackagePath(project, pkg);
    if (packagePath === null) return;
    const packageManifest: ManifestWithLicenseInfo = JSON.parse(
      await linker.fs.readFilePromise(
        ppath.join(packagePath, Filename.manifest),
        "utf8",
      ),
    );
    const { repository } = packageManifest;
    const formattedRepository: string | undefined =
      getDownloadLocation(repository);

    const currentPkgSpdxId = getSpdxId(pkg);
    if (existingSpdxIds.has(currentPkgSpdxId)) return;
    existingSpdxIds.add(currentPkgSpdxId);

    spdxDocument.addPackage(pkg.name, {
      ...(formattedRepository !== undefined && {
        downloadLocation: formattedRepository,
      }),
      spdxId: currentPkgSpdxId,
    });
  }
}

export function addDescribesRelationshipsToSpdxDocument(
  packages: Map<Descriptor, Package>,
  spdxDocument: SPDX2Document,
  existingSpdxIds: Set<string>,
): void {
  for (const [, pkg] of packages.entries()) {
    const currentPkgSpdxId = getSpdxId(pkg);
    if (existingSpdxIds.has(currentPkgSpdxId)) {
      spdxDocument.addRelationship(
        spdxDocument,
        currentPkgSpdxId,
        spdxDescribes,
      );
    }
  }
}

export function addDevRelationshipsToSpdxDocument(
  packages: Map<Descriptor, Package>,
  spdxDocument: SPDX2Document,
  project: Project,
  existingSpdxIds: Set<string>,
  devDependencyIdentHashes: Set<string>,
): void {
  for (const [, pkg] of packages.entries()) {
    const currentPkgSpdxId = getSpdxId(pkg);

    for (const [
      dependencyIdentHash,
      dependencyDescriptor,
    ] of pkg.dependencies.entries()) {
      if (!devDependencyIdentHashes.has(dependencyIdentHash)) continue;

      const dependencySpdxId = getDependencySpdxIdToAdd(
        project,
        dependencyDescriptor,
      );
      if (
        !dependencySpdxId ||
        !existingSpdxIds.has(dependencySpdxId) ||
        !existingSpdxIds.has(currentPkgSpdxId)
      )
        continue;

      spdxDocument.addRelationship(
        dependencySpdxId,
        currentPkgSpdxId,
        spdxDevDependsOf,
      );
    }
  }
}

export function addProdRelationshipsToSpdxDocument(
  packages: Map<Descriptor, Package>,
  spdxDocument: SPDX2Document,
  project: Project,
  existingSpdxIds: Set<string>,
): void {
  for (const [, pkg] of packages.entries()) {
    const currentPkgSpdxId = getSpdxId(pkg);

    for (const [, dependencyDescriptor] of pkg.dependencies.entries()) {
      const dependencySpdxId = getDependencySpdxIdToAdd(
        project,
        dependencyDescriptor,
      );
      if (
        !dependencySpdxId ||
        !existingSpdxIds.has(dependencySpdxId) ||
        !existingSpdxIds.has(currentPkgSpdxId)
      )
        continue;

      spdxDocument.addRelationship(
        currentPkgSpdxId,
        dependencySpdxId,
        spdxDependsOn,
      );
    }
  }
}

function getDependencySpdxIdToAdd(
  project: Project,
  dependencyDescriptor: Descriptor,
): string | undefined {
  const locatorHash = project.storedResolutions.get(
    dependencyDescriptor.descriptorHash,
  );
  if (!locatorHash) return;
  const dependencyPkg = project.storedPackages.get(locatorHash);
  if (!dependencyPkg) return;
  return getSpdxId(dependencyPkg);
}

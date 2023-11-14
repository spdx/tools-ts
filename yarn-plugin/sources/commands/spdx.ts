import { BaseCommand, WorkspaceRequiredError } from "@yarnpkg/cli";
import type { Descriptor, Package } from "@yarnpkg/core";
import { Configuration, Project } from "@yarnpkg/core";
import * as spdx from "../../../lib/spdx-tools";
import type { Usage } from "clipanion";
import { Command } from "clipanion";
import type { ManifestWithLicenseInfo } from "../utils";
import { getDevDependencies, getSortedPackages } from "../utils";
import type { Linker } from "../linkers";
import { resolveLinker } from "../linkers";
import * as nodeModules from "../linkers/node-modules";
import { Filename, ppath } from "@yarnpkg/fslib";
import type { IdentHash } from "@yarnpkg/core/lib/types";

const spdxNoAssertion = "NOASSERTION";
const spdxIdPrependix = "SPDXRef-";
const spdxDependsOn = "DEPENDS_ON";
const spdxDevDependsOf = "DEV_DEPENDENCY_OF";
const spdxDescribes = "DESCRIBES";
const spdxJsonFileExtension = ".spdx.json";

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

export class SpdxCommand extends BaseCommand {
  static paths = [[`spdx`]];

  static usage: Usage = Command.Usage({
    description: `Generate SPDX document for the project`,
    details: `
        This command generates an SPDX document for the project. The document will be placed in the root of the project.`,

    examples: [[`Generate SPDX document`, `$0 spdx`]],
  });

  async execute(): Promise<void> {
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

    const spdxDocument = spdx.createDocument(
      workspace.manifest.name?.name ?? "spdx",
    );

    const nodeLinker = project.configuration.get("nodeLinker");
    let linker: Linker;
    if (typeof nodeLinker === "string") {
      linker = resolveLinker(nodeLinker);
    } else {
      linker = nodeModules as Linker;
    }

    const existingSpdxIds = new Set<string>();

    const devDependencyIdentHashes = getDevDependencies(project);
    const sortedMixedPackages = await getSortedPackages(project, true);
    const allDependencies = [...sortedMixedPackages].flatMap(([, pkg]) =>
      [...pkg.dependencies].flatMap(([, descriptor]) => descriptor.identHash),
    );
    const topLevelPackages = getTopLevelPackages(
      sortedMixedPackages,
      allDependencies,
    );
    const topLevelDevDependencyPackages = getTopLevelDevDependencyPackages(
      topLevelPackages,
      sortedMixedPackages,
      devDependencyIdentHashes,
    );

    // TODO: Extract function add dev packages
    for (const [, pkg] of topLevelPackages.entries()) {
      const packagePath = await linker.getPackagePath(project, pkg);
      if (packagePath === null) continue;
      const packageManifest: ManifestWithLicenseInfo = JSON.parse(
        await linker.fs.readFilePromise(
          ppath.join(packagePath, Filename.manifest),
          "utf8",
        ),
      );
      const { repository } = packageManifest;
      const formattedRepository: string = getDownloadLocation(repository);

      const currentPkgSpdxId = getSpdxId(pkg);
      if (existingSpdxIds.has(currentPkgSpdxId)) continue;
      existingSpdxIds.add(currentPkgSpdxId);

      spdxDocument.addPackage(pkg.name, {
        downloadLocation: formattedRepository,
        spdxId: currentPkgSpdxId,
      });
    }

    // // TODO: Extract function add dev packages
    for (const [, pkg] of topLevelDevDependencyPackages.entries()) {
      // TODO: pkg is sometimes undefined. Why?
      if (!pkg) continue;
      const packagePath = await linker.getPackagePath(project, pkg);
      if (packagePath === null) continue;
      const packageManifest: ManifestWithLicenseInfo = JSON.parse(
        await linker.fs.readFilePromise(
          ppath.join(packagePath, Filename.manifest),
          "utf8",
        ),
      );
      const { repository } = packageManifest;
      const formattedRepository: string = getDownloadLocation(repository);

      const currentPkgSpdxId = getSpdxId(pkg);
      if (existingSpdxIds.has(currentPkgSpdxId)) continue;
      existingSpdxIds.add(currentPkgSpdxId);

      spdxDocument.addPackage(pkg.name, {
        downloadLocation: formattedRepository,
        spdxId: currentPkgSpdxId,
      });
    }

    console.log("EXISTING IDS: ", existingSpdxIds);

    // TODO: Extract function add dev relationships
    for (const [, pkg] of topLevelPackages.entries()) {
      const currentPkgSpdxId = getSpdxId(pkg);
      console.log("CURRENT ID: ", currentPkgSpdxId);

      for (const [
        dependencyIdentHash,
        dependencyDescriptor,
      ] of pkg.dependencies.entries()) {
        if (!devDependencyIdentHashes.has(dependencyIdentHash)) continue;

        const locatorHash = project.storedResolutions.get(
          dependencyDescriptor.descriptorHash,
        );
        if (!locatorHash) continue;
        const dependencyPkg = project.storedPackages.get(locatorHash);
        if (!dependencyPkg) continue;

        console.log("DEPENDENCY ID: ", getSpdxId(dependencyPkg));
        if (
          !existingSpdxIds.has(currentPkgSpdxId) ||
          !existingSpdxIds.has(getSpdxId(dependencyPkg))
        )
          continue;

        spdxDocument.addRelationship(
          getSpdxId(dependencyPkg),
          currentPkgSpdxId,
          spdxDevDependsOf,
        );
      }
    }

    // This needs to happen after handling the dev dependencies, since the dev dependencies are cleared in the project manifest
    const sortedProdPackages = await getSortedPackages(project);
    const allProdDependencies = [...sortedProdPackages].flatMap(([, pkg]) =>
      [...pkg.dependencies].flatMap(([, descriptor]) => descriptor.identHash),
    );

    // TODO: Extract function add prod packages
    for (const [, pkg] of sortedProdPackages.entries()) {
      const packagePath = await linker.getPackagePath(project, pkg);
      if (packagePath === null) continue;
      const packageManifest: ManifestWithLicenseInfo = JSON.parse(
        await linker.fs.readFilePromise(
          ppath.join(packagePath, Filename.manifest),
          "utf8",
        ),
      );
      const { repository } = packageManifest;
      const formattedRepository: string = getDownloadLocation(repository);

      const currentPkgSpdxId = getSpdxId(pkg);
      if (existingSpdxIds.has(currentPkgSpdxId)) continue;
      existingSpdxIds.add(currentPkgSpdxId);

      spdxDocument.addPackage(pkg.name, {
        downloadLocation: formattedRepository,
        spdxId: currentPkgSpdxId,
      });
    }

    // TODO: Extract function add prod relationships
    for (const [descriptor, pkg] of sortedProdPackages.entries()) {
      const currentPkgSpdxId = getSpdxId(pkg);
      if (
        packageIsTopLevel(allProdDependencies, descriptor) &&
        existingSpdxIds.has(currentPkgSpdxId)
      ) {
        spdxDocument.addRelationship(
          spdxDocument,
          currentPkgSpdxId,
          spdxDescribes,
        );
      }

      for (const [, dependencyDescriptor] of pkg.dependencies.entries()) {
        const locatorHash = project.storedResolutions.get(
          dependencyDescriptor.descriptorHash,
        );
        if (!locatorHash) continue;
        const dependencyPkg = project.storedPackages.get(locatorHash);
        if (!dependencyPkg) continue;

        if (
          !existingSpdxIds.has(currentPkgSpdxId) ||
          !existingSpdxIds.has(getSpdxId(dependencyPkg))
        )
          continue;

        spdxDocument.addRelationship(
          currentPkgSpdxId,
          getSpdxId(dependencyPkg),
          spdxDependsOn,
        );
      }
    }

    spdxDocument.writeSync(
      (workspace.manifest.name?.name ?? "") + spdxJsonFileExtension,
    );
  }
}

function getTopLevelPackages(
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

function packageIsTopLevel(
  allDependencies: IdentHash[],
  descriptor: Descriptor,
): boolean {
  return !allDependencies.includes(descriptor.identHash);
}

function getTopLevelDevDependencyPackages(
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

function getDownloadLocation(
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

function getSpdxId(pkg: Package): string {
  const pkgName = pkg.name.replace(/^@/, "").replace(/_/g, "-");
  const pkgVersion = pkg.version.replace(/\//g, ".").replace(/_/g, "-");
  return spdxIdPrependix + pkgName + "-" + pkgVersion;
}

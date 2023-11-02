import { BaseCommand, WorkspaceRequiredError } from "@yarnpkg/cli";
import type { Package } from "@yarnpkg/core";
import { Configuration, Project } from "@yarnpkg/core";
import * as spdx from "../../../lib/spdx-tools";
import type { Usage } from "clipanion";
import { Command, Option } from "clipanion";
import type { ManifestWithLicenseInfo } from "../utils";
import { getLicenseInfoFromManifest, getSortedPackages } from "../utils";
import type { Linker } from "../linkers";
import { resolveLinker } from "../linkers";
import * as nodeModules from "../linkers/node-modules";
import { Filename, ppath } from "@yarnpkg/fslib";

const spdxNoAssertion = "NOASSERTION";
const spdxIdPrependix = "SPDXRef-";
const spdxDependsOn = "DEPENDS_ON";
const spdxDescribes = "DESCRIBES";
const spdxJsonFileExtension = ".spdx.json";

export class SpdxCommand extends BaseCommand {
  static paths = [[`spdx`]];

  recursive = Option.Boolean(`-R,--recursive`, true, {
    description: `Include transitive dependencies (dependencies of direct dependencies)`,
  });

  production = Option.Boolean(`--production`, true, {
    description: `Exclude development dependencies`,
  });

  static usage: Usage = Command.Usage({
    description: `Generate SPDX document for the project`,
    details: `
        This command generates an SPDX document for the project. By default, the document will be placed in the root of the project.

        If \`-R,--recursive\` is set, the listing will include transitive dependencies (dependencies of direct dependencies).

        If \`--production\` is set, the listing will exclude development dependencies.`,
    examples: [
      [`Generate SPDX document`, `$0 spdx`],
      [
        `Generate SPDX document with only direct dependencies`,
        `$0 spdx --recursive true`,
      ],
      [
        `Generate SPDX document with only production dependencies`,
        `$0 spdx --production true`,
      ],
    ],
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

    const sortedPackages = await getSortedPackages(
      project,
      this.recursive,
      this.production,
    );
    const allDependencies = [...sortedPackages].flatMap(([, pkg]) =>
      [...pkg.dependencies].flatMap(
        ([, descriptor]) => descriptor.descriptorHash,
      ),
    );

    const nodeLinker = project.configuration.get("nodeLinker");
    let linker: Linker;
    if (typeof nodeLinker === "string") {
      linker = resolveLinker(nodeLinker);
    } else {
      linker = nodeModules as Linker;
    }

    const existingSpdxIds = new Set<string>();
    for (const [descriptor, pkg] of sortedPackages.entries()) {
      const packagePath = await linker.getPackagePath(project, pkg);
      if (packagePath === null) continue;
      const packageManifest: ManifestWithLicenseInfo = JSON.parse(
        await linker.fs.readFilePromise(
          ppath.join(packagePath, Filename.manifest),
          "utf8",
        ),
      );
      // const { repository } = packageManifest;
      // const { license, url, vendorName, vendorUrl } =
      //   getLicenseInfoFromManifest(packageManifest);
      const { license, url } = getLicenseInfoFromManifest(packageManifest);
      const formattedRepository: string = getDownloadLocation(url);

      const currentPkgSpdxId = getSpdxId(pkg);
      if (existingSpdxIds.has(currentPkgSpdxId)) continue;
      existingSpdxIds.add(currentPkgSpdxId);

      spdxDocument.addPackage(pkg.name, {
        downloadLocation: formattedRepository,
        spdxId: currentPkgSpdxId,
        licenseConcluded: license,
      });

      for (const [, dependencyDescriptor] of pkg.dependencies.entries()) {
        const identHash = project.storedResolutions.get(
          dependencyDescriptor.descriptorHash,
        );
        if (!identHash) continue;
        const dependencyPkg = project.storedPackages.get(identHash);
        if (!dependencyPkg) continue;

        spdxDocument.addRelationship(
          currentPkgSpdxId,
          getSpdxId(dependencyPkg),
          spdxDependsOn,
        );
      }

      if (!allDependencies.includes(descriptor.descriptorHash)) {
        spdxDocument.addRelationship(
          spdxDocument,
          currentPkgSpdxId,
          spdxDescribes,
        );
      }
    }
    spdxDocument.writeSync(
      (workspace.manifest.name?.name ?? "") + spdxJsonFileExtension,
    );
  }
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

// TODO: Use these regex and the validation function for validation in the SPDX library
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

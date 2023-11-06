import { BaseCommand } from "@yarnpkg/cli";
import * as spdx from "../../../lib/spdx-tools";
import type { Usage } from "clipanion";
import { Command, Option } from "clipanion";
import type { ManifestWithLicenseInfo } from "../utils";
import {
  getLinker,
  getPackageInfos,
  getSortedPackages,
  getSpdxId,
  setupProject,
} from "../utils";
import { Filename, ppath } from "@yarnpkg/fslib";

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
        `$0 spdx --recursive false`,
      ],
      [
        `Generate SPDX document with only production dependencies`,
        `$0 spdx --production false`,
      ],
    ],
  });

  async execute(): Promise<void> {
    const [project, workspace] = await setupProject();

    const spdxDocument = spdx.createDocument(
      workspace.manifest.name?.name ?? "spdx",
    );

    const sortedPackages = await getSortedPackages(
      project,
      this.recursive,
      this.production,
    );
    const linker = getLinker(project);

    const allDependencies = [...sortedPackages].flatMap(([, pkg]) =>
      [...pkg.dependencies].flatMap(
        ([, descriptor]) => descriptor.descriptorHash,
      ),
    );
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
      const formattedRepository = await getPackageInfos(packageManifest);

      const currentPkgSpdxId = getSpdxId(pkg);
      if (existingSpdxIds.has(currentPkgSpdxId)) continue;
      existingSpdxIds.add(currentPkgSpdxId);

      spdxDocument.addPackage(pkg.name, {
        downloadLocation: formattedRepository,
        spdxId: currentPkgSpdxId,
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
      (workspace.manifest.name?.name ?? "project") + spdxJsonFileExtension,
    );
  }
}

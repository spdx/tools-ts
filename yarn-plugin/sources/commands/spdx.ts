// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { BaseCommand } from "@yarnpkg/cli";
import * as spdx from "@spdx/tools";
import type { Usage } from "clipanion";
import { Command } from "clipanion";
import {
  clearDevDependencies,
  getDevDependencies,
  getLinker,
  getSortedPackages,
  setupProject,
} from "../utils/project-helpers";
import {
  addDescribesRelationshipsToSpdxDocument,
  addDevRelationshipsToSpdxDocument,
  addPackagesToSpdxDocument,
  addProdRelationshipsToSpdxDocument,
} from "../utils/spdx-helpers";
import {
  getTopLevelDevDependencyPackages,
  getTopLevelPackages,
} from "../utils/package-helpers";

const SPDX_JSON_FILE_EXTENSION = ".spdx.json";

export class SpdxCommand extends BaseCommand {
  static paths = [[`spdx`]];

  static usage: Usage = Command.Usage({
    description: `Generate SPDX document for the project`,
    details: `
        This command generates an SPDX document for the project. The document will be placed in the root of the project.`,

    examples: [[`Generate SPDX document`, `$0 spdx`]],
  });

  async execute(): Promise<void> {
    const [project, workspace] = await setupProject(this);
    const linker = getLinker(project);

    const spdxDocument = spdx.createDocument(
      workspace.manifest.name?.name ?? "spdx",
    );
    const existingSpdxIds = new Set<string>();

    const devDependencyIdentHashes = getDevDependencies(project);
    const sortedMixedPackages = await getSortedPackages(project);
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

    await addPackagesToSpdxDocument(
      topLevelPackages,
      spdxDocument,
      project,
      linker,
      existingSpdxIds,
    );
    addDescribesRelationshipsToSpdxDocument(
      topLevelPackages,
      spdxDocument,
      existingSpdxIds,
    );
    await addPackagesToSpdxDocument(
      topLevelDevDependencyPackages,
      spdxDocument,
      project,
      linker,
      existingSpdxIds,
    );
    addDevRelationshipsToSpdxDocument(
      topLevelPackages,
      spdxDocument,
      project,
      existingSpdxIds,
      devDependencyIdentHashes,
    );

    // Prod dependencies must be added after dev dependencies,
    // since the dev dependencies are cleared in the project manifest to determine the prod dependencies.
    await clearDevDependencies(project);
    const sortedProdPackages = await getSortedPackages(project);

    await addPackagesToSpdxDocument(
      sortedProdPackages,
      spdxDocument,
      project,
      linker,
      existingSpdxIds,
    );
    addProdRelationshipsToSpdxDocument(
      sortedProdPackages,
      spdxDocument,
      project,
      existingSpdxIds,
    );

    spdxDocument.writeSync(
      (workspace.manifest.name?.name ?? "") + SPDX_JSON_FILE_EXTENSION,
    );
  }
}

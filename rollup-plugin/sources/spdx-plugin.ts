// SPDX-FileCopyrightText: 2023 spdx contributors
//
// SPDX-License-Identifier: MIT

import * as sbom from "../../lib/spdx-tools";
import * as path from "path";
import { sha1File } from "sha1-file";
import type { SPDXDocument as SPDX2Document } from "../../lib/api/spdx-document";

const SPDX_ID_PREPENDIX = "SPDXRef-";
const SPDX_DESCRIBES = "DESCRIBES";
const SPDX_DEPENDS_ON = "DEPENDS_ON";
const SPDX_GENERATED_FROM = "GENERATED_FROM";
const SHA1 = "SHA1";

interface relationship {
  element: string;
  relatedElement: string;
  relationshipType: string;
}

export default function spdx(outputName: string): any {
  const spdxDocument = sbom.createDocument(outputName);
  const collectedInputFiles = new Set<string>();
  const collectedRelationships = new Set<relationship>();

  return {
    name: "spdx-plugin",

    moduleParsed(moduleInfo: any): void {
      const fileLocation = getRelativeLocation(moduleInfo.id);
      const dependencyLocations = moduleInfo.importedIds.map((id: string) => {
        return getRelativeLocation(id);
      });

      dependencyLocations.forEach((dependencyLocation: string) => {
        const relationship: relationship = {
          element: spdxIdFromLocation(fileLocation),
          relatedElement: spdxIdFromLocation(dependencyLocation),
          relationshipType: SPDX_DEPENDS_ON,
        };
        if (!collectedRelationships.has(relationship)) {
          collectedRelationships.add(relationship);
        }
      });

      if (collectedInputFiles.has(fileLocation)) {
        return;
      }
      collectedInputFiles.add(fileLocation);

      addFileFromModuleToDocument(fileLocation, spdxDocument)
        .then(() => {})
        .catch((error) => {
          throw error;
        });
    },

    writeBundle(options: any, bundle: any): void {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const outputDirectory = options.dir!;

      collectDescribesRelationships(
        bundle,
        spdxDocument,
        collectedRelationships,
        outputDirectory,
      );
      collectGeneratedFromRelationships(
        bundle,
        collectedInputFiles,
        collectedRelationships,
        outputDirectory,
      );

      addRelationshipsToDocument(spdxDocument, collectedRelationships);

      addFilesFromBundleToDocument(bundle, spdxDocument, outputDirectory)
        .then(() => {
          if (options.file) {
            throw new Error("options.file is not supported");
          }
          const spdxDocumentLocation = path.resolve(
            outputDirectory,
            `${outputName}.spdx.json`,
          );
          spdxDocument.writeSync(spdxDocumentLocation, true);
        })
        .catch((error) => {
          throw error;
        });
    },
  };
}

function getRelativeLocation(absoluteLocation: string): string {
  return path.relative(process.cwd(), absoluteLocation);
}

async function addFileFromModuleToDocument(
  id: any,
  spdxDocument: SPDX2Document,
): Promise<void> {
  sha1File(path.resolve(id)).then((hash) => {
    spdxDocument.addFile(
      id,
      {
        checksumAlgorithm: SHA1,
        checksumValue: hash,
      },
      {
        spdxId: spdxIdFromLocation(id),
      },
    );
  });
}

function collectDescribesRelationships(
  bundle: any,
  spdxDocument: SPDX2Document,
  collectedRelationships: Set<relationship>,
  outputDirectory: string,
): void {
  for (const key in bundle) {
    const fileLocation = getRelativeLocation(
      `${outputDirectory}/${bundle[key].fileName}`,
    );
    const relationship: relationship = {
      element: spdxDocument.creationInfo.spdxId,
      relatedElement: spdxIdFromLocation(fileLocation),
      relationshipType: SPDX_DESCRIBES,
    };
    if (!collectedRelationships.has(relationship)) {
      collectedRelationships.add(relationship);
    }
  }
}

function collectGeneratedFromRelationships(
  bundle: any,
  collectedInputFiles: Set<string>,
  collectedRelationships: Set<relationship>,
  outputDirectory: string,
): void {
  for (const key in bundle) {
    const fileLocation = getRelativeLocation(
      `${outputDirectory}/${bundle[key].fileName}`,
    );

    if (!bundle[key].facadeModuleId) {
      continue;
    }
    const referenceFileLocation = getRelativeLocation(
      bundle[key].facadeModuleId,
    );
    if (!collectedInputFiles.has(referenceFileLocation)) {
      continue;
    }

    const relationship: relationship = {
      element: spdxIdFromLocation(fileLocation),
      relatedElement: spdxIdFromLocation(referenceFileLocation),
      relationshipType: SPDX_GENERATED_FROM,
    };
    if (!collectedRelationships.has(relationship)) {
      collectedRelationships.add(relationship);
    }
  }
}

function addRelationshipsToDocument(
  spdxDocument: SPDX2Document,
  collectedRelationships: Set<relationship>,
): void {
  collectedRelationships.forEach((relationship) => {
    spdxDocument.addRelationship(
      relationship.element,
      relationship.relatedElement,
      relationship.relationshipType,
    );
  });
}

async function addFilesFromBundleToDocument(
  bundle: any,
  spdxDocument: SPDX2Document,
  outputDirectory: string,
): Promise<void> {
  const promises = [];
  for (const key in bundle) {
    const fileLocation = getRelativeLocation(
      `${outputDirectory}/${bundle[key].fileName}`,
    );
    promises.push(
      sha1File(path.resolve(fileLocation)).then((hash) => {
        spdxDocument.addFile(
          fileLocation,
          {
            checksumAlgorithm: SHA1,
            checksumValue: hash,
          },
          {
            spdxId: spdxIdFromLocation(fileLocation),
          },
        );
      }),
    );
  }
  await Promise.all(promises);
}

function spdxIdFromLocation(filePath: string): string {
  return SPDX_ID_PREPENDIX + filePath.replace(/[^a-zA-Z0-9.-]+/g, "-");
}

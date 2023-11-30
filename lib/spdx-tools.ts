// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { CreateDocumentOptions } from "./api/spdx-document";
import { SPDXDocument as SPDX2Document } from "./api/spdx-document";

function parseMajorVersion(spdxVersion: string): number {
  return parseInt(spdxVersion.split(".")[0]);
}

export function createDocument(
  name: string,
  options?: Partial<CreateDocumentOptions>,
): SPDX2Document {
  const spdxVersion = options?.spdxVersion;
  if (!spdxVersion || parseMajorVersion(spdxVersion) === 2) {
    return SPDX2Document.createDocument(name, options);
  } else {
    throw new Error("Unsupported SPDX version");
  }
}

export { SPDXDocument } from "./api/spdx-document";
export type {
  SpdxActor,
  SpdxDocumentReference,
  SpdxChecksum,
  SpdxExternalPackageReference,
  CreateDocumentOptions,
  AddPackageOptions,
  AddFileOptions,
} from "./api/spdx-document";
export { Actor, ActorType } from "./spdx2model/actor";
export { Checksum, ChecksumAlgorithm } from "./spdx2model/checksum";
export { Document } from "./spdx2model/document";
export type { DocumentOptions } from "./spdx2model/document";
export { DocumentCreationInfo } from "./spdx2model/document-creation-info";
export type { DocumentCreationInfoOptions } from "./spdx2model/document-creation-info";
export { ExternalDocumentReference } from "./spdx2model/external-document-reference";
export {
  ExternalPackageRef,
  ExternalPackageRefCategory,
} from "./spdx2model/external-package-reference";
export { File, FileType } from "./spdx2model/file";
export type { FileOptions } from "./spdx2model/file";
export { Package, PackagePurpose } from "./spdx2model/package";
export type {
  PackageOptions,
  PackageVerificationCode,
} from "./spdx2model/package";
export { Relationship, RelationshipType } from "./spdx2model/relationship";
export type { RelationshipOptions } from "./spdx2model/relationship";
export {
  NOASSERTION,
  NONE,
  SpdxNoAssertion,
  SpdxNone,
} from "./spdx2model/utils";

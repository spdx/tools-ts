import type { CreateDocumentOptions, Creator } from "./api/spdx-document";
import { SPDXDocument as SPDX2Document } from "./api/spdx-document";

function parseMajorVersion(spdxVersion: string): number {
  return parseInt(spdxVersion.split(".")[0]);
}

export type { Creator } from "./api/spdx-document";

export function createDocument(
  name: string,
  creators: Creator | Creator[],
  options?: Partial<CreateDocumentOptions>,
): SPDX2Document {
  const spdxVersion = options?.spdxVersion;
  if (spdxVersion && parseMajorVersion(spdxVersion) === 2) {
    return SPDX2Document.createDocument(name, creators, options);
  } else {
    throw new Error("Unsupported SPDX version");
  }
}

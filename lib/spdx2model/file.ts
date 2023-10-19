import type { Checksum } from "./checksum";

export enum FileType {
  OTHER = "OTHER",
  DOCUMENTATION = "DOCUMENTATION",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  ARCHIVE = "ARCHIVE",
  SPDX = "SPDX",
  APPLICATION = "APPLICATION",
  SOURCE = "SOURCE",
  BINARY = "BINARY",
  TEXT = "TEXT",
  AUDIO = "AUDIO",
}

export interface FileOptions {
  spdxId: string;
  fileTypes: FileType[];
}

// TODO: Implement optional properties
export class File {
  name: string;
  spdxId: string;
  checksums: Checksum[];
  fileTypes?: FileType[];

  constructor(
    name: string,
    checksums: Checksum[],
    options?: Partial<FileOptions>,
  ) {
    this.name = name;
    this.spdxId = "SPDXRef-" + (options?.spdxId ?? name);
    this.checksums = checksums;
    this.fileTypes = options?.fileTypes ?? undefined;
  }
}

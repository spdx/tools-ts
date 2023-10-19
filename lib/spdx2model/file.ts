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
  checksums: Checksum[];
  fileTypes: FileType[];
}

// TODO: Implement optional properties
export class File {
  name: string;
  spdxId: string;
  checksums: Checksum[];
  fileTypes?: FileType[];

  constructor(name: string, options?: Partial<FileOptions>) {
    this.name = name;
    this.spdxId = "SPDXRef-" + (options?.spdxId ?? name);
    // TODO: Should checksums be required, or calculated here, or is an empty list acceptable?
    this.checksums = options?.checksums ?? [];
    this.fileTypes = options?.fileTypes ?? undefined;
  }
}

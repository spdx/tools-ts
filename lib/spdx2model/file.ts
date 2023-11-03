import { Checksum } from "./checksum";
import { v4 as uuidv4 } from "uuid";
import type { AddFileOptions, SpdxChecksum } from "../api/spdx-document";

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

function formatFileType(fileType: string): FileType {
  const fileTypeEnum = FileType[fileType as keyof typeof FileType];
  if (!fileTypeEnum) {
    throw new Error("Invalid file type: " + fileType);
  }
  return fileTypeEnum;
}

// TODO: Implement optional properties
export class File {
  name: string;
  spdxId: string;
  checksums: Checksum[];
  fileTypes: FileType[];

  constructor(
    name: string,
    checksums: Checksum[],
    options?: Partial<FileOptions>,
  ) {
    this.name = name;
    this.spdxId = "SPDXRef-" + uuidv4();
    this.checksums = checksums;
    this.fileTypes = options?.fileTypes ?? [];
  }

  static fromApi(
    name: string,
    checksums: [SpdxChecksum] | SpdxChecksum,
    options?: Partial<AddFileOptions>,
  ): File {
    return new File(name, Checksum.fromSpdxChecksums(checksums), {
      spdxId: options?.spdxId ?? undefined,
      fileTypes: options?.fileTypes
        ? options.fileTypes.map((fileType) => formatFileType(fileType))
        : undefined,
    });
  }
}

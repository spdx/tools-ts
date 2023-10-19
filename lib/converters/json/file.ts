import type { File, FileType } from "../../spdx2model/file";
import { JsonChecksum } from "./checksum";

export class JsonFile {
  SPDXID: string;
  fileName: string;
  checksums: JsonChecksum[];
  // TODO: Should this be of type FileType[] -> where should the enum live?
  fileTypes?: string[];

  constructor(
    SPDXID: string,
    fileName: string,
    checksums: JsonChecksum[],
    fileTypes?: FileType[],
  ) {
    this.SPDXID = SPDXID;
    this.fileName = fileName;
    this.checksums = checksums;
    this.fileTypes = fileTypes;
  }

  static fromFile(file: File): JsonFile {
    const jsonChecksums: JsonChecksum[] = file.checksums.map((checksum) =>
      JsonChecksum.fromChecksum(checksum),
    );

    return new JsonFile(file.spdxId, file.name, jsonChecksums, file.fileTypes);
  }
}

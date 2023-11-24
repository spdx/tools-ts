// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { File } from "../../spdx2model/file";
import { JsonChecksum } from "./checksum";

export class JsonFile {
  SPDXID: string;
  fileName: string;
  checksums: JsonChecksum[];
  attributionTexts?: string[];
  comment?: string;
  copyrightText?: string;
  fileContributors?: string[];
  fileTypes?: string[];
  licenseComments?: string;
  licenseConcluded?: string;
  licenseInfoInFiles?: string[];
  noticeText?: string;

  constructor(
    SPDXID: string,
    fileName: string,
    checksums: JsonChecksum[],
    attributionTexts?: string[],
    comment?: string,
    copyrightText?: string,
    fileContributors?: string[],
    fileTypes?: string[],
    licenseComments?: string,
    licenseConcluded?: string,
    licenseInfoInFiles?: string[],
    noticeText?: string,
  ) {
    this.SPDXID = SPDXID;
    this.fileName = fileName;
    this.checksums = checksums;
    this.attributionTexts = attributionTexts;
    this.comment = comment;
    this.copyrightText = copyrightText;
    this.fileContributors = fileContributors;
    this.fileTypes = fileTypes;
    this.licenseComments = licenseComments;
    this.licenseConcluded = licenseConcluded;
    this.licenseInfoInFiles = licenseInfoInFiles;
    this.noticeText = noticeText;
  }

  static fromFile(file: File): JsonFile {
    const jsonChecksums: JsonChecksum[] = file.checksums.map((checksum) =>
      JsonChecksum.fromChecksum(checksum),
    );
    const jsonFileTypes =
      file.fileTypes.length > 0
        ? file.fileTypes.map((fileType) => fileType.toString())
        : undefined;
    const jsonLicenseInfoInFiles =
      file.licenseInfoInFiles.length > 0
        ? file.licenseInfoInFiles.map((licenseInfoInFile) =>
            licenseInfoInFile.toString(),
          )
        : undefined;

    return new JsonFile(
      file.spdxId,
      file.name,
      jsonChecksums,
      file.attributionTexts.length > 0 ? file.attributionTexts : undefined,
      file.comment,
      file.copyrightText?.toString(),
      file.contributors.length > 0 ? file.contributors : undefined,
      jsonFileTypes,
      file.licenseComment,
      file.licenseConcluded?.toString(),
      jsonLicenseInfoInFiles,
      file.notice,
    );
  }
}

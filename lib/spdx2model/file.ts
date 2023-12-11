// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { Checksum } from "./checksum";
import { v4 as uuidv4 } from "uuid";
import type { AddFileOptions, SpdxChecksum } from "../api/spdx-document";
import type { SpdxNoAssertion, SpdxNone } from "./utils";
import { toSpdxType } from "./utils";

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
  licenseConcluded?: string | SpdxNoAssertion | SpdxNone;
  licenseInfoInFiles: Array<string | SpdxNoAssertion | SpdxNone>;
  licenseComment?: string;
  copyrightText?: string | SpdxNoAssertion | SpdxNone;
  comment?: string;
  notice?: string;
  contributors: string[];
  attributionTexts: string[];
}

export function formatFileType(fileType: string): FileType {
  const fileTypeEnum = FileType[fileType as keyof typeof FileType];
  if (!fileTypeEnum) {
    throw new Error("Invalid file type: " + fileType);
  }
  return fileTypeEnum;
}

export class File {
  name: string;
  spdxId: string;
  checksums: Checksum[];
  fileTypes: FileType[];
  licenseConcluded?: string | SpdxNoAssertion | SpdxNone;
  licenseInfoInFiles: Array<string | SpdxNoAssertion | SpdxNone>;
  licenseComment?: string;
  copyrightText?: string | SpdxNoAssertion | SpdxNone;
  comment?: string;
  notice?: string;
  contributors: string[];
  attributionTexts: string[];

  constructor(
    name: string,
    checksums: Checksum[],
    options?: Partial<FileOptions>,
  ) {
    this.name = name;
    this.spdxId = options?.spdxId ?? "SPDXRef-" + uuidv4();
    this.checksums = checksums;
    this.fileTypes = options?.fileTypes ?? [];
    this.licenseConcluded = options?.licenseConcluded ?? undefined;
    this.licenseInfoInFiles = options?.licenseInfoInFiles ?? [];
    this.licenseComment = options?.licenseComment ?? undefined;
    this.copyrightText = options?.copyrightText ?? undefined;
    this.comment = options?.comment ?? undefined;
    this.notice = options?.notice ?? undefined;
    this.contributors = options?.contributors ?? [];
    this.attributionTexts = options?.attributionTexts ?? [];
  }

  static fromApi(
    name: string,
    checksums: [SpdxChecksum] | SpdxChecksum,
    options?: Partial<AddFileOptions>,
  ): File {
    return new File(name, Checksum.fromSpdxChecksums(checksums), {
      spdxId: options?.spdxId,
      fileTypes: options?.fileTypes
        ? options.fileTypes.map((fileType) => formatFileType(fileType))
        : undefined,
      licenseConcluded:
        options?.licenseConcluded && toSpdxType(options.licenseConcluded),
      licenseInfoInFiles: options?.licenseInfoInFiles?.map((licenseInfo) =>
        toSpdxType(licenseInfo),
      ),
      licenseComment: options?.licenseComment,
      copyrightText:
        options?.copyrightText && toSpdxType(options.copyrightText),
      comment: options?.comment,
      notice: options?.notice,
      contributors: options?.contributors,
      attributionTexts: options?.attributionTexts,
    });
  }
}

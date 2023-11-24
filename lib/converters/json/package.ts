// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { Package } from "../../spdx2model/package";
import { JsonChecksum } from "./checksum";
import { JsonPackageVerificationCode } from "./package-verification-code";
import { formatDatetime } from "./utils";
import { JsonExternalPackageRef } from "./external-package-ref";

export class JsonPackage {
  name: string;
  downloadLocation: string;
  SPDXID: string;
  filesAnalyzed: boolean;
  packageVerificationCode?: JsonPackageVerificationCode;
  checksums?: JsonChecksum[];
  licenseInfoFromFiles?: string[];
  externalRefs?: JsonExternalPackageRef[];
  attributionTexts?: string[];
  builtDate?: string;
  comment?: string;
  copyrightText?: string;
  description?: string;
  homepage?: string;
  licenseComments?: string;
  licenseConcluded?: string;
  licenseDeclared?: string;
  originator?: string;
  packageFileName?: string;
  primaryPackagePurpose?: string;
  releaseDate?: string;
  sourceInfo?: string;
  summary?: string;
  supplier?: string;
  validUntilDate?: string;
  versionInfo?: string;

  constructor(
    name: string,
    downloadLocation: string,
    SPDXID: string,
    filesAnalyzed: boolean,
    packageVerificationCode?: JsonPackageVerificationCode,
    checksums?: JsonChecksum[],
    licenseInfoFromFiles?: string[],
    externalRefs?: JsonExternalPackageRef[],
    attributionTexts?: string[],
    builtDate?: string,
    comment?: string,
    copyrightText?: string,
    description?: string,
    homepage?: string,
    licenseComments?: string,
    licenseConcluded?: string,
    licenseDeclared?: string,
    originator?: string,
    packageFileName?: string,
    primaryPackagePurpose?: string,
    releaseDate?: string,
    sourceInfo?: string,
    summary?: string,
    supplier?: string,
    validUntilDate?: string,
    versionInfo?: string,
  ) {
    this.name = name;
    this.downloadLocation = downloadLocation;
    this.SPDXID = SPDXID;
    this.filesAnalyzed = filesAnalyzed;
    this.packageVerificationCode = packageVerificationCode;
    this.checksums = checksums;
    this.licenseInfoFromFiles = licenseInfoFromFiles;
    this.externalRefs = externalRefs;
    this.attributionTexts = attributionTexts;
    this.builtDate = builtDate;
    this.comment = comment;
    this.copyrightText = copyrightText;
    this.description = description;
    this.homepage = homepage;
    this.licenseComments = licenseComments;
    this.licenseConcluded = licenseConcluded;
    this.licenseDeclared = licenseDeclared;
    this.originator = originator;
    this.packageFileName = packageFileName;
    this.primaryPackagePurpose = primaryPackagePurpose;
    this.releaseDate = releaseDate;
    this.sourceInfo = sourceInfo;
    this.summary = summary;
    this.supplier = supplier;
    this.validUntilDate = validUntilDate;
    this.versionInfo = versionInfo;
  }

  static fromPackage(pkg: Package): JsonPackage {
    const jsonChecksums: JsonChecksum[] | undefined =
      pkg.checksums.length > 0
        ? pkg.checksums.map((checksum) => JsonChecksum.fromChecksum(checksum))
        : undefined;
    const jsonPackageVerificationCode: JsonPackageVerificationCode | undefined =
      pkg.verificationCode
        ? JsonPackageVerificationCode.fromPackageVerificationCode(
            pkg.verificationCode,
          )
        : undefined;
    const jsonExternalPackageRefs: JsonExternalPackageRef[] | undefined =
      pkg.externalReferences?.length > 0
        ? pkg.externalReferences.map((ref) =>
            JsonExternalPackageRef.fromExternalPackageRef(ref),
          )
        : undefined;

    return new JsonPackage(
      pkg.name,
      pkg.downloadLocation.toString(),
      pkg.spdxId,
      pkg.filesAnalyzed,
      jsonPackageVerificationCode,
      jsonChecksums,
      pkg.licenseInfoFromFiles.map((licenseInfo) => licenseInfo.toString()),
      jsonExternalPackageRefs,
      pkg.attributionTexts.length > 0 ? pkg.attributionTexts : undefined,
      pkg.builtDate ? formatDatetime(pkg.builtDate) : undefined,
      pkg.comment,
      pkg.copyrightText?.toString(),
      pkg.description,
      pkg.homepage?.toString(),
      pkg.licenseComment,
      pkg.licenseConcluded?.toString(),
      pkg.licenseDeclared?.toString(),
      pkg.originator?.toString(),
      pkg.fileName,
      pkg.primaryPackagePurpose?.toString(),
      pkg.releaseDate ? formatDatetime(pkg.releaseDate) : undefined,
      pkg.sourceInfo,
      pkg.summary,
      pkg.supplier?.toString(),
      pkg.validUntilDate ? formatDatetime(pkg.validUntilDate) : undefined,
      pkg.version,
    );
  }
}

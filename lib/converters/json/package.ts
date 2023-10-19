import type { Package } from "../../spdx2model/package";
import { JsonChecksum } from "./checksum";
import { JsonPackageVerificationCode } from "./package-verification-code";

export class JsonPackage {
  name: string;
  downloadLocation: string;
  SPDXID: string;
  filesAnalyzed: boolean;
  packageVerificationCode?: JsonPackageVerificationCode;
  checksums: JsonChecksum[];
  licenseInfoFromFiles: string[];
  externalRefs: string[];
  attributionTexts: string[];

  constructor(
    name: string,
    downloadLocation: string,
    SPDXID: string,
    filesAnalyzed: boolean,
    checksums: JsonChecksum[],
    licenseInfoFromFiles: string[],
    externalRefs: string[],
    attributionTexts: string[],
    packageVerificationCode?: JsonPackageVerificationCode,
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
  }

  static fromPackage(pkg: Package): JsonPackage {
    const jsonChecksums: JsonChecksum[] = pkg.checksums.map((checksum) =>
      JsonChecksum.fromChecksum(checksum),
    );
    const jsonPackageVerificationCode: JsonPackageVerificationCode | undefined =
      pkg.verificationCode
        ? JsonPackageVerificationCode.fromPackageVerificationCode(
            pkg.verificationCode,
          )
        : undefined;

    return new JsonPackage(
      pkg.name,
      pkg.downloadLocation.toString(),
      pkg.spdxId,
      pkg.filesAnalyzed,
      jsonChecksums,
      // TODO: Fill in licenseInfoFromFiles
      [],
      [],
      [],
      jsonPackageVerificationCode,
    );
  }
}

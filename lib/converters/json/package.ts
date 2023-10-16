import type { Package } from "../../spdx2model/package";
import type { Checksum } from "../../spdx2model/checksum";

export class JsonChecksum {
  algorithm: string;
  checksumValue: string;

  constructor(algorithm: string, checksumValue: string) {
    this.algorithm = algorithm;
    this.checksumValue = checksumValue;
  }

  static fromChecksum(checksum: Checksum): JsonChecksum {
    return new JsonChecksum(checksum.algorithm, checksum.value);
  }
}

export class JsonPackage {
  name: string;
  downloadLocation: string;
  SPDXID: string;
  filesAnalyzed: boolean;
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
  ) {
    this.name = name;
    this.downloadLocation = downloadLocation;
    this.SPDXID = SPDXID;
    this.filesAnalyzed = filesAnalyzed;
    this.checksums = checksums;
    this.licenseInfoFromFiles = licenseInfoFromFiles;
    this.externalRefs = externalRefs;
    this.attributionTexts = attributionTexts;
  }

  static fromPackage(pkg: Package): JsonPackage {
    const jsonChecksums: JsonChecksum[] = pkg.checksums.map((checksum) =>
      JsonChecksum.fromChecksum(checksum),
    );

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
    );
  }
}

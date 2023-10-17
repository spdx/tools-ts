import type { Package } from "../../spdx2model/package";
import { JsonChecksum } from "./checksum";

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

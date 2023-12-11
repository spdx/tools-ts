// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { Document } from "../../spdx2model/document";
import { JsonDocumentCreationInfo } from "./document-creation-info";
import { JsonPackage } from "./package";
import { JsonRelationship } from "./relationship";
import { JsonExternalDocumentRef } from "./external-document-ref";
import { JsonFile } from "./file";
import { JsonHasExtractedLicensingInfos } from "./has-extracted-licensing-infos";

export class JsonDocument {
  SPDXID: string;
  comment?: string;
  creationInfo: JsonDocumentCreationInfo;
  dataLicense: string;
  externalDocumentRefs?: JsonExternalDocumentRef[];
  name: string;
  spdxVersion: string;
  documentNamespace: string;
  packages?: JsonPackage[];
  files?: JsonFile[];
  relationships?: JsonRelationship[];
  hasExtractedLicensingInfos?: JsonHasExtractedLicensingInfos[];

  constructor(
    spdxId: string,
    spdxVersion: string,
    name: string,
    documentNamespace: string,
    dataLicense: string,
    creationInfo: JsonDocumentCreationInfo,
    packages?: JsonPackage[],
    files?: JsonFile[],
    relationships?: JsonRelationship[],
    hasExtractedLicensingInfos?: JsonHasExtractedLicensingInfos[],
    externalDocumentRefs?: JsonExternalDocumentRef[],
    comment?: string,
  ) {
    this.SPDXID = spdxId;
    this.spdxVersion = spdxVersion;
    this.name = name;
    this.documentNamespace = documentNamespace;
    this.dataLicense = dataLicense;
    this.creationInfo = creationInfo;
    this.packages = packages;
    this.files = files;
    this.relationships = relationships;
    this.hasExtractedLicensingInfos = hasExtractedLicensingInfos;
    this.externalDocumentRefs = externalDocumentRefs;
    this.comment = comment;
  }

  static fromDocument(document: Document): JsonDocument {
    const jsonCreationInfo: JsonDocumentCreationInfo =
      JsonDocumentCreationInfo.fromDocument(document);
    const jsonPackages: JsonPackage[] | undefined =
      document.packages.length > 0
        ? document.packages.map((pkg) => JsonPackage.fromPackage(pkg))
        : undefined;
    const jsonFiles: JsonFile[] | undefined =
      document.files.length > 0
        ? document.files.map((file) => JsonFile.fromFile(file))
        : undefined;
    const jsonRelationships: JsonRelationship[] | undefined =
      document.relationships.length > 0
        ? document.relationships.map((relationship) =>
            JsonRelationship.fromRelationship(relationship),
          )
        : undefined;
    const jsonHasExtractedLicensingInfos:
      | JsonHasExtractedLicensingInfos[]
      | undefined =
      document.otherLicensingInfo.length > 0
        ? document.otherLicensingInfo.map((otherLicenseInfo) =>
            JsonHasExtractedLicensingInfos.fromOtherLicensingInfo(
              otherLicenseInfo,
            ),
          )
        : undefined;
    const jsonExternalDocumentRefs: JsonExternalDocumentRef[] | undefined =
      document.creationInfo.externalDocumentRefs?.length > 0
        ? document.creationInfo.externalDocumentRefs.map((ref) =>
            JsonExternalDocumentRef.fromExternalDocumentRef(ref),
          )
        : undefined;

    return new JsonDocument(
      document.creationInfo.spdxId,
      document.creationInfo.spdxVersion,
      document.creationInfo.name,
      document.creationInfo.documentNamespace,
      document.creationInfo.dataLicense,
      jsonCreationInfo,
      jsonPackages,
      jsonFiles,
      jsonRelationships,
      jsonHasExtractedLicensingInfos,
      jsonExternalDocumentRefs,
      document.creationInfo.documentComment,
    );
  }
}

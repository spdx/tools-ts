import type { Document } from "../../spdx2model/document";
import { JsonDocumentCreationInfo } from "./document-creation-info";
import { JsonPackage } from "./package";
import { JsonRelationship } from "./relationship";
import { JsonExternalDocumentRef } from "./external-document-ref";
import { JsonFile } from "./file";

export class JsonDocument {
  SPDXID: string;
  // TODO: Implement
  // annotations
  comment?: string;
  creationInfo: JsonDocumentCreationInfo;
  dataLicense: string;
  externalDocumentRefs?: JsonExternalDocumentRef[];
  // TODO: Implement
  // hasExtractedLicenseInfos
  name: string;
  spdxVersion: string;
  documentNamespace: string;
  packages?: JsonPackage[];
  // TODO: Implement
  files?: JsonFile[];
  // TODO: Implement
  // snippets;
  relationships?: JsonRelationship[];

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
      jsonExternalDocumentRefs,
      document.creationInfo.documentComment,
    );
  }
}

export class JsonDocument {
  SPDXID: string
  spdxVersion: string
  name: string
  documentNamespace: string
  dataLicense: string
  creationInfo: JsonDocumentCreationInfo
  packages: JsonPackage[]
  relationships: JsonRelationship[]
  externalDocumentRefs?: string
  comment?: string

  constructor (spdxID: string,
    spdxVersion: string,
    name: string,
    documentNamespace: string,
    dataLicense: string,
    creationInfo: JsonDocumentCreationInfo,
    packages: JsonPackage[],
    relationships: JsonRelationship[],
    externalDocumentRefs?: string,
    comment?: string) {
    this.SPDXID = spdxID
    this.spdxVersion = spdxVersion
    this.name = name
    this.documentNamespace = documentNamespace
    this.dataLicense = dataLicense
    this.externalDocumentRefs = externalDocumentRefs
    this.comment = comment
    this.creationInfo = creationInfo
    this.packages = packages
    this.relationships = relationships
  }
}

export class JsonDocumentCreationInfo {
  created: string
  creators: string[]
  comment?: string
  licenseListVersion?: string

  constructor (created: string, creators: string[], comment?: string, licenseListVersion?: string) {
    this.created = created
    this.creators = creators
    this.comment = comment
    this.licenseListVersion = licenseListVersion
  }
}

export class JsonPackage {
  name: string
  downloadLocation: string
  SPDXID: string
  filesAnalyzed: boolean
  checksums: JsonChecksum[]
  licenseInfoFromFiles: string[]
  externalRefs: string[]
  attributionTexts: string[]

  constructor (name: string,
    downloadLocation: string,
    SPDXID: string,
    filesAnalyzed: boolean,
    checksums: JsonChecksum[],
    licenseInfoFromFiles: string[],
    externalRefs: string[],
    attributionTexts: string[]) {
    this.name = name
    this.downloadLocation = downloadLocation
    this.SPDXID = SPDXID
    this.filesAnalyzed = filesAnalyzed
    this.checksums = checksums
    this.licenseInfoFromFiles = licenseInfoFromFiles
    this.externalRefs = externalRefs
    this.attributionTexts = attributionTexts
  }
}

export class JsonChecksum {
  algorithm: string
  checksumValue: string

  constructor (algorithm: string, checksumValue: string) {
    this.algorithm = algorithm
    this.checksumValue = checksumValue
  }
}

export class JsonRelationship {
  spdxElementId: string
  relatedSpdxElement: string
  relationshipType: string
  comment?: string

  constructor (spdxElementId: string, relatedSpdxElement: string, relationshipType: string, comment?: string) {
    this.spdxElementId = spdxElementId
    this.comment = comment
    this.relatedSpdxElement = relatedSpdxElement
    this.relationshipType = relationshipType
  }
}

// // TODO: Not sure if we will actually need these enums.
// // eslint-disable-next- @typescript-eslint/no-unused-vars
// enum Document {
//   SPDXID = 'SPDXID',
//   annotations = 'annotations',
//   comment = 'comment',
//   creationInfo = 'creationInfo',
//   dataLicense = 'dataLicense',
//   externalDocumentRefs = 'externalDocumentRefs',
//   hasExtractedLicensingInfos = 'hasExtractedLicensingInfos',
//   name = 'name',
//   spdxVersion = 'spdxVersion',
//   documentNamespace = 'documentNamespace',
//   packages = 'packages',
//   files = 'files',
//   snippets = 'snippets',
//   relationships = 'relationships',
// }
//
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// enum DocumentCreationInfo {
//   comment = 'comment',
//   created = 'created',
//   creators = 'creators',
//   licenseListVersion = 'licenseListVersion',
// }
//
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// enum Package {
//   SPDXID = 'SPDXID',
//   annotations = 'annotations',
//   attributionTexts = 'attributionTexts',
//   buildDate = 'buildDate',
//   checksums = 'checksums',
//   comment = 'comment',
//   copyrightText = 'copyrightText',
//   description = 'description',
//   downloadLocation = 'downloadLocation',
//   externalRefs = 'externalRefs',
//   filesAnalyzed = 'filesAnalyzed',
//   homepage = 'homepage',
//   licenseComments = 'licenseComments',
//   licenseConcluded = 'licenseConcluded',
//   licenseDeclared = 'licenseDeclared',
//   licenseInfoFromFiles = 'licenseInfoFromFiles',
//   name = 'name',
//   originator = 'originator',
//   packageFileName = 'packageFileName',
//   packageVerificationCode = 'packageVerificationCode',
//   primaryPackagePurpose = 'primaryPackagePurpose',
//   releaseDate = 'releaseDate',
//   sourceInfo = 'sourceInfo',
//   summary = 'summary',
//   supplier = 'supplier',
//   validUntilDate = 'validUntilDate',
//   versionInfo = 'versionInfo',
// }
//
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// enum Relationship {
//   spdxElementId = 'spdxElementId',
//   comment = 'comment',
//   relatedSpdxElement = 'relatedSpdxElement',
//   relationshipType = 'relationshipType',
// }

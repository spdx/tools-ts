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

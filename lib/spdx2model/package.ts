interface PackageOptions {
  spdxId: string
  version: string
  fileName: string
  supplier: Actor | spdxNoAssertion
  originator: Actor | spdxNoAssertion
  filesAnalyzed: boolean
  verificationCode: string
  checksums: Checksum[]
  homepage: string | spdxNoAssertion | spdxNone
  sourceInfo: string
  licenseConcluded: string | spdxNoAssertion | spdxNone
  licenseInfoFromFiles: Array<string | spdxNoAssertion | spdxNone>
  licenseDeclared: string | spdxNoAssertion | spdxNone
  licenseComment: string
  copyrightText: string | spdxNoAssertion | spdxNone
  summary: string
  description: string
  comment: string
  externalReferences: string[]
  attributionTexts: string[]
  primaryPackagePurpose: PackagePurpose
  releaseDate: Date
  builtDate: Date
  validUntilDate: Date
}

export class Checksum {
  algorithm: string
  value: string

  constructor (algorithm: string, value: string) {
    this.algorithm = algorithm
    this.value = value
  }

  toString (): string {
    return this.algorithm + ': ' + this.value
  }
}

export class spdxNoAssertion {
  toString (): string {
    return 'NOASSERTION'
  }
}

export class spdxNone {
  toString (): string {
    return 'NONE'
  }
}

enum ActorType {
  Person = 'Person',
  Organization = 'Organization',
  Tool = 'Tool'
}

export class Actor {
  type: ActorType
  name: string
  email?: string

  constructor (name: string, type: ActorType, email?: string) {
    this.name = name
    this.email = email ?? undefined
    this.type = type
  }

  toString (): string {
    return this.name + (this.email ? ' (' + this.email + ')' : '')
  }
}

enum PackagePurpose {
  APPLICATION = 'APPLICATION',
  FRAMEWORK = 'FRAMEWORK',
  LIBRARY = 'LIBRARY',
  CONTAINER = 'CONTAINER',
  OPERATING_SYSTEM = 'OPERATING_SYSTEM',
  DEVICE = 'DEVICE',
  FIRMWARE = 'FIRMWARE',
  SOURCE = 'SOURCE',
  ARCHIVE = 'ARCHIVE',
  FILE = 'FILE',
  INSTALL = 'INSTALL',
  OTHER = 'OTHER'
}

export class Package {
  name: string
  downloadLocation: string | spdxNoAssertion | spdxNone
  spdxId: string
  version?: string
  fileName?: string
  supplier?: Actor | spdxNoAssertion
  originator?: Actor | spdxNoAssertion
  filesAnalyzed: boolean
  // TODO: Implement VerificationCode class
  verificationCode?: string
  checksums: Checksum[]
  homepage?: string | spdxNoAssertion | spdxNone
  sourceInfo?: string
  // TODO: Implement LicenseExpression class
  licenseConcluded?: string | spdxNoAssertion | spdxNone
  licenseInfoFromFiles: Array<string | spdxNoAssertion | spdxNone>
  licenseDeclared?: string | spdxNoAssertion | spdxNone
  licenseComment?: string
  copyrightText?: string | spdxNoAssertion | spdxNone
  summary?: string
  description?: string
  comment?: string
  // TODO: Implement ExternalPackageRef class
  externalReferences: string[]
  attributionTexts: string[]
  primaryPackagePurpose?: PackagePurpose
  releaseDate?: Date
  builtDate?: Date
  validUntilDate?: Date

  constructor (name: string, downloadLocation: string | spdxNoAssertion | spdxNone, options?: Partial<PackageOptions>) {
    this.name = name
    this.downloadLocation = downloadLocation
    this.spdxId = 'SPDXRef-' + (options?.spdxId ?? name)
    this.version = options?.version ?? undefined
    this.fileName = options?.fileName ?? undefined
    this.supplier = options?.supplier ?? undefined
    this.originator = options?.originator ?? undefined
    this.filesAnalyzed = options?.filesAnalyzed ?? true
    this.verificationCode = options?.verificationCode ?? undefined
    this.checksums = options?.checksums ?? []
    this.homepage = options?.homepage ?? undefined
    this.sourceInfo = options?.sourceInfo ?? undefined
    this.licenseConcluded = options?.licenseConcluded ?? undefined
    this.licenseInfoFromFiles = options?.licenseInfoFromFiles ?? []
    this.licenseDeclared = options?.licenseDeclared ?? undefined
    this.licenseComment = options?.licenseComment ?? undefined
    this.copyrightText = options?.copyrightText ?? undefined
    this.summary = options?.summary ?? undefined
    this.description = options?.description ?? undefined
    this.comment = options?.comment ?? undefined
    this.externalReferences = options?.externalReferences ?? []
    this.attributionTexts = options?.attributionTexts ?? []
    this.primaryPackagePurpose = options?.primaryPackagePurpose ?? undefined
    this.releaseDate = options?.releaseDate ?? undefined
    this.builtDate = options?.builtDate ?? undefined
    this.validUntilDate = options?.validUntilDate ?? undefined
  }
}

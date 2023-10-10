import type { Package } from './package'
import type { Relationship } from './relationship'

interface DocumentCreationInfoOptions {
  spdxVersion: string
  spdxId: string
  documentNamespace: string
  created: string
}

export class DocumentCreationInfo {
  spdxVersion: string
  spdxId: string
  name: string
  documentNamespace: string
  created: string
  creator: string
  dataLicense: string = 'CC0-1.0'

  constructor (name: string, creator: string, documentCreationInfo: Partial<DocumentCreationInfoOptions>) {
    this.spdxVersion = documentCreationInfo.spdxVersion ?? 'SPDX-2.3'
    this.spdxId = documentCreationInfo.spdxId ?? 'SPDXRef-DOCUMENT'
    this.created = documentCreationInfo.created ?? new Date().toISOString()
    this.creator = creator
    this.documentNamespace = documentCreationInfo.documentNamespace ?? 'https://my.namespace'
    this.name = name
  }
}

interface DocumentOptions {
  packages: Package[]
  relationships: Relationship[]
}

export class Document {
  creationInfo: DocumentCreationInfo
  packages: Package[]
  relationships: Relationship[]

  constructor (creationInfo: DocumentCreationInfo, options?: Partial<DocumentOptions>) {
    this.creationInfo = creationInfo
    this.packages = options?.packages ?? []
    this.relationships = options?.relationships ?? []
  }
}

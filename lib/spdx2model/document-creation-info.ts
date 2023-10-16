export interface DocumentCreationInfoOptions {
  spdxVersion: string
  created: Date
  dataLicense: string
  externalDocumentRefs: string[]
  creatorComment: string
  licenseListVersion: string
  documentComment: string
}

export class DocumentCreationInfo {
  spdxVersion: string
  spdxId: string = 'SPDXRef-DOCUMENT'
  name: string
  documentNamespace: string
  // TODO: Make created a Date object and handle the conversion later.
  created: string
  // TODO: Add creatorType as constructor argument and  assemble creators with that
  creators: string[]
  dataLicense: string
  externalDocumentRefs: string[]
  creatorComment?: string
  licenseListVersion?: string
  documentComment?: string

  constructor (name: string, documentNamespace: string, creators: string | string[], options?: Partial<DocumentCreationInfoOptions>) {
    this.name = name
    this.documentNamespace = documentNamespace
    this.creators = typeof creators === 'string' ? [creators] : creators
    this.spdxVersion = 'SPDX-' + (options?.spdxVersion ?? '2.3')
    this.created = options?.created?.toISOString() ?? new Date().toISOString()
    this.dataLicense = options?.dataLicense ?? 'CC0-1.0'
    this.externalDocumentRefs = options?.externalDocumentRefs ?? []
    this.creatorComment = options?.creatorComment ?? undefined
    this.licenseListVersion = options?.licenseListVersion ?? undefined
    this.documentComment = options?.documentComment ?? undefined
  }
}

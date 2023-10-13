interface PackageOptions {
  spdxId: string
}

export class Package {
  name: string
  spdxId: string

  constructor (name: string, options?: Partial<PackageOptions>) {
    this.name = name
    this.spdxId = options?.spdxId ?? 'SPDXRef-' + name
  }
}

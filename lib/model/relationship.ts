export class Relationship {
  spdxElementId: string
  relatedSpdxElementId: string
  relationshipType: string

  constructor (spdxElementId: string, relatedSpdxElementId: string, relationshipType: string) {
    this.spdxElementId = spdxElementId
    this.relatedSpdxElementId = relatedSpdxElementId
    this.relationshipType = relationshipType
  }
}

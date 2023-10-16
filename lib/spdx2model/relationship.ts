export interface RelationshipOptions {
  comment?: string
}

export class Relationship {
  spdxElementId: string
  relatedSpdxElementId: string
  relationshipType: string
  comment?: string

  constructor (spdxElementId: string, relatedSpdxElementId: string, relationshipType: string, options?: Partial<RelationshipOptions>) {
    this.spdxElementId = spdxElementId
    this.relatedSpdxElementId = relatedSpdxElementId
    this.relationshipType = relationshipType
    this.comment = options?.comment
  }
}

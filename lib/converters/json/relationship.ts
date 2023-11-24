// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { Relationship } from "../../spdx2model/relationship";

export class JsonRelationship {
  spdxElementId: string;
  relatedSpdxElement: string;
  relationshipType: string;
  comment?: string;

  constructor(
    spdxElementId: string,
    relatedSpdxElement: string,
    relationshipType: string,
    comment?: string,
  ) {
    this.spdxElementId = spdxElementId;
    this.comment = comment;
    this.relatedSpdxElement = relatedSpdxElement;
    this.relationshipType = relationshipType;
  }

  static fromRelationship(relationship: Relationship): JsonRelationship {
    return new JsonRelationship(
      relationship.spdxElementId,
      relationship.relatedSpdxElementId,
      relationship.relationshipType,
    );
  }
}

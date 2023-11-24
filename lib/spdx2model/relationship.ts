// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { Document } from "./document";
import type { Package } from "./package";
import type { File } from "./file";

export enum RelationshipType {
  AMENDS = "AMENDS",
  ANCESTOR_OF = "ANCESTOR_OF",
  BUILD_DEPENDENCY_OF = "BUILD_DEPENDENCY_OF",
  BUILD_TOOL_OF = "BUILD_TOOL_OF",
  CONTAINED_BY = "CONTAINED_BY",
  CONTAINS = "CONTAINS",
  COPY_OF = "COPY_OF",
  DATA_FILE_OF = "DATA_FILE_OF",
  DEPENDENCY_MANIFEST_OF = "DEPENDENCY_MANIFEST_OF",
  DEPENDENCY_OF = "DEPENDENCY_OF",
  DEPENDS_ON = "DEPENDS_ON",
  DESCENDANT_OF = "DESCENDANT_OF",
  DESCRIBED_BY = "DESCRIBED_BY",
  DESCRIBES = "DESCRIBES",
  DEV_DEPENDENCY_OF = "DEV_DEPENDENCY_OF",
  DEV_TOOL_OF = "DEV_TOOL_OF",
  DISTRIBUTION_ARTIFACT = "DISTRIBUTION_ARTIFACT",
  DOCUMENTATION_OF = "DOCUMENTATION_OF",
  DYNAMIC_LINK = "DYNAMIC_LINK",
  EXAMPLE_OF = "EXAMPLE_OF",
  EXPANDED_FROM_ARCHIVE = "EXPANDED_FROM_ARCHIVE",
  FILE_ADDED = "FILE_ADDED",
  FILE_DELETED = "FILE_DELETED",
  FILE_MODIFIED = "FILE_MODIFIED",
  GENERATED_FROM = "GENERATED_FROM",
  GENERATES = "GENERATES",
  HAS_PREREQUISITE = "HAS_PREREQUISITE",
  METAFILE_OF = "METAFILE_OF",
  OPTIONAL_COMPONENT_OF = "OPTIONAL_COMPONENT_OF",
  OPTIONAL_DEPENDENCY_OF = "OPTIONAL_DEPENDENCY_OF",
  OTHER = "OTHER",
  PACKAGE_OF = "PACKAGE_OF",
  PATCH_APPLIED = "PATCH_APPLIED",
  PATCH_FOR = "PATCH_FOR",
  PREREQUISITE_FOR = "PREREQUISITE_FOR",
  PROVIDED_DEPENDENCY_OF = "PROVIDED_DEPENDENCY_OF",
  REQUIREMENT_DESCRIPTION_FOR = "REQUIREMENT_DESCRIPTION_FOR",
  RUNTIME_DEPENDENCY_OF = "RUNTIME_DEPENDENCY_OF",
  SPECIFICATION_FOR = "SPECIFICATION_FOR",
  STATIC_LINK = "STATIC_LINK",
  TEST_CASE_OF = "TEST_CASE_OF",
  TEST_DEPENDENCY_OF = "TEST_DEPENDENCY_OF",
  TEST_OF = "TEST_OF",
  TEST_TOOL_OF = "TEST_TOOL_OF",
  VARIANT_OF = "VARIANT_OF",
}

export interface RelationshipOptions {
  comment: string;
}

export function getSpdxIdFromElement(
  spdxElement: Document | Package | File | string,
): string {
  if (typeof spdxElement === "string") {
    return spdxElement;
  } else if (spdxElement instanceof Document) {
    return spdxElement.creationInfo.spdxId;
  } else {
    return spdxElement.spdxId;
  }
}

export class Relationship {
  spdxElementId: string;
  relatedSpdxElementId: string;
  relationshipType: RelationshipType;
  comment?: string;

  constructor(
    spdxElementId: string,
    relatedSpdxElementId: string,
    relationshipType: RelationshipType,
    options?: Partial<RelationshipOptions>,
  ) {
    this.spdxElementId = spdxElementId;
    this.relatedSpdxElementId = relatedSpdxElementId;
    this.relationshipType = relationshipType;
    this.comment = options?.comment;
  }

  static fromApi(
    spdxElement: Document | Package | File | string,
    relatedSpdxElement: Document | Package | File | string,
    relationshipType: string,
    options?: Partial<RelationshipOptions>,
  ): Relationship {
    return new Relationship(
      getSpdxIdFromElement(spdxElement),
      getSpdxIdFromElement(relatedSpdxElement),
      relationshipType as RelationshipType,
      { comment: options?.comment },
    );
  }
}

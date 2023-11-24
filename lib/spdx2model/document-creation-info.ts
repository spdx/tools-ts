// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { Actor } from "./actor";
import { ExternalDocumentReference } from "./external-document-reference";
import type { CreateDocumentOptions } from "../api/spdx-document";
import { v4 as uuidv4 } from "uuid";

export interface DocumentCreationInfoOptions {
  spdxId: string;
  created: Date;
  dataLicense: string;
  externalDocumentRefs: ExternalDocumentReference[];
  creatorComment: string;
  licenseListVersion: string;
  documentComment: string;
}

export function formatSpdxVersion(spdxVersion?: string): string {
  return `SPDX-${spdxVersion ?? "2.3"}`;
}

export function generateNamespace(documentName: string): string {
  // Remove/replace invalid characters (https://datatracker.ietf.org/doc/html/rfc2141#section-2.1)
  const formattedDocumentName = documentName
    .replace(/^[^A-Za-z0-9]+/, "")
    .replace(/[^A-Za-z0-9-]/g, "-");
  return `urn:${formattedDocumentName || "document"}:${uuidv4()}`;
}

export class DocumentCreationInfo {
  spdxVersion: string;
  dataLicense: string = "CC0-1.0";
  spdxId: string;
  name: string;
  documentNamespace: string;
  externalDocumentRefs: ExternalDocumentReference[];
  licenseListVersion?: string;
  creators: Actor[];
  created: Date;
  creatorComment?: string;
  documentComment?: string;

  constructor(
    spdxVersion: string,
    name: string,
    documentNamespace: string,
    creators: Actor[],
    options?: Partial<DocumentCreationInfoOptions>,
  ) {
    this.spdxVersion = spdxVersion;
    this.name = name;
    this.documentNamespace = documentNamespace;
    this.creators = creators;
    this.created = options?.created ?? new Date();
    this.externalDocumentRefs = options?.externalDocumentRefs ?? [];
    this.creatorComment = options?.creatorComment ?? undefined;
    this.licenseListVersion = options?.licenseListVersion ?? undefined;
    this.documentComment = options?.documentComment ?? undefined;
    this.spdxId = options?.spdxId ?? "SPDXRef-DOCUMENT";
  }

  static fromApi(
    name: string,
    options?: Partial<CreateDocumentOptions>,
  ): DocumentCreationInfo {
    return new DocumentCreationInfo(
      formatSpdxVersion(options?.spdxVersion),
      name,
      options?.namespace ?? generateNamespace(name),
      options?.creators
        ? Actor.fromSpdxActors(options.creators).concat(Actor.tools())
        : [Actor.tools()],
      {
        ...options,
        externalDocumentRefs: options?.externalDocumentRefs
          ? options.externalDocumentRefs.map((ref) =>
              ExternalDocumentReference.fromApi(ref),
            )
          : undefined,
      },
    );
  }
}

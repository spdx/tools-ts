declare enum ActorType {
    Person = "Person",
    Organization = "Organization",
    Tool = "Tool"
}
declare class Actor {
    type: ActorType;
    name: string;
    email?: string;
    constructor(name: string, type: ActorType, email?: string);
    static fromSpdxActor(actor: SpdxActor): Actor;
    static fromSpdxActors(actors: SpdxActor[] | SpdxActor): Actor[];
    static tools(): Actor;
    toString(): string;
}

declare enum ChecksumAlgorithm {
    "SHA1" = "SHA1",
    "BLAKE3" = "BLAKE3",
    "SHA3-384" = "SHA3-384",
    "SHA256" = "SHA256",
    "SHA384" = "SHA384",
    "BLAKE2b-512" = "BLAKE2b-512",
    "BLAKE2b-256" = "BLAKE2b-256",
    "SHA3-512" = "SHA3-512",
    "MD2" = "MD2",
    "ADLER32" = "ADLER32",
    "MD4" = "MD4",
    "SHA3-256" = "SHA3-256",
    "BLAKE2b-384" = "BLAKE2b-384",
    "SHA512" = "SHA512",
    "MD6" = "MD6",
    "MD5" = "MD5",
    "SHA224" = "SHA224"
}
declare class Checksum {
    algorithm: ChecksumAlgorithm;
    value: string;
    constructor(algorithm: ChecksumAlgorithm, value: string);
    static fromSpdxChecksum(checksum: SpdxChecksum): Checksum;
    static fromSpdxChecksums(checksums: SpdxChecksum[] | SpdxChecksum): Checksum[];
}

declare class SpdxNoAssertion {
    toString(): string;
}
declare class SpdxNone {
    toString(): string;
}

declare enum ExternalPackageRefCategory {
    "OTHER" = "OTHER",
    "PERSISTENT-ID" = "PERSISTENT-ID",
    "PERSISTENT_ID" = "PERSISTENT_ID",
    "SECURITY" = "SECURITY",
    "PACKAGE-MANAGER" = "PACKAGE-MANAGER",
    "PACKAGE_MANAGER" = "PACKAGE_MANAGER"
}
declare class ExternalPackageRef {
    category: ExternalPackageRefCategory;
    type: string;
    locator: string;
    comment?: string;
    constructor(category: ExternalPackageRefCategory, type: string, locator: string, comment?: string);
    static fromSpdxExternalPackageRefs(refs: SpdxExternalPackageReference[]): ExternalPackageRef[];
}

interface PackageOptions {
    spdxId: string;
    version: string;
    fileName: string;
    downloadLocation: string | SpdxNoAssertion | SpdxNone;
    supplier: Actor | SpdxNoAssertion;
    originator: Actor | SpdxNoAssertion;
    filesAnalyzed: boolean;
    verificationCode: PackageVerificationCode;
    checksums: Checksum[];
    homepage: string | SpdxNoAssertion | SpdxNone;
    sourceInfo: string;
    licenseConcluded: string | SpdxNoAssertion | SpdxNone;
    licenseInfoFromFiles: Array<string | SpdxNoAssertion | SpdxNone>;
    licenseDeclared: string | SpdxNoAssertion | SpdxNone;
    licenseComment: string;
    copyrightText: string | SpdxNoAssertion | SpdxNone;
    summary: string;
    description: string;
    comment: string;
    externalReferences: ExternalPackageRef[];
    attributionTexts: string[];
    primaryPackagePurpose: PackagePurpose;
    releaseDate: Date;
    builtDate: Date;
    validUntilDate: Date;
}
declare enum PackagePurpose {
    APPLICATION = "APPLICATION",
    FRAMEWORK = "FRAMEWORK",
    LIBRARY = "LIBRARY",
    CONTAINER = "CONTAINER",
    OPERATING_SYSTEM = "OPERATING_SYSTEM",
    DEVICE = "DEVICE",
    FIRMWARE = "FIRMWARE",
    SOURCE = "SOURCE",
    ARCHIVE = "ARCHIVE",
    FILE = "FILE",
    INSTALL = "INSTALL",
    OTHER = "OTHER"
}
interface PackageVerificationCode {
    value: string;
    excludedFiles?: string[];
}
declare class Package {
    name: string;
    downloadLocation: string | SpdxNoAssertion | SpdxNone;
    spdxId: string;
    version?: string;
    fileName?: string;
    supplier?: Actor | SpdxNoAssertion;
    originator?: Actor | SpdxNoAssertion;
    filesAnalyzed: boolean;
    verificationCode?: PackageVerificationCode;
    checksums: Checksum[];
    homepage?: string | SpdxNoAssertion | SpdxNone;
    sourceInfo?: string;
    licenseConcluded?: string | SpdxNoAssertion | SpdxNone;
    licenseInfoFromFiles: Array<string | SpdxNoAssertion | SpdxNone>;
    licenseDeclared?: string | SpdxNoAssertion | SpdxNone;
    licenseComment?: string;
    copyrightText?: string | SpdxNoAssertion | SpdxNone;
    summary?: string;
    description?: string;
    comment?: string;
    externalReferences: ExternalPackageRef[];
    attributionTexts: string[];
    primaryPackagePurpose?: PackagePurpose;
    releaseDate?: Date;
    builtDate?: Date;
    validUntilDate?: Date;
    constructor(name: string, options?: Partial<PackageOptions>);
    static fromApi(name: string, options?: Partial<AddPackagesOptions>): Package;
}

declare class ExternalDocumentReference {
    documentRefId: string;
    documentUri: string;
    checksum: Checksum;
    constructor(documentRefId: string, documentUri: string, checksum: Checksum);
    static fromApi(ref: SpdxDocumentReference): ExternalDocumentReference;
}

interface DocumentCreationInfoOptions {
    spdxId: string;
    created: Date;
    dataLicense: string;
    externalDocumentRefs: ExternalDocumentReference[];
    creatorComment: string;
    licenseListVersion: string;
    documentComment: string;
}
declare class DocumentCreationInfo {
    spdxVersion: string;
    dataLicense: string;
    spdxId: string;
    name: string;
    documentNamespace: string;
    externalDocumentRefs: ExternalDocumentReference[];
    licenseListVersion?: string;
    creators: Actor[];
    created: Date;
    creatorComment?: string;
    documentComment?: string;
    constructor(spdxVersion: string, name: string, documentNamespace: string, creators: Actor[], created: Date, options?: Partial<DocumentCreationInfoOptions>);
    static fromApi(name: string, options?: Partial<CreateDocumentOptions>): DocumentCreationInfo;
}

declare enum FileType {
    OTHER = "OTHER",
    DOCUMENTATION = "DOCUMENTATION",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    ARCHIVE = "ARCHIVE",
    SPDX = "SPDX",
    APPLICATION = "APPLICATION",
    SOURCE = "SOURCE",
    BINARY = "BINARY",
    TEXT = "TEXT",
    AUDIO = "AUDIO"
}
interface FileOptions {
    spdxId: string;
    fileTypes: FileType[];
}
declare class File {
    name: string;
    spdxId: string;
    checksums: Checksum[];
    fileTypes: FileType[];
    constructor(name: string, checksums: Checksum[], options?: Partial<FileOptions>);
    static fromApi(name: string, checksums: [SpdxChecksum] | SpdxChecksum, options?: Partial<AddFileOptions>): File;
}

interface DocumentOptions {
    packages: Package[];
    files: File[];
    snippets: string[];
    annotations: string[];
    relationships: Relationship[];
    otherLicensingInfo: string[];
}
declare class Document {
    creationInfo: DocumentCreationInfo;
    packages: Package[];
    files: File[];
    snippets: string[];
    annotations: string[];
    relationships: Relationship[];
    otherLicensingInfo: string[];
    constructor(creationInfo: DocumentCreationInfo, options?: Partial<DocumentOptions>);
    private hasMissingDescribesRelationships;
    private hasDuplicateSpdxIds;
    gatherValidationIssues(): string[];
    writeFile(location: string): Promise<void>;
}

declare enum RelationshipType {
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
    VARIANT_OF = "VARIANT_OF"
}
interface RelationshipOptions {
    comment: string;
}
declare class Relationship {
    spdxElementId: string;
    relatedSpdxElementId: string;
    relationshipType: RelationshipType;
    comment?: string;
    constructor(spdxElementId: string, relatedSpdxElementId: string, relationshipType: RelationshipType, options?: Partial<RelationshipOptions>);
    static fromApi(spdxElement: Document | Package | File | string, relatedSpdxElement: Document | Package | File | string, relationshipType: string, options?: Partial<RelationshipOptions>): Relationship;
}

interface SpdxActor {
    name: string;
    type: string;
    email?: string;
}
interface SpdxDocumentReference {
    documentRefId: string;
    documentUri: string;
    checksumValue: string;
    checksumAlgorithm: string;
}
interface SpdxChecksum {
    checksumValue: string;
    checksumAlgorithm: string;
}
interface SpdxExternalPackageReference {
    referenceType: string;
    referenceLocator: string;
    referenceCategory: string;
    comment?: string;
}
interface CreateDocumentOptions {
    spdxVersion: string;
    spdxId: string;
    creators: SpdxActor | SpdxActor[];
    created: Date;
    namespace: string;
    externalDocumentRefs: SpdxDocumentReference[];
    creatorComment: string;
    licenseListVersion: string;
    documentComment: string;
}
interface AddPackagesOptions {
    downloadLocation: string;
    spdxId: string;
    version: string;
    fileName: string;
    supplier?: SpdxActor | string;
    originator?: SpdxActor | string;
    filesAnalyzed: boolean;
    verificationCode: PackageVerificationCode;
    checksums: SpdxChecksum[];
    homepage: string;
    sourceInfo: string;
    licenseConcluded: string;
    licenseInfoFromFiles: string[];
    licenseDeclared: string;
    licenseComment: string;
    copyrightText: string;
    summary: string;
    description: string;
    comment: string;
    externalReferences: SpdxExternalPackageReference[];
    attributionTexts: string[];
    primaryPackagePurpose: string;
    releaseDate: Date;
    builtDate: Date;
    validUntilDate: Date;
}
interface AddFileOptions {
    spdxId: string;
    fileTypes: string[];
}
declare class SPDXDocument extends Document {
    static createDocument(name: string, options?: Partial<CreateDocumentOptions>): SPDXDocument;
    addPackage(name: string, options?: Partial<AddPackagesOptions>): Package;
    addFile(name: string, checksums: [SpdxChecksum] | SpdxChecksum, options?: Partial<AddFileOptions>): File;
    addRelationship(spdxElement: Document | Package | File | string, relatedSpdxElement: Document | Package | File | string, relationshipType: string, options?: Partial<RelationshipOptions>): this;
    validate(allowInvalid?: boolean): void;
    write(location: string, allowInvalid?: boolean): Promise<void>;
    writeSync(location: string, allowInvalid?: boolean): void;
}

declare function createDocument(name: string, options?: Partial<CreateDocumentOptions>): SPDXDocument;

export { createDocument };
//# sourceMappingURL=spdx-tools.d.ts.map

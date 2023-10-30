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
}

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
    static fromCreator(creator: Creator): Actor;
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
}

declare class spdxNoAssertion {
    toString(): string;
}
declare class spdxNone {
    toString(): string;
}

interface PackageOptions {
    spdxId: string;
    version: string;
    fileName: string;
    supplier: Actor | spdxNoAssertion;
    originator: Actor | spdxNoAssertion;
    filesAnalyzed: boolean;
    verificationCode: PackageVerificationCode;
    checksums: Checksum[];
    homepage: string | spdxNoAssertion | spdxNone;
    sourceInfo: string;
    licenseConcluded: string | spdxNoAssertion | spdxNone;
    licenseInfoFromFiles: Array<string | spdxNoAssertion | spdxNone>;
    licenseDeclared: string | spdxNoAssertion | spdxNone;
    licenseComment: string;
    copyrightText: string | spdxNoAssertion | spdxNone;
    summary: string;
    description: string;
    comment: string;
    externalReferences: string[];
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
    downloadLocation: string | spdxNoAssertion | spdxNone;
    spdxId: string;
    version?: string;
    fileName?: string;
    supplier?: Actor | spdxNoAssertion;
    originator?: Actor | spdxNoAssertion;
    filesAnalyzed: boolean;
    verificationCode?: PackageVerificationCode;
    checksums: Checksum[];
    homepage?: string | spdxNoAssertion | spdxNone;
    sourceInfo?: string;
    licenseConcluded?: string | spdxNoAssertion | spdxNone;
    licenseInfoFromFiles: Array<string | spdxNoAssertion | spdxNone>;
    licenseDeclared?: string | spdxNoAssertion | spdxNone;
    licenseComment?: string;
    copyrightText?: string | spdxNoAssertion | spdxNone;
    summary?: string;
    description?: string;
    comment?: string;
    externalReferences: string[];
    attributionTexts: string[];
    primaryPackagePurpose?: PackagePurpose;
    releaseDate?: Date;
    builtDate?: Date;
    validUntilDate?: Date;
    constructor(name: string, downloadLocation: string | spdxNoAssertion | spdxNone, options?: Partial<PackageOptions>);
}

declare class ExternalDocumentRef {
    documentRefId: string;
    documentUri: string;
    checksum: Checksum;
    constructor(documentRefId: string, documentUri: string, checksum: Checksum);
}

interface DocumentCreationInfoOptions {
    spdxId: string;
    created: Date;
    dataLicense: string;
    externalDocumentRefs: ExternalDocumentRef[];
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
    externalDocumentRefs: ExternalDocumentRef[];
    licenseListVersion?: string;
    creators: Actor[];
    created: Date;
    creatorComment?: string;
    documentComment?: string;
    constructor(spdxVersion: string, name: string, documentNamespace: string, creators: Actor[], created: Date, options?: Partial<DocumentCreationInfoOptions>);
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
    validate(): string[];
    writeFile(location: string): Promise<void>;
}

interface Creator {
    name: string;
    type: string;
    email?: string;
}
interface DocumentRef {
    documentRefId: string;
    documentUri: string;
    checksum_value: string;
    checksum_algorithm: string;
}
interface InputChecksum {
    checksumValue: string;
    checksumAlgorithm: string;
}
interface CreateDocumentOptions {
    spdxVersion: string;
    spdxId: string;
    creators: Creator | Creator[];
    created: Date;
    namespace: string;
    externalDocumentRefs: DocumentRef[];
    creatorComment: string;
    licenseListVersion: string;
    documentComment: string;
}
interface AddPackagesOptions {
    filesAnalyzed: boolean;
    spdxId: string;
    comment: string;
    verificationCode: PackageVerificationCode;
}
interface AddFileOptions {
    spdxId: string;
    fileTypes: string[];
}
declare class SPDXDocument extends Document {
    private static formatCreators;
    private static formatSpdxVersion;
    private static generateNamespace;
    private static formatExternalDocumentRefs;
    static createDocument(name: string, options?: Partial<CreateDocumentOptions>): SPDXDocument;
    addPackage(name: string, downloadLocation: string, options?: Partial<AddPackagesOptions>): Package;
    addFile(name: string, checksums: [InputChecksum] | InputChecksum, options?: Partial<AddFileOptions>): File;
    addRelationship(spdxElement: Document | Package | File | string, relatedSpdxElement: Document | Package | File | string, relationshipType: string, options?: Partial<RelationshipOptions>): this;
    write(location: string, allowInvalid?: boolean): Promise<void>;
    writeSync(location: string, allowInvalid?: boolean): void;
}

declare function createDocument(name: string, options?: Partial<CreateDocumentOptions>): SPDXDocument;

export { createDocument };
//# sourceMappingURL=spdx-tools.d.ts.map

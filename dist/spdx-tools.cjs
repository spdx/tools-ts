'use strict';

var fs = require('fs/promises');
var uuid = require('uuid');

function formatDatetime(datetime) {
    return datetime.toISOString().split(".")[0] + "Z";
}

class JsonDocumentCreationInfo {
    created;
    creators;
    comment;
    licenseListVersion;
    constructor(created, creators, comment, licenseListVersion) {
        this.created = created;
        this.creators = creators;
        this.comment = comment;
        this.licenseListVersion = licenseListVersion;
    }
    static fromDocument(document) {
        return new JsonDocumentCreationInfo(formatDatetime(document.creationInfo.created), document.creationInfo.creators.map((creator) => creator.toString()), document.creationInfo.creatorComment ?? undefined, document.creationInfo.licenseListVersion ?? undefined);
    }
}

class JsonChecksum {
    algorithm;
    checksumValue;
    constructor(algorithm, checksumValue) {
        this.algorithm = algorithm;
        this.checksumValue = checksumValue;
    }
    static fromChecksum(checksum) {
        return new JsonChecksum(checksum.algorithm, checksum.value);
    }
}

class JsonPackageVerificationCode {
    packageVerificationCodeValue;
    packageVerificationCodeExcludedFiles;
    constructor(packageVerificationCodeValue, packageVerificationCodeExcludedFiles) {
        this.packageVerificationCodeValue = packageVerificationCodeValue;
        this.packageVerificationCodeExcludedFiles =
            packageVerificationCodeExcludedFiles;
    }
    static fromPackageVerificationCode(packageVerificationCode) {
        return new JsonPackageVerificationCode(packageVerificationCode.value, packageVerificationCode.excludedFiles);
    }
}

class JsonExternalPackageRef {
    comment;
    referenceCategory;
    referenceLocator;
    referenceType;
    constructor(referenceCategory, referenceLocator, referenceType, comment) {
        this.referenceCategory = referenceCategory;
        this.referenceLocator = referenceLocator;
        this.referenceType = referenceType;
        this.comment = comment;
    }
    static fromExternalPackageRef(ref) {
        return new JsonExternalPackageRef(ref.category.toString(), ref.locator, ref.type, ref.comment);
    }
}

class JsonPackage {
    name;
    downloadLocation;
    SPDXID;
    filesAnalyzed;
    packageVerificationCode;
    checksums;
    licenseInfoFromFiles;
    externalRefs;
    attributionTexts;
    builtDate;
    comment;
    copyrightText;
    description;
    homepage;
    licenseComments;
    licenseConcluded;
    licenseDeclared;
    originator;
    packageFileName;
    primaryPackagePurpose;
    releaseDate;
    sourceInfo;
    summary;
    supplier;
    validUntilDate;
    versionInfo;
    constructor(name, downloadLocation, SPDXID, filesAnalyzed, packageVerificationCode, checksums, licenseInfoFromFiles, externalRefs, attributionTexts, builtDate, comment, copyrightText, description, homepage, licenseComments, licenseConcluded, licenseDeclared, originator, packageFileName, primaryPackagePurpose, releaseDate, sourceInfo, summary, supplier, validUntilDate, versionInfo) {
        this.name = name;
        this.downloadLocation = downloadLocation;
        this.SPDXID = SPDXID;
        this.filesAnalyzed = filesAnalyzed;
        this.packageVerificationCode = packageVerificationCode;
        this.checksums = checksums;
        this.licenseInfoFromFiles = licenseInfoFromFiles;
        this.externalRefs = externalRefs;
        this.attributionTexts = attributionTexts;
        this.builtDate = builtDate;
        this.comment = comment;
        this.copyrightText = copyrightText;
        this.description = description;
        this.homepage = homepage;
        this.licenseComments = licenseComments;
        this.licenseConcluded = licenseConcluded;
        this.licenseDeclared = licenseDeclared;
        this.originator = originator;
        this.packageFileName = packageFileName;
        this.primaryPackagePurpose = primaryPackagePurpose;
        this.releaseDate = releaseDate;
        this.sourceInfo = sourceInfo;
        this.summary = summary;
        this.supplier = supplier;
        this.validUntilDate = validUntilDate;
        this.versionInfo = versionInfo;
    }
    static fromPackage(pkg) {
        const jsonChecksums = pkg.checksums.length > 0
            ? pkg.checksums.map((checksum) => JsonChecksum.fromChecksum(checksum))
            : undefined;
        const jsonPackageVerificationCode = pkg.verificationCode
            ? JsonPackageVerificationCode.fromPackageVerificationCode(pkg.verificationCode)
            : undefined;
        const jsonExternalPackageRefs = pkg.externalReferences?.length > 0
            ? pkg.externalReferences.map((ref) => JsonExternalPackageRef.fromExternalPackageRef(ref))
            : undefined;
        return new JsonPackage(pkg.name, pkg.downloadLocation.toString(), pkg.spdxId, pkg.filesAnalyzed, jsonPackageVerificationCode, jsonChecksums, pkg.licenseInfoFromFiles.map((licenseInfo) => licenseInfo.toString()), jsonExternalPackageRefs, pkg.attributionTexts.length > 0 ? pkg.attributionTexts : undefined, pkg.builtDate ? formatDatetime(pkg.builtDate) : undefined, pkg.comment, pkg.copyrightText?.toString(), pkg.description, pkg.homepage?.toString(), pkg.licenseComment, pkg.licenseConcluded?.toString(), pkg.licenseDeclared?.toString(), pkg.originator?.toString(), pkg.fileName, pkg.primaryPackagePurpose?.toString(), pkg.releaseDate ? formatDatetime(pkg.releaseDate) : undefined, pkg.sourceInfo, pkg.summary, pkg.supplier?.toString(), pkg.validUntilDate ? formatDatetime(pkg.validUntilDate) : undefined, pkg.version);
    }
}

class JsonRelationship {
    spdxElementId;
    relatedSpdxElement;
    relationshipType;
    comment;
    constructor(spdxElementId, relatedSpdxElement, relationshipType, comment) {
        this.spdxElementId = spdxElementId;
        this.comment = comment;
        this.relatedSpdxElement = relatedSpdxElement;
        this.relationshipType = relationshipType;
    }
    static fromRelationship(relationship) {
        return new JsonRelationship(relationship.spdxElementId, relationship.relatedSpdxElementId, relationship.relationshipType);
    }
}

class JsonExternalDocumentRef {
    checksum;
    externalDocumentId;
    spdxDocument;
    constructor(checksum, externalDocumentId, spdxDocument) {
        this.checksum = checksum;
        this.externalDocumentId = externalDocumentId;
        this.spdxDocument = spdxDocument;
    }
    static fromExternalDocumentRef(ref) {
        const jsonChecksum = JsonChecksum.fromChecksum(ref.checksum);
        return new JsonExternalDocumentRef(jsonChecksum, ref.documentRefId, ref.documentUri);
    }
}

class JsonFile {
    SPDXID;
    fileName;
    checksums;
    attributionTexts;
    comment;
    copyrightText;
    fileContributors;
    fileTypes;
    licenseComments;
    licenseConcluded;
    licenseInfoInFiles;
    noticeText;
    constructor(SPDXID, fileName, checksums, attributionTexts, comment, copyrightText, fileContributors, fileTypes, licenseComments, licenseConcluded, licenseInfoInFiles, noticeText) {
        this.SPDXID = SPDXID;
        this.fileName = fileName;
        this.checksums = checksums;
        this.attributionTexts = attributionTexts;
        this.comment = comment;
        this.copyrightText = copyrightText;
        this.fileContributors = fileContributors;
        this.fileTypes = fileTypes;
        this.licenseComments = licenseComments;
        this.licenseConcluded = licenseConcluded;
        this.licenseInfoInFiles = licenseInfoInFiles;
        this.noticeText = noticeText;
    }
    static fromFile(file) {
        const jsonChecksums = file.checksums.map((checksum) => JsonChecksum.fromChecksum(checksum));
        const jsonFileTypes = file.fileTypes.length > 0
            ? file.fileTypes.map((fileType) => fileType.toString())
            : undefined;
        const jsonLicenseInfoInFiles = file.licenseInfoInFiles.length > 0
            ? file.licenseInfoInFiles.map((licenseInfoInFile) => licenseInfoInFile.toString())
            : undefined;
        return new JsonFile(file.spdxId, file.name, jsonChecksums, file.attributionTexts.length > 0 ? file.attributionTexts : undefined, file.comment, file.copyrightText?.toString(), file.contributors.length > 0 ? file.contributors : undefined, jsonFileTypes, file.licenseComment, file.licenseConcluded?.toString(), jsonLicenseInfoInFiles, file.notice);
    }
}

class JsonDocument {
    SPDXID;
    comment;
    creationInfo;
    dataLicense;
    externalDocumentRefs;
    name;
    spdxVersion;
    documentNamespace;
    packages;
    files;
    relationships;
    constructor(spdxId, spdxVersion, name, documentNamespace, dataLicense, creationInfo, packages, files, relationships, externalDocumentRefs, comment) {
        this.SPDXID = spdxId;
        this.spdxVersion = spdxVersion;
        this.name = name;
        this.documentNamespace = documentNamespace;
        this.dataLicense = dataLicense;
        this.creationInfo = creationInfo;
        this.packages = packages;
        this.files = files;
        this.relationships = relationships;
        this.externalDocumentRefs = externalDocumentRefs;
        this.comment = comment;
    }
    static fromDocument(document) {
        const jsonCreationInfo = JsonDocumentCreationInfo.fromDocument(document);
        const jsonPackages = document.packages.length > 0
            ? document.packages.map((pkg) => JsonPackage.fromPackage(pkg))
            : undefined;
        const jsonFiles = document.files.length > 0
            ? document.files.map((file) => JsonFile.fromFile(file))
            : undefined;
        const jsonRelationships = document.relationships.length > 0
            ? document.relationships.map((relationship) => JsonRelationship.fromRelationship(relationship))
            : undefined;
        const jsonExternalDocumentRefs = document.creationInfo.externalDocumentRefs?.length > 0
            ? document.creationInfo.externalDocumentRefs.map((ref) => JsonExternalDocumentRef.fromExternalDocumentRef(ref))
            : undefined;
        return new JsonDocument(document.creationInfo.spdxId, document.creationInfo.spdxVersion, document.creationInfo.name, document.creationInfo.documentNamespace, document.creationInfo.dataLicense, jsonCreationInfo, jsonPackages, jsonFiles, jsonRelationships, jsonExternalDocumentRefs, document.creationInfo.documentComment);
    }
}

function itemsHaveDuplicateId(spdxIds, items) {
    return items.some((item) => {
        if (spdxIds.has(item.spdxId)) {
            return true;
        }
        spdxIds.add(item.spdxId);
        return false;
    });
}
class Document {
    creationInfo;
    packages;
    files;
    relationships;
    constructor(creationInfo, options) {
        this.creationInfo = creationInfo;
        this.packages = options?.packages ?? [];
        this.files = options?.files ?? [];
        this.relationships = options?.relationships ?? [];
    }
    hasMissingDescribesRelationships() {
        const hasOnlyOnePackage = this.packages.length === 1 && this.files.length === 0;
        const describesRelationships = this.relationships.filter((relationship) => relationship.relationshipType === "DESCRIBES");
        const describedByRelationships = this.relationships.filter((relationship) => relationship.relationshipType === "DESCRIBED_BY");
        return (!hasOnlyOnePackage &&
            describesRelationships.length === 0 &&
            describedByRelationships.length === 0);
    }
    hasDuplicateSpdxIds() {
        const spdxIds = new Set([this.creationInfo.spdxId]);
        return (itemsHaveDuplicateId(spdxIds, this.packages) ||
            itemsHaveDuplicateId(spdxIds, this.files));
    }
    collectValidationIssues() {
        const validationIssues = [];
        if (this.creationInfo.spdxVersion !== "SPDX-2.3") {
            validationIssues.push("Invalid SPDX version. Currently only SPDX-2.3 is supported.");
        }
        if (this.hasMissingDescribesRelationships()) {
            validationIssues.push("Missing DESCRIBES or DESCRIBED_BY relationships.\n" +
                "Document must have at least one DESCRIBES and one DESCRIBED_BY relationship, if there is not exactly one package present.");
        }
        if (this.hasDuplicateSpdxIds()) {
            validationIssues.push("Duplicate SPDX IDs for document, packages or files.");
        }
        return validationIssues;
    }
    async writeFile(location) {
        const convertedDocument = JsonDocument.fromDocument(this);
        const content = JSON.stringify(convertedDocument, null, 2);
        await fs.writeFile(location, content);
    }
}

var RelationshipType;
(function (RelationshipType) {
    RelationshipType["AMENDS"] = "AMENDS";
    RelationshipType["ANCESTOR_OF"] = "ANCESTOR_OF";
    RelationshipType["BUILD_DEPENDENCY_OF"] = "BUILD_DEPENDENCY_OF";
    RelationshipType["BUILD_TOOL_OF"] = "BUILD_TOOL_OF";
    RelationshipType["CONTAINED_BY"] = "CONTAINED_BY";
    RelationshipType["CONTAINS"] = "CONTAINS";
    RelationshipType["COPY_OF"] = "COPY_OF";
    RelationshipType["DATA_FILE_OF"] = "DATA_FILE_OF";
    RelationshipType["DEPENDENCY_MANIFEST_OF"] = "DEPENDENCY_MANIFEST_OF";
    RelationshipType["DEPENDENCY_OF"] = "DEPENDENCY_OF";
    RelationshipType["DEPENDS_ON"] = "DEPENDS_ON";
    RelationshipType["DESCENDANT_OF"] = "DESCENDANT_OF";
    RelationshipType["DESCRIBED_BY"] = "DESCRIBED_BY";
    RelationshipType["DESCRIBES"] = "DESCRIBES";
    RelationshipType["DEV_DEPENDENCY_OF"] = "DEV_DEPENDENCY_OF";
    RelationshipType["DEV_TOOL_OF"] = "DEV_TOOL_OF";
    RelationshipType["DISTRIBUTION_ARTIFACT"] = "DISTRIBUTION_ARTIFACT";
    RelationshipType["DOCUMENTATION_OF"] = "DOCUMENTATION_OF";
    RelationshipType["DYNAMIC_LINK"] = "DYNAMIC_LINK";
    RelationshipType["EXAMPLE_OF"] = "EXAMPLE_OF";
    RelationshipType["EXPANDED_FROM_ARCHIVE"] = "EXPANDED_FROM_ARCHIVE";
    RelationshipType["FILE_ADDED"] = "FILE_ADDED";
    RelationshipType["FILE_DELETED"] = "FILE_DELETED";
    RelationshipType["FILE_MODIFIED"] = "FILE_MODIFIED";
    RelationshipType["GENERATED_FROM"] = "GENERATED_FROM";
    RelationshipType["GENERATES"] = "GENERATES";
    RelationshipType["HAS_PREREQUISITE"] = "HAS_PREREQUISITE";
    RelationshipType["METAFILE_OF"] = "METAFILE_OF";
    RelationshipType["OPTIONAL_COMPONENT_OF"] = "OPTIONAL_COMPONENT_OF";
    RelationshipType["OPTIONAL_DEPENDENCY_OF"] = "OPTIONAL_DEPENDENCY_OF";
    RelationshipType["OTHER"] = "OTHER";
    RelationshipType["PACKAGE_OF"] = "PACKAGE_OF";
    RelationshipType["PATCH_APPLIED"] = "PATCH_APPLIED";
    RelationshipType["PATCH_FOR"] = "PATCH_FOR";
    RelationshipType["PREREQUISITE_FOR"] = "PREREQUISITE_FOR";
    RelationshipType["PROVIDED_DEPENDENCY_OF"] = "PROVIDED_DEPENDENCY_OF";
    RelationshipType["REQUIREMENT_DESCRIPTION_FOR"] = "REQUIREMENT_DESCRIPTION_FOR";
    RelationshipType["RUNTIME_DEPENDENCY_OF"] = "RUNTIME_DEPENDENCY_OF";
    RelationshipType["SPECIFICATION_FOR"] = "SPECIFICATION_FOR";
    RelationshipType["STATIC_LINK"] = "STATIC_LINK";
    RelationshipType["TEST_CASE_OF"] = "TEST_CASE_OF";
    RelationshipType["TEST_DEPENDENCY_OF"] = "TEST_DEPENDENCY_OF";
    RelationshipType["TEST_OF"] = "TEST_OF";
    RelationshipType["TEST_TOOL_OF"] = "TEST_TOOL_OF";
    RelationshipType["VARIANT_OF"] = "VARIANT_OF";
})(RelationshipType || (RelationshipType = {}));
function getSpdxIdFromElement(spdxElement) {
    if (typeof spdxElement === "string") {
        return spdxElement;
    }
    else if (spdxElement instanceof Document) {
        return spdxElement.creationInfo.spdxId;
    }
    else {
        return spdxElement.spdxId;
    }
}
class Relationship {
    spdxElementId;
    relatedSpdxElementId;
    relationshipType;
    comment;
    constructor(spdxElementId, relatedSpdxElementId, relationshipType, options) {
        this.spdxElementId = spdxElementId;
        this.relatedSpdxElementId = relatedSpdxElementId;
        this.relationshipType = relationshipType;
        this.comment = options?.comment;
    }
    static fromApi(spdxElement, relatedSpdxElement, relationshipType, options) {
        return new Relationship(getSpdxIdFromElement(spdxElement), getSpdxIdFromElement(relatedSpdxElement), relationshipType, { comment: options?.comment });
    }
}

var ActorType;
(function (ActorType) {
    ActorType["Person"] = "Person";
    ActorType["Organization"] = "Organization";
    ActorType["Tool"] = "Tool";
})(ActorType || (ActorType = {}));
class Actor {
    type;
    name;
    email;
    constructor(name, type, email) {
        if (type === ActorType.Tool && email) {
            throw new Error("Email must be undefined if actorType is Tool.");
        }
        this.name = name;
        this.email = email ?? undefined;
        this.type = type;
    }
    static fromSpdxActor(actor) {
        const actorType = ActorType[actor.type];
        if (!actorType) {
            throw new Error("Invalid actor type: " + actor.type);
        }
        return new Actor(actor.name, actorType, actor.email);
    }
    static fromSpdxActors(actors) {
        if (Array.isArray(actors)) {
            return actors.map((creator) => Actor.fromSpdxActor(creator));
        }
        else {
            return [Actor.fromSpdxActor(actors)];
        }
    }
    static tools() {
        return new Actor("SPDX Tools TS", ActorType.Tool);
    }
    toString() {
        return (this.type.valueOf() +
            ": " +
            this.name +
            (this.email ? " (" + this.email + ")" : ""));
    }
}

var ChecksumAlgorithm;
(function (ChecksumAlgorithm) {
    ChecksumAlgorithm["SHA1"] = "SHA1";
    ChecksumAlgorithm["BLAKE3"] = "BLAKE3";
    ChecksumAlgorithm["SHA3-384"] = "SHA3-384";
    ChecksumAlgorithm["SHA256"] = "SHA256";
    ChecksumAlgorithm["SHA384"] = "SHA384";
    ChecksumAlgorithm["BLAKE2b-512"] = "BLAKE2b-512";
    ChecksumAlgorithm["BLAKE2b-256"] = "BLAKE2b-256";
    ChecksumAlgorithm["SHA3-512"] = "SHA3-512";
    ChecksumAlgorithm["MD2"] = "MD2";
    ChecksumAlgorithm["ADLER32"] = "ADLER32";
    ChecksumAlgorithm["MD4"] = "MD4";
    ChecksumAlgorithm["SHA3-256"] = "SHA3-256";
    ChecksumAlgorithm["BLAKE2b-384"] = "BLAKE2b-384";
    ChecksumAlgorithm["SHA512"] = "SHA512";
    ChecksumAlgorithm["MD6"] = "MD6";
    ChecksumAlgorithm["MD5"] = "MD5";
    ChecksumAlgorithm["SHA224"] = "SHA224";
})(ChecksumAlgorithm || (ChecksumAlgorithm = {}));
class Checksum {
    algorithm;
    value;
    constructor(algorithm, value) {
        this.algorithm = algorithm;
        this.value = value;
    }
    static fromSpdxChecksum(checksum) {
        const checksumAlgorithm = ChecksumAlgorithm[checksum.checksumAlgorithm];
        if (!checksumAlgorithm) {
            throw new Error("Invalid checksum algorithm: " + checksum.checksumAlgorithm);
        }
        return new Checksum(checksumAlgorithm, checksum.checksumValue);
    }
    static fromSpdxChecksums(checksums) {
        if (Array.isArray(checksums)) {
            return checksums.map((checksum) => Checksum.fromSpdxChecksum(checksum));
        }
        else {
            return [Checksum.fromSpdxChecksum(checksums)];
        }
    }
}

const NOASSERTION = "NOASSERTION";
const NONE = "NONE";
class SpdxNoAssertion {
    toString() {
        return NOASSERTION;
    }
}
class SpdxNone {
    toString() {
        return NONE;
    }
}
function toSpdxType(entry, converter) {
    const defaultConverter = (entry) => {
        return entry;
    };
    if (entry === NOASSERTION) {
        return new SpdxNoAssertion();
    }
    else if (entry === NONE) {
        return new SpdxNone();
    }
    else {
        return converter ? converter(entry) : defaultConverter(entry);
    }
}
function validateSpdxNoAssertion(value) {
    if (!(value instanceof SpdxNoAssertion)) {
        throw new Error(`Invalid entry: ${value.toString()} is not allowed.`);
    }
}

var ExternalPackageRefCategory;
(function (ExternalPackageRefCategory) {
    ExternalPackageRefCategory["OTHER"] = "OTHER";
    ExternalPackageRefCategory["PERSISTENT-ID"] = "PERSISTENT-ID";
    ExternalPackageRefCategory["PERSISTENT_ID"] = "PERSISTENT_ID";
    ExternalPackageRefCategory["SECURITY"] = "SECURITY";
    ExternalPackageRefCategory["PACKAGE-MANAGER"] = "PACKAGE-MANAGER";
    ExternalPackageRefCategory["PACKAGE_MANAGER"] = "PACKAGE_MANAGER";
})(ExternalPackageRefCategory || (ExternalPackageRefCategory = {}));
class ExternalPackageRef {
    category;
    type;
    locator;
    comment;
    constructor(category, type, locator, comment) {
        this.category = category;
        this.type = type;
        this.locator = locator;
        this.comment = comment;
    }
    static fromSpdxExternalPackageRefs(refs) {
        return refs.map((ref) => {
            const referenceCategory = ExternalPackageRefCategory[ref.referenceCategory];
            if (!referenceCategory) {
                throw new Error("Invalid external package reference category: " +
                    ref.referenceCategory);
            }
            return new ExternalPackageRef(referenceCategory, ref.referenceType, ref.referenceLocator, ref.comment);
        });
    }
}

var PackagePurpose;
(function (PackagePurpose) {
    PackagePurpose["APPLICATION"] = "APPLICATION";
    PackagePurpose["FRAMEWORK"] = "FRAMEWORK";
    PackagePurpose["LIBRARY"] = "LIBRARY";
    PackagePurpose["CONTAINER"] = "CONTAINER";
    PackagePurpose["OPERATING_SYSTEM"] = "OPERATING_SYSTEM";
    PackagePurpose["DEVICE"] = "DEVICE";
    PackagePurpose["FIRMWARE"] = "FIRMWARE";
    PackagePurpose["SOURCE"] = "SOURCE";
    PackagePurpose["ARCHIVE"] = "ARCHIVE";
    PackagePurpose["FILE"] = "FILE";
    PackagePurpose["INSTALL"] = "INSTALL";
    PackagePurpose["OTHER"] = "OTHER";
})(PackagePurpose || (PackagePurpose = {}));
function formatPackagePurpose(purpose) {
    const packagePurpose = PackagePurpose[purpose];
    if (!packagePurpose) {
        throw new Error("Invalid package purpose: " + purpose);
    }
    return packagePurpose;
}
function formatVendor(vendor) {
    if (!vendor) {
        return undefined;
    }
    else if (typeof vendor === "string") {
        const spdxVendor = toSpdxType(vendor);
        validateSpdxNoAssertion(spdxVendor);
        return spdxVendor;
    }
    else {
        const spdxVendor = Actor.fromSpdxActor(vendor);
        validateVendorType(spdxVendor);
        return spdxVendor;
    }
}
function validateVendorType(vendor) {
    if (vendor.type !== "Organization" && vendor.type !== "Person") {
        throw new Error(`Invalid vendor type: ${vendor.type}`);
    }
}
class Package {
    name;
    downloadLocation;
    spdxId;
    version;
    fileName;
    supplier;
    originator;
    filesAnalyzed;
    verificationCode;
    checksums;
    homepage;
    sourceInfo;
    licenseConcluded;
    licenseInfoFromFiles;
    licenseDeclared;
    licenseComment;
    copyrightText;
    summary;
    description;
    comment;
    externalReferences;
    attributionTexts;
    primaryPackagePurpose;
    releaseDate;
    builtDate;
    validUntilDate;
    constructor(name, options) {
        this.name = name;
        this.downloadLocation = options?.downloadLocation ?? new SpdxNoAssertion();
        this.spdxId = options?.spdxId ?? "SPDXRef-" + uuid.v4();
        this.version = options?.version ?? undefined;
        this.fileName = options?.fileName ?? undefined;
        this.supplier = options?.supplier ?? undefined;
        this.originator = options?.originator ?? undefined;
        this.filesAnalyzed = options?.filesAnalyzed ?? false;
        this.verificationCode = options?.verificationCode ?? undefined;
        this.checksums = options?.checksums ?? [];
        this.homepage = options?.homepage ?? undefined;
        this.sourceInfo = options?.sourceInfo ?? undefined;
        this.licenseConcluded = options?.licenseConcluded ?? undefined;
        this.licenseInfoFromFiles = options?.licenseInfoFromFiles ?? [];
        this.licenseDeclared = options?.licenseDeclared ?? undefined;
        this.licenseComment = options?.licenseComment ?? undefined;
        this.copyrightText = options?.copyrightText ?? undefined;
        this.summary = options?.summary ?? undefined;
        this.description = options?.description ?? undefined;
        this.comment = options?.comment ?? undefined;
        this.externalReferences = options?.externalReferences ?? [];
        this.attributionTexts = options?.attributionTexts ?? [];
        this.primaryPackagePurpose = options?.primaryPackagePurpose ?? undefined;
        this.releaseDate = options?.releaseDate ?? undefined;
        this.builtDate = options?.builtDate ?? undefined;
        this.validUntilDate = options?.validUntilDate ?? undefined;
    }
    static fromApi(name, options) {
        return new Package(name, {
            spdxId: options?.spdxId,
            version: options?.version,
            fileName: options?.fileName,
            downloadLocation: options?.downloadLocation && toSpdxType(options.downloadLocation),
            supplier: formatVendor(options?.supplier),
            originator: formatVendor(options?.originator),
            filesAnalyzed: options?.filesAnalyzed,
            verificationCode: options?.verificationCode,
            checksums: options?.checksums && Checksum.fromSpdxChecksums(options.checksums),
            homepage: options?.homepage && toSpdxType(options.homepage),
            sourceInfo: options?.sourceInfo,
            licenseConcluded: options?.licenseConcluded && toSpdxType(options.licenseConcluded),
            licenseInfoFromFiles: options?.licenseInfoFromFiles?.map((license) => toSpdxType(license)),
            licenseDeclared: options?.licenseDeclared && toSpdxType(options.licenseDeclared),
            licenseComment: options?.licenseComment,
            copyrightText: options?.copyrightText && toSpdxType(options.copyrightText),
            summary: options?.summary,
            description: options?.description,
            comment: options?.comment,
            externalReferences: options?.externalReferences &&
                ExternalPackageRef.fromSpdxExternalPackageRefs(options.externalReferences),
            attributionTexts: options?.attributionTexts,
            primaryPackagePurpose: options?.primaryPackagePurpose
                ? formatPackagePurpose(options.primaryPackagePurpose)
                : undefined,
            releaseDate: options?.releaseDate,
            builtDate: options?.builtDate,
            validUntilDate: options?.validUntilDate,
        });
    }
}

class ExternalDocumentReference {
    documentRefId;
    documentUri;
    checksum;
    constructor(documentRefId, documentUri, checksum) {
        if (!documentRefId.match(/^DocumentRef-[\da-zA-Z.+-]+$/)) {
            throw new Error(`DocumentRefId must only contain letters, numbers, ".", "-" and "+", ` +
                `and must start with "DocumentRef-, but is: ${documentRefId}.`);
        }
        this.documentRefId = documentRefId;
        this.documentUri = documentUri;
        this.checksum = checksum;
    }
    static fromApi(ref) {
        return new ExternalDocumentReference(ref.documentRefId, ref.documentUri, Checksum.fromSpdxChecksum({
            checksumValue: ref.checksumValue,
            checksumAlgorithm: ref.checksumAlgorithm,
        }));
    }
}

function formatSpdxVersion(spdxVersion) {
    return `SPDX-${spdxVersion ?? "2.3"}`;
}
function generateNamespace(documentName) {
    // Remove/replace invalid characters (https://datatracker.ietf.org/doc/html/rfc2141#section-2.1)
    const formattedDocumentName = documentName
        .replace(/^[^A-Za-z0-9]+/, "")
        .replace(/[^A-Za-z0-9-]/g, "-");
    return `urn:${formattedDocumentName || "document"}:${uuid.v4()}`;
}
class DocumentCreationInfo {
    spdxVersion;
    dataLicense = "CC0-1.0";
    spdxId;
    name;
    documentNamespace;
    externalDocumentRefs;
    licenseListVersion;
    creators;
    created;
    creatorComment;
    documentComment;
    constructor(spdxVersion, name, documentNamespace, creators, options) {
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
    static fromApi(name, options) {
        return new DocumentCreationInfo(formatSpdxVersion(options?.spdxVersion), name, options?.namespace ?? generateNamespace(name), options?.creators
            ? Actor.fromSpdxActors(options.creators).concat(Actor.tools())
            : [Actor.tools()], {
            ...options,
            externalDocumentRefs: options?.externalDocumentRefs
                ? options.externalDocumentRefs.map((ref) => ExternalDocumentReference.fromApi(ref))
                : undefined,
        });
    }
}

var FileType;
(function (FileType) {
    FileType["OTHER"] = "OTHER";
    FileType["DOCUMENTATION"] = "DOCUMENTATION";
    FileType["IMAGE"] = "IMAGE";
    FileType["VIDEO"] = "VIDEO";
    FileType["ARCHIVE"] = "ARCHIVE";
    FileType["SPDX"] = "SPDX";
    FileType["APPLICATION"] = "APPLICATION";
    FileType["SOURCE"] = "SOURCE";
    FileType["BINARY"] = "BINARY";
    FileType["TEXT"] = "TEXT";
    FileType["AUDIO"] = "AUDIO";
})(FileType || (FileType = {}));
function formatFileType(fileType) {
    const fileTypeEnum = FileType[fileType];
    if (!fileTypeEnum) {
        throw new Error("Invalid file type: " + fileType);
    }
    return fileTypeEnum;
}
class File {
    name;
    spdxId;
    checksums;
    fileTypes;
    licenseConcluded;
    licenseInfoInFiles;
    licenseComment;
    copyrightText;
    comment;
    notice;
    contributors;
    attributionTexts;
    constructor(name, checksums, options) {
        this.name = name;
        this.spdxId = options?.spdxId ?? "SPDXRef-" + uuid.v4();
        this.checksums = checksums;
        this.fileTypes = options?.fileTypes ?? [];
        this.licenseConcluded = options?.licenseConcluded ?? undefined;
        this.licenseInfoInFiles = options?.licenseInfoInFiles ?? [];
        this.licenseComment = options?.licenseComment ?? undefined;
        this.copyrightText = options?.copyrightText ?? undefined;
        this.comment = options?.comment ?? undefined;
        this.notice = options?.notice ?? undefined;
        this.contributors = options?.contributors ?? [];
        this.attributionTexts = options?.attributionTexts ?? [];
    }
    static fromApi(name, checksums, options) {
        return new File(name, Checksum.fromSpdxChecksums(checksums), {
            spdxId: options?.spdxId ?? undefined,
            fileTypes: options?.fileTypes
                ? options.fileTypes.map((fileType) => formatFileType(fileType))
                : undefined,
            licenseConcluded: options?.licenseConcluded && toSpdxType(options.licenseConcluded),
            licenseInfoInFiles: options?.licenseInfoInFiles?.map((licenseInfo) => toSpdxType(licenseInfo)),
            licenseComment: options?.licenseComment ?? undefined,
            copyrightText: options?.copyrightText && toSpdxType(options.copyrightText),
            comment: options?.comment ?? undefined,
            notice: options?.notice ?? undefined,
            contributors: options?.contributors ?? [],
            attributionTexts: options?.attributionTexts ?? [],
        });
    }
}

class SPDXDocument extends Document {
    static createDocument(name, options) {
        const creationInfo = DocumentCreationInfo.fromApi(name, options);
        return new SPDXDocument(creationInfo);
    }
    addPackage(name, options) {
        const pkg = Package.fromApi(name, options);
        this.packages.push(pkg);
        return pkg;
    }
    addFile(name, checksums, options) {
        const file = File.fromApi(name, checksums, options);
        this.files.push(file);
        return file;
    }
    addRelationship(spdxElement, relatedSpdxElement, relationshipType, options) {
        const relationship = Relationship.fromApi(spdxElement, relatedSpdxElement, relationshipType, options);
        this.relationships.push(relationship);
        return this;
    }
    validate(allowInvalid = true) {
        const validationIssues = this.collectValidationIssues();
        if (validationIssues.length > 0) {
            const validationMessage = "Document is invalid: " + validationIssues.join("\n");
            if (!allowInvalid) {
                throw new Error(validationMessage);
            }
            console.error(validationMessage);
        }
        else {
            console.log("Document is valid");
        }
    }
    async write(location, allowInvalid = false) {
        this.validate(allowInvalid);
        await this.writeFile(location);
    }
    writeSync(location, allowInvalid = false) {
        this.validate(allowInvalid);
        this.writeFile(location)
            .then(() => {
            console.log("Wrote SBOM successfully: " + location);
        })
            .catch((error) => {
            console.error("Error writing sample SBOM: " + error);
        });
    }
}

function parseMajorVersion(spdxVersion) {
    return parseInt(spdxVersion.split(".")[0]);
}
function createDocument(name, options) {
    const spdxVersion = options?.spdxVersion;
    if (!spdxVersion || parseMajorVersion(spdxVersion) === 2) {
        return SPDXDocument.createDocument(name, options);
    }
    else {
        throw new Error("Unsupported SPDX version");
    }
}

exports.createDocument = createDocument;
//# sourceMappingURL=spdx-tools.cjs.map

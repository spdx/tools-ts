import { v4 } from 'uuid';
import fs from 'fs/promises';

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
        this.name = name;
        this.email = email ?? undefined;
        this.type = type;
    }
    static fromCreator(creator) {
        const actorType = ActorType[creator.type];
        if (!actorType) {
            throw new Error("Invalid actor type: " + creator.type);
        }
        return new Actor(creator.name, actorType, creator.email);
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
    // TODO: Implement LicenseExpression class
    licenseConcluded;
    licenseInfoFromFiles;
    licenseDeclared;
    licenseComment;
    copyrightText;
    summary;
    description;
    comment;
    // TODO: Implement ExternalPackageRef class
    externalReferences;
    attributionTexts;
    primaryPackagePurpose;
    releaseDate;
    builtDate;
    validUntilDate;
    constructor(name, downloadLocation, options) {
        this.name = name;
        this.downloadLocation = downloadLocation;
        this.spdxId = options?.spdxId ?? "SPDXRef-" + v4();
        this.version = options?.version ?? undefined;
        this.fileName = options?.fileName ?? undefined;
        this.supplier = options?.supplier ?? undefined;
        this.originator = options?.originator ?? undefined;
        this.filesAnalyzed = options?.filesAnalyzed ?? true;
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
}

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
    constructor(name, downloadLocation, SPDXID, filesAnalyzed, checksums, licenseInfoFromFiles, externalRefs, attributionTexts, packageVerificationCode) {
        this.name = name;
        this.downloadLocation = downloadLocation;
        this.SPDXID = SPDXID;
        this.filesAnalyzed = filesAnalyzed;
        this.packageVerificationCode = packageVerificationCode;
        this.checksums = checksums;
        this.licenseInfoFromFiles = licenseInfoFromFiles;
        this.externalRefs = externalRefs;
        this.attributionTexts = attributionTexts;
    }
    static fromPackage(pkg) {
        const jsonChecksums = pkg.checksums.length > 0
            ? pkg.checksums.map((checksum) => JsonChecksum.fromChecksum(checksum))
            : undefined;
        const jsonPackageVerificationCode = pkg.verificationCode
            ? JsonPackageVerificationCode.fromPackageVerificationCode(pkg.verificationCode)
            : undefined;
        return new JsonPackage(pkg.name, pkg.downloadLocation.toString(), pkg.spdxId, pkg.filesAnalyzed, jsonChecksums, 
        // TODO: Fill in licenseInfoFromFiles
        undefined, undefined, undefined, jsonPackageVerificationCode);
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
    // TODO: Should this be of type FileType[] -> where should the enum live?
    fileTypes;
    constructor(SPDXID, fileName, checksums, fileTypes) {
        this.SPDXID = SPDXID;
        this.fileName = fileName;
        this.checksums = checksums;
        this.fileTypes = fileTypes;
    }
    static fromFile(file) {
        const jsonChecksums = file.checksums.map((checksum) => JsonChecksum.fromChecksum(checksum));
        return new JsonFile(file.spdxId, file.name, jsonChecksums, file.fileTypes);
    }
}

class JsonDocument {
    SPDXID;
    // TODO: Implement
    // annotations
    comment;
    creationInfo;
    dataLicense;
    externalDocumentRefs;
    // TODO: Implement
    // hasExtractedLicenseInfos
    name;
    spdxVersion;
    documentNamespace;
    packages;
    // TODO: Implement
    files;
    // TODO: Implement
    // snippets;
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

class Document {
    creationInfo;
    packages;
    files;
    // TODO: Implement
    snippets;
    // TODO: Implement
    annotations;
    relationships;
    // TODO: Implement
    otherLicensingInfo;
    constructor(creationInfo, options) {
        this.creationInfo = creationInfo;
        this.packages = options?.packages ?? [];
        this.files = options?.files ?? [];
        this.snippets = options?.snippets ?? [];
        this.annotations = options?.annotations ?? [];
        this.relationships = options?.relationships ?? [];
        this.otherLicensingInfo = options?.otherLicensingInfo ?? [];
    }
    hasMissingDescribesRelationships() {
        const hasOnlyOnePackage = this.packages.length === 1 &&
            this.files.length === 0 &&
            this.snippets.length === 0;
        const describesRelationships = this.relationships.filter((relationship) => relationship.relationshipType === "DESCRIBES");
        const describedByRelationships = this.relationships.filter((relationship) => relationship.relationshipType === "DESCRIBED_BY");
        return !(hasOnlyOnePackage ||
            describesRelationships.length > 0 ||
            describedByRelationships.length > 0);
    }
    hasDuplicateSpdxIds() {
        const spdxIds = [];
        this.packages.forEach((pkg) => {
            if (spdxIds.includes(pkg.spdxId)) {
                return true;
            }
            spdxIds.push(pkg.spdxId);
        });
        // TODO: Uncomment when files and snippets are implemented
        // this.files.forEach((file) => {
        //   if (spdxIds.includes(file.spdxId)) {
        //     return true;
        //   }
        //   spdxIds.push(file.spdxId);
        // });
        // this.snippets.forEach((snippet) => {
        //   if (spdxIds.includes(snippet.spdxId)) {
        //     return true;
        //   }
        //   spdxIds.push(snippet.spdxId);
        // });
        this.relationships.forEach((relationship) => {
            if (spdxIds.includes(relationship.spdxElementId)) {
                return true;
            }
            spdxIds.push(relationship.spdxElementId);
        });
        return false;
    }
    validate() {
        const validationIssues = [];
        if (this.creationInfo.spdxVersion !== "SPDX-2.3") {
            validationIssues.concat("Invalid SPDX version. Currently only SPDX-2.3 is supported.");
        }
        if (this.hasMissingDescribesRelationships()) {
            validationIssues.concat("Missing DESCRIBES or DESCRIBED_BY relationships.", "Document must have at least one DESCRIBES and one DESCRIBED_BY relationship, if there is not exactly one package present.");
        }
        if (this.hasDuplicateSpdxIds()) {
            validationIssues.concat("Duplicate SPDX IDs for packages, files, snippets or relationships.");
        }
        return validationIssues;
    }
    async writeFile(location) {
        const convertedDocument = JsonDocument.fromDocument(this);
        const content = JSON.stringify(convertedDocument, null, 2);
        await fs.writeFile(location, content);
    }
}

class DocumentCreationInfo {
    spdxVersion;
    dataLicense = "CC0-1.0";
    // TODO: Verify that this is correct
    spdxId;
    name;
    documentNamespace;
    externalDocumentRefs;
    licenseListVersion;
    creators;
    created;
    creatorComment;
    documentComment;
    constructor(spdxVersion, name, documentNamespace, creators, created, options) {
        this.spdxVersion = spdxVersion;
        this.name = name;
        this.documentNamespace = documentNamespace;
        this.creators = creators;
        this.created = created;
        this.externalDocumentRefs = options?.externalDocumentRefs ?? [];
        this.creatorComment = options?.creatorComment ?? undefined;
        this.licenseListVersion = options?.licenseListVersion ?? undefined;
        this.documentComment = options?.documentComment ?? undefined;
        this.spdxId = options?.spdxId ?? "SPDXRef-DOCUMENT";
    }
}

class ExternalDocumentRef {
    documentRefId;
    documentUri;
    checksum;
    constructor(documentRefId, documentUri, checksum) {
        // TODO: What are the constraints for this?
        this.documentRefId = documentRefId;
        this.documentUri = documentUri;
        this.checksum = checksum;
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
// TODO: Implement optional properties
class File {
    name;
    spdxId;
    checksums;
    fileTypes;
    constructor(name, checksums, options) {
        this.name = name;
        this.spdxId = "SPDXRef-" + v4();
        this.checksums = checksums;
        this.fileTypes = options?.fileTypes ?? [];
    }
}

class SPDXDocument extends Document {
    static formatCreators(creators) {
        if (!creators) {
            return [];
        }
        else if (Array.isArray(creators)) {
            return creators.map((creator) => Actor.fromCreator(creator));
        }
        else {
            return [Actor.fromCreator(creators)];
        }
    }
    static formatSpdxVersion(spdxVersion) {
        return "SPDX-" + (spdxVersion ?? "2.3");
    }
    static generateNamespace(documentName) {
        // Remove/replace invalid characters (https://datatracker.ietf.org/doc/html/rfc2141#section-2.1)
        const formattedDocumentName = documentName
            .replace(/^[^A-Za-z0-9]+/, "")
            .replace(/[^A-Za-z0-9-]/g, "-");
        return "urn:" + (formattedDocumentName ?? "document") + ":" + v4();
    }
    static formatExternalDocumentRefs(refs) {
        return refs
            ? refs.map((ref) => new ExternalDocumentRef(ref.documentRefId, ref.documentUri, new Checksum(ref.checksum_algorithm, ref.checksum_value)))
            : undefined;
    }
    static createDocument(name, options) {
        const creationInfo = new DocumentCreationInfo(this.formatSpdxVersion(options?.spdxVersion), name, options?.namespace ?? this.generateNamespace(name), this.formatCreators(options?.creators).concat(Actor.tools()), options?.created ?? new Date(), {
            ...options,
            externalDocumentRefs: this.formatExternalDocumentRefs(options?.externalDocumentRefs),
        });
        return new SPDXDocument(creationInfo);
    }
    addPackage(name, downloadLocation, options) {
        const pkg = new Package(name, downloadLocation, options);
        this.packages = this.packages.concat(pkg);
        return pkg;
    }
    addFile(name, checksums, options) {
        const formattedChecksums = Array.isArray(checksums)
            ? checksums.map((checksum) => new Checksum(checksum.checksumAlgorithm, checksum.checksumValue))
            : [
                new Checksum(checksums.checksumAlgorithm, checksums.checksumValue),
            ];
        const fileTypes = options?.fileTypes
            ? options.fileTypes.map((fileType) => fileType)
            : undefined;
        const file = new File(name, formattedChecksums, {
            spdxId: options?.spdxId ?? undefined,
            fileTypes,
        });
        this.files = this.files.concat(file);
        return file;
    }
    addRelationship(spdxElement, relatedSpdxElement, relationshipType, options) {
        function getSpdxId(spdxElement) {
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
        const relationship = new Relationship(getSpdxId(spdxElement), getSpdxId(relatedSpdxElement), relationshipType, { comment: options?.comment });
        this.relationships = this.relationships.concat(relationship);
        return this;
    }
    async write(location, allowInvalid = false) {
        const validationIssues = this.validate();
        if (validationIssues.length > 0) {
            console.error(`Document is invalid: ${validationIssues.join("\n")}`);
            if (!allowInvalid) {
                return;
            }
        }
        await this.writeFile(location);
    }
    writeSync(location, allowInvalid = false) {
        const validationIssues = this.validate();
        if (validationIssues.length > 0) {
            console.error(`Document is invalid: ${validationIssues.join("\n")}`);
            if (!allowInvalid) {
                return;
            }
        }
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

export { createDocument };
//# sourceMappingURL=spdx-tools.mjs.map

# API

We here document the usage of all fully implemented SPDX features.
For further documentation on the SPDX format, please refer to the [official SPDX specification](https://spdx.github.io/spdx-spec/v2.3/).

## Documents
Documents form the basis of SPDX SBOMs.
They contain all information and can be exported to different formats (currently only json is supported).
Documents can be created with the command `sbom.createDocument`:

```javascript
const document = sbom.createDocument(
    "my-first-document",
    [{ name: "My Name", type: "Person" }],
);
```

It requires the following arguments:

| Argument | Format | Description |
| ----------- | ----------- | ----------- |
| name | String | Name of the document |
| Creators | [{name: string, type: "Person" / "Organization" / "Tool", email?: string}] | Creators of the document |

In addition, it takes an object with the following optional parameters:

| Argument | Format | Default | Description |
| ----------- | ----------- | ----------- | ----------- |
| spdxVersion | string | 2.3 | SPDX version of the document |
| created | Date | current moment | Date of creation of the document |
| namespace | string | "https://\<documentName\>-\<UUID\>" | Namespace of the document |
| dataLicense | string | "CC0-1.0" | License of the document |
| externalDocumentRefs | {documentRefId: string, documentUri: string, checksum_value: string, checksum_algorithm: string} | - | External documents referenced by the document |
| creatorComment | string | - | Comment on the creator |
| licenseListVersion | string | - | Version of the license list used |
| documentComment | string | - | Comment on the document |

## Packages
Packages are used to describe the contents of a software package.
After creating a document (see [Documents](#Documents)), packages can be added with the command `document.addPackages`:

```javascript
const pkg = document.addPackage("my-package", {
    downloadLocation: "https://download-location.com",
});
```

It requires the following arguments:

| Argument | Format | Description |
| ----------- | ----------- | ----------- |
| name | String | Name of the package |

In addition, it takes an object with the following optional parameters:

| Argument | Format | Default | Description |
| ----------- | ----------- | ----------- | ----------- |
| downloadLocation | string | NOASSERTION | Download location of the package |
| spdxId | string | SPDX-Ref-<UUID V4> | ID of the package |
| version | string | - | Version of the package |
| fileName | string | - | File name of the package |
| supplier | {name: string, type: "Person" / "Organization" / "Tool", email?: string} / "NOASSERTION" | - | Supplier of the package |
| originator | {name: string, type: "Person" / "Organization" / "Tool", email?: string} / "NOASSERTION" | - | Originator of the package |
| filesAnalyzed | boolean | false | Indicates whether the package contents have been analyzed |
| verificationCode | {value: string, excludedFiles?: string[]} | - | Identification for contents of a package |
| checksums | {checksumValue: string, checksumAlgorithm: string}[] | - | Checksums of the package |
| homePage | string | - | Homepage of the package |
| sourceInfo | string | - | Information about the source of the package |
| licenseConcluded | string | - | License concluded for the package |
| licenseInfoFromFiles | string[] | [] | Licenses found in the package |
| licenseDeclared | string | - | License declared for the package |
| licenseComment | string | - | Comments about the license |
| copyrightText | string | - | Copyright |
| summary | string | - | Summary of the package |
| description | string | - | Description of the package |
| comment | string | - | Additional information |
| externalReferences | string[] | [] | External references |
| attributionTexts | string[] | [] | Attribution texts |
| primaryPackagePurpose | string | - | Primary purpose of the package |
| releaseDate | Date | - | Release date of the package |
| buildDate | Date | - | Build date of the package |
| validUntilDate | Date | - | Date until which the package is valid |

## Files
Files are used to provide information about files that are contained in software packages.
After creating a document (see [Documents](#Documents)), files can be added with the command `document.addFiles`:

```javascript
document.addFile(
    "my-file",
    {
        checksumValue: "de9f2c7fd25e1b3afad3e85a0bd17d9b100db4b3",
        checksumAlgorithm: "SHA1",
    },
    {
        fileTypes: ["TEXT"],
        concludedLicense: "MIT",
    },
);
```

It requires the following arguments:

| Argument | Format | Description |
| ----------- | ----------- | ----------- |
| name | String | Name of the file |
| checksums | {checksumValue: string, checksumAlgorithm: string}[] | Checksums of the file |


In addition, it takes an object with the following optional parameters:

| Argument | Format | Default | Description |
| ----------- | ----------- | ----------- | ----------- |
| spdxId | string | SPDX-Ref-<UUID V4> | ID of the package |
| fileTypes | string[] | - | Types of the files (for example TEXT) |


## Relationships
Relationships are used to describe the relationship between different SPDX elements.
After creating a document (see [Documents](#Documents)), relationships can be added with the command `document.createRelationship`:

```javascript
const relationship = document.createRelationship(
    "SPDXRef-Document",
    "SPDXRef-Package",
    "DESCRIBES",
);
```

It requires the following arguments:

| Argument | Format | Description |
| ----------- | ----------- | ----------- |
| spdxElement | Document / Package / File / string | spdx element or id that was used to create an spdx element |
| relatedSpdxElement | Document / Package / File / string | related spdx element or id that was used to create the related spdx element |
| relationshipType | string | Type of the relationship |

In addition, it takes an object with the following optional parameters:

| Argument | Format | Default | Description |
| ----------- | ----------- | ----------- | ----------- |
| comment | string | - | Comment about the relationship |

## Writing a document
After creating a document (see [Documents](#Documents)), it can be written to a file with the command `document.write` or `document.writeSync`:

```javascript
document.writeSync("/path/to/my-document.spdx.json");
```

or asynchronously:

```javascript
await document.write("/path/to/my-document.spdx.json");
```

It requires the following arguments:

| Argument | Format | Description |
| ----------- | ----------- | ----------- |
| location | string | Path where the file should be written |

In addition, it takes an object with the following optional parameters:

| Argument | Format | Default | Description |
| ----------- | ----------- | ----------- | ----------- |
| allowInvalid | boolean | false | Write file even if the SPDX file will be invalid |


<!--
SPDX-FileCopyrightText: 2023 SPDX contributors

SPDX-License-Identifier: CC0-1.0
-->

# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Support for [snippet information] (https://spdx.github.io/spdx-spec/v2.3/snippet-information/).
- Support for [annotation information] (https://spdx.github.io/spdx-spec/v2.3/annotations/).
- Support for [other licensing information] (https://spdx.github.io/spdx-spec/v2.3/other-licensing-information-detected/).
- Support for [SPDX 3] (https://github.com/spdx/spdx-3-model).

## [0.0.4] - 2023-11-27
### Added
- Implementation of [SPDX 2.3 model] (https://spdx.github.io/spdx-spec/v2.3/) with documents, packages, files and relationships.
- API for creating, filling, and writing SPDX documents.
- JSON serialization according to the [SPDX 2.3 schema] (https://github.com/spdx/spdx-spec/blob/development/v2.3.1/schemas/spdx-schema.json).

## [0.0.5] - 2023-11-29
### Added
- Exports of document, package, file, and relationship classes.

### Changed
- Usage instructions in README.md.

## [0.0.6] - 2023-11-30
### Fixed
- Export relationshipType correctly. It is an enum and should not be exported as type.

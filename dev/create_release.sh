#!/usr/bin/env bash
set -euo pipefail

# SPDX-FileCopyrightText: 2023 2023 SPDX contributors
#
# SPDX-License-Identifier: MIT

# Ensure that exactly one argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 {major|minor|patch}"
    exit 1
fi

cd "$(dirname "$0")/.."

# Build the library
npm run build

# Login to npm if not already logged in
if ! npm whoami > /dev/null 2>&1; then
    npm login
fi

# Run the release script
case "$1" in
    major)
        npm version major
        ;;
    minor)
        npm version minor
        ;;
    patch)
        npm version patch
        ;;
    *)
        echo "Usage: $0 {major|minor|patch}"
        exit 1
        ;;
esac

# Publish the release and create a tag
npm publish
npm dist-tag

# Parse the version number from package.json using jq
# jq must be installed: https://stedolan.github.io/jq/
version=$(jq -r '.version' package.json)

# Check if jq was able to extract the version
if [ -z "$version" ]; then
    echo "Unable to extract version from package.json. Exiting."
    exit 1
fi

# Construct the release tag using the version
release_tag="v$version"
commit_message="Release $release_tag"

# Stage the built files
git add dist

# Commit the staged changes
git commit -m "$commit_message"

# Check if the commit was successful
if [ $? -ne 0 ]; then
    echo "Git commit failed. Exiting."
    exit 1
fi

# Create a tag for the commit
git tag -a "$release_tag" -m "$commit_message"

# Check if the tag was created successfully
if [ $? -ne 0 ]; then
    echo "Failed to create the tag. Exiting."
    exit 1
fi

echo "Successfully created a new npm release and the commit $release_tag with tag. \
Please push and merge this commit."

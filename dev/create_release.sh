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

# Build the release
npm run build

# check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful, proceeding with release."
else
    echo "Build failed, aborting release."
    exit 1
fi

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

echo "Release successful. Please push the created commit and tag to GitHub."

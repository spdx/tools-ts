<!--
SPDX-FileCopyrightText: 2023 SPDX contributors

SPDX-License-Identifier: CC0-1.0
-->

# Contributing Guidelines
Thank you for your interest in contributing to our project!

## How Can I Contribute?
There are several ways you can contribute to our project. Here are a few:
1. Raise Issues: Spot a bug or a feature that's missing? Open a new issue in the issue tracker.
   Please make sure that the issue has not already been reported. If one exists your can contribute by adding helpful information to the existing thread.
2. Review Issues: Try to reproduce other people's bugs and help troubleshoot them, or weigh in on feature requests and enhancements.
3. Offer Pull Requests (PRs): Pick something from the issue tracker and submit a PR. Please check that no one else is already working on it.
4. Improve Documentation: Often overlooked, but very important, we always appreciate help in maintaining our documentation.

## Development
1. Fork the repository on GitHub.
2. Clone the project from your forked repository to your machine.
3. Create a new branch for your work.
4. Make your changes, ensuring to write tests that cover the new code and functionality.
5. Submit your PR with detailed and well-documented explanations of your changes.

## Pull Requests
1. Ensure all dependencies are properly installed and all tests pass.
2. Update the README.md with details of changes.
3. The pull request will be merged once it gets approval from the maintainers.
4. Please signoff every commit with `git commit --signoff` or `-s` to indicate that you agree to the [Developer Certificate of Origin](DCO.md).

## Testing
We use the testing framework [Jest](https://jestjs.io) for testing.
Run the tests with:
```shell
npm install
npm run test
```

## Releasing
Note: To create a new release, you need to be part of the [SPDX organization] (https://www.npmjs.com/org/spdx) on npm.
To create a new release, follow these steps:
1. Implement changes and run the tests with `npm run test`.
2. Update the changelog in `CHANGELOG.md`.
3. Build the project with `npm run build`.
4. Create a pull request with the changes, make sure the CI is green, get it reviewed and merge it.
5. Depending on the changes, run `npm run major-release`, `npm run minor-release`, or `npm run patch-release`.
Note: You do not need to manually update the version in `package.json`, this is done automatically by the release script.
6. Step 5 will create a new commit and tag it with the new version. Push the commit and the tag to the remote repository, create a pull request and merge it.


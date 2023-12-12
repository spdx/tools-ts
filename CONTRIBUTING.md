<!--
SPDX-FileCopyrightText: 2023 SPDX contributors

SPDX-License-Identifier: CC0-1.0
-->

# Contributing Guidelines
Thank you for your interest in @spdx/tools.

## Issues
There is a [list of issues](https://github.com/spdx/tools-ts/issues) for @spdx/tools.
We use labels to identify bugs and issues that are good for beginners or particularly small.
For bugs, improvements or suggestions, feel free to [create a new issue](https://github.com/spdx/tools-ts/issues/new).
Please keep the issues small and concise. Issues that aim at solving multiple things at once tend to create lots of problems.
For open questions or other discussions, please contact the SPDX working group technical team through its mailing list, [spdx-tech@lists.spdx.org](mailto:spdx-tech@lists.spdx.org).

If you want to work on an issue, please assign the ticket to yourself or leave a comment on the issue.

## Development
For contributing to @spdx/tools, please follow the [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow):
1. Select an issue to work on or create a new issue. Assign the issue to yourself. Consider reviewing open pull requests to avoid duplicate work.
2. Fork the repository, as described [here](https://docs.github.com/en/get-started/quickstart/fork-a-repo#forking-a-repository). Clone the fork to your local machine and make sure to keep the fork in sync with the upstream repository.
3. Install all dependencies and create a new branch for your work:
```shell
npm install
git checkout -b your-new-feature
```
4. Make your changes and ensure to write tests that cover the new code and functionality.
5. Commit the changes to your branch:
```shell
git commit --signoff -m "Add new feature"
```
Please sign off every commit in order to acknowledge that you agree to the [Developer Certificate of Origin](DCO.md).
6. Push the changes to your fork:
```shell
git push origin your-new-feature
```
7. Create a pull request from your fork to the upstream repository. Make sure that all CI workflows are green. Please reference the fixed issue in the pull request.

## Testing
We use the testing framework [Jest](https://jestjs.io) for testing.
To run the tests, navigate to the library root and run:
```shell
npm run test
```

Test the Rollup plugin by running:
```shell
npm run test-rollup-plugin
```

## Building
We use [Rollup] (https://rollupjs.org) for building the library and the Rollup plugin, and [@yarnpkg/builder] (https://www.npmjs.com/package/@yarnpkg/builder) for building the Yarn plugin.
To build the library, navigate to the library root and run:
```shell
npm run build
```

To build the Rollup plugin, run:
```shell
npm run build-rollup-plugin
```

To build the Yarn plugin, run:
```shell
npm run build-yarn-plugin
```

## Releasing
Note: To create a new release, you need to be part of the [SPDX organization] (https://www.npmjs.com/org/spdx) on npm.
To create a new release, follow these steps:
1. Make sure that the [changelog](CHANGELOG.md) is up to date and that all CI workflows are green. 
2. Depending on the changes, since the last release, run `npm run major-release`, `npm run minor-release`, or `npm run patch-release`.
This will create a new release and a new commit and tag with the new version.
Note: You do not need to manually update the version in `package.json`, this is done automatically by the release script. 
3. Push the newly created commit to the remote repository. 
4. Push the newly created tag to the remote repository with `git push origin <tagname>`.

## References
- [SPDX 2.3 specification](https://spdx.github.io/spdx-spec/v2.3/)
- [JSON schema](https://github.com/spdx/spdx-spec/blob/development/v2.3.1/schemas/spdx-schema.json)
- Yarn plugin that uses this library: [yarn-plugin-spdx](https://github.com/spdx/yarn-plugin-spdx)
- Rollup plugin that uses this library: [rollup-plugin-spdx](https://github.com/spdx/rollup-plugin-spdx)

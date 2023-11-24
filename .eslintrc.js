// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["standard-with-typescript", "plugin:prettier/recommended"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}", "jest.config.js"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["prettier"],
  rules: {
    "@typescript-eslint/no-extraneous-class": 0,
    "@typescript-eslint/strict-boolean-expressions": 0,
    "@typescript-eslint/no-invalid-void-type": 0,
    "@typescript-eslint/prefer-nullish-coalescing": 0,
    "@typescript-eslint/consistent-type-exports": "error",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { fixStyle: "separate-type-imports" },
    ],
    "prettier/prettier": "error",
  },
};

import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.js", "test/bootstrap/**/*.js", "*.js"],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    rules: {
      "no-console": "off",
      "no-use-before-define": "error"
    }
  }
];

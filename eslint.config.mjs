import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import react from "eslint-plugin-react";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: [
        ...compat.extends("eslint:recommended"),
        ...compat.extends("plugin:react/recommended"),
        ...nextCoreWebVitals
    ],

    plugins: {
        react,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            process: "readonly",
        },

        ecmaVersion: "latest",
        sourceType: "module",
    },

    rules: {
        quotes: ["error", "double"],
        semi: ["error", "always"],
    },
}]);
import js from "@eslint/js";
import globals from "globals";

export default [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "script",
			globals: {
				...globals.browser,
				...globals.webextensions,
				chrome: "readonly"
			},
		},
		rules: {
			"semi": ["error", "always"],
			"quotes": ["error", "double"],
			"no-unused-vars": "warn",
			"no-console": "off"
		}
	}
];
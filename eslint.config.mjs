import globals from "globals";

export default [
	{
		// 1. Decimos a ESLint que ignore carpetas basura
		ignores: ["node_modules/**", "dist/**", "*.zip"]
	},
	{
		// 2. Configuración para todos los archivos JS y MJS
		files: ["**/*.js", "**/*.mjs"],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module", // <--- ESTA LÍNEA ARREGLA TU ERROR
			globals: {
				...globals.browser,      // Reconoce 'document', 'window', etc.
				...globals.webextensions // Reconoce 'chrome' y 'browser'
			}
		},
		rules: {
			// Reglas de calidad (puedes ajustar a tu gusto)
			"no-unused-vars": "warn", // Avisa si creas variables y no las usas
			"no-undef": "off",        // Apagado porque usamos variables globales inyectadas (shaka, yomvi)
			"semi": ["error", "always"], // Obliga a usar punto y coma
			"quotes": ["warn", "double"] // Prefiere comillas dobles
		}
	}
];
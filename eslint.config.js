import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["**/*.config.js", "**/*.config.ts", "dist/**"]
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { 
      globals: { 
        ...globals.browser, 
        ...globals.node 
      } 
    },
  },
  ...tseslint.configs.recommended,
];

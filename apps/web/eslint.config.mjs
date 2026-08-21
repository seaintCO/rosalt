import nextPlugin from "@next/eslint-plugin-next";
import hooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
export default [{ignores:[".next/**","node_modules/**"]},...tseslint.configs.recommended,{ files:["**/*.{ts,tsx}"], plugins:{"@next/next":nextPlugin,"react-hooks":hooks}, rules:{...nextPlugin.configs.recommended.rules,...hooks.configs.recommended.rules,"@next/next/no-img-element":"off","@typescript-eslint/no-explicit-any":"off"} }];

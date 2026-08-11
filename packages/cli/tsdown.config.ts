import { defineConfig } from "tsdown";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    platform: "node",
    format: "esm",
    shims: true,

    // Use .js instead of .mjs
    fixedExtension: false,
});

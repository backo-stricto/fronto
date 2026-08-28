// packages/core/tsdown.config.ts

import { defineConfig } from "tsdown";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    platform: "node",
    format: "esm",

    // Produce index.js / index.d.ts rather than index.mjs / index.d.mts
    fixedExtension: false,

    dts: true,
});

import { defineConfig } from "vite";

export default defineConfig({
    test: {
        globals: true,
        root: __dirname,
        environment: "happy-dom",
        passWithNoTests: true
    },
    build: {
        lib: {
            entry: "./src/index.ts",
            formats: ["es"]
        },
        rollupOptions: {
            external: ["@snowballengine/utils"]
        }
    }
});

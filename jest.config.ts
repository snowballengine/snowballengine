import type { InitialOptionsTsJest } from "ts-jest";

const config: InitialOptionsTsJest = {
    extensionsToTreatAsEsm: [".ts", ".mts"],
    testMatch: ["**/*.spec.ts"],
    globals: {
        "ts-jest": {
            tsconfig: {
                esModuleInterop: true
            }
        }
    }
};

export default config;

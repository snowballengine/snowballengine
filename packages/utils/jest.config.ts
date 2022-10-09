import { defaultsESM } from "ts-jest/presets";

export default {
    ...defaultsESM,
    preset: "ts-jest",
    testMatch: ["**/*.spec.ts"]
};

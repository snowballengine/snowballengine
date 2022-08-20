module.exports = {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.base.json", "./packages/*/tsconfig.json"]
    },
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    root: true
};

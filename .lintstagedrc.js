module.exports = {
    // TODO: typecheck only changed files
    "*.ts": () => "yarn typecheck",
    "packages/*": "yarn lint",
    "examples/*": "yarn lint",
    "*": "yarn format"
};

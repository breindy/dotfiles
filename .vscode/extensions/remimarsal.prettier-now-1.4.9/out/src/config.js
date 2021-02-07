"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
let config = vscode_1.workspace.getConfiguration('prettier');
let userConfig = extractUserVSConfig();
let activeLanguages = getActiveLanguages();
function getExtensionConfig() {
    vscode_1.workspace.onDidChangeConfiguration(() => {
        config = vscode_1.workspace.getConfiguration('prettier');
        userConfig = extractUserVSConfig();
        activeLanguages = getActiveLanguages();
    });
    return config;
}
exports.getExtensionConfig = getExtensionConfig;
function getActiveLanguages() {
    return [
        ...config.javascriptEnable,
        ...config.typescriptEnable,
        ...config.cssEnable,
        ...config.jsonEnable,
        ...config.graphqlEnable
    ];
}
exports.getActiveLanguages = getActiveLanguages;
function getPrettierOptions({ fileName, languageId }) {
    const parser = selectParser(languageId);
    if (!parser) {
        return false;
    }
    return Object.assign({ parser, filepath: fileName }, getUserVSConfig());
}
exports.getPrettierOptions = getPrettierOptions;
function selectParser(languageId) {
    switch (true) {
        case config.javascriptEnable.includes(languageId):
            return 'babylon';
        case config.typescriptEnable.includes(languageId):
            return 'typescript';
        case config.cssEnable.includes(languageId):
            return 'postcss';
        case config.jsonEnable.includes(languageId):
            return 'json';
        case config.graphqlEnable.includes(languageId):
            return 'graphql';
    }
}
exports.selectParser = selectParser;
function isESLintCompatibleParser(parser) {
    return parser === 'babylon' || parser === 'typescript';
}
exports.isESLintCompatibleParser = isESLintCompatibleParser;
function extractUserVSConfig() {
    return Object.keys(config).reduce((res, key) => {
        const item = config[key];
        if (typeof item === 'boolean' ||
            typeof item === 'string' ||
            typeof item === 'number') {
            res[key] = item;
        }
        return res;
    }, {});
}
exports.extractUserVSConfig = extractUserVSConfig;
function getUserVSConfig() {
    return userConfig;
}
function isLanguageActive(languageId) {
    return activeLanguages.indexOf(languageId) > -1;
}
exports.isLanguageActive = isLanguageActive;
//# sourceMappingURL=config.js.map
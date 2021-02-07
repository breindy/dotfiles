"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const exec_1 = require("./exec");
const prettier = require('../ext');
function format(text, document) {
    const prettierOptions = config_1.getPrettierOptions(document);
    if (!prettierOptions) {
        return text;
    }
    const formatter = getFormatter(text, document.fileName, prettierOptions);
    return exec_1.exec(formatter, text, document);
}
exports.format = format;
function getFormatter(text, fileName, prettierOptions) {
    const config = config_1.getExtensionConfig();
    if (config.eslintIntegration &&
        config_1.isESLintCompatibleParser(prettierOptions.parser)) {
        const prettierEslint = require('prettier-eslint');
        return prettierEslint.bind(null, {
            text,
            filePath: fileName,
            prettierOptions: prettierOptions
        });
    }
    return prettier.format.bind(null, text, prettierOptions);
}
//# sourceMappingURL=format.js.map
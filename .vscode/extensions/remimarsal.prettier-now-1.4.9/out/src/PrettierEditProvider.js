"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const format_1 = require("./format");
const utils_1 = require("./utils");
class PrettierEditProvider {
    provideDocumentFormattingEdits(document, options, token) {
        return [
            vscode_1.TextEdit.replace(utils_1.fullDocumentRange(document), format_1.format(document.getText(), document))
        ];
    }
}
exports.default = PrettierEditProvider;
//# sourceMappingURL=PrettierEditProvider.js.map
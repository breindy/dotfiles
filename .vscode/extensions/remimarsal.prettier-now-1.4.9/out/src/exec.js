"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const config_1 = require("./config");
const status_1 = require("./status");
const output_1 = require("./output");
function exec(cb, originalText, document) {
    try {
        const ret = cb();
        status_1.statusSuccess();
        output_1.hideChannel();
        return ret;
    }
    catch (e) {
        handleError(e, document);
        return originalText;
    }
}
exports.exec = exec;
function handleError(err, document) {
    const config = config_1.getExtensionConfig();
    status_1.statusFailed();
    output_1.addToOutput(err.message, document.fileName);
    if (config.autoScroll && err.loc) {
        const errorPosition = new vscode_1.Position(err.loc.start.line - 1, err.loc.start.column);
        const rangeError = new vscode_1.Range(errorPosition, errorPosition);
        vscode_1.window.showTextDocument(document).then((editor) => {
            editor.selection = new vscode_1.Selection(rangeError.start, rangeError.end);
            editor.revealRange(rangeError);
        });
    }
}
//# sourceMappingURL=exec.js.map
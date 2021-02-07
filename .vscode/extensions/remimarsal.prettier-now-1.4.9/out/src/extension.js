"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const PrettierEditProvider_1 = require("./PrettierEditProvider");
const output_1 = require("./output");
const status_1 = require("./status");
function activate(context) {
    const editProvider = new PrettierEditProvider_1.default();
    return vscode_1.languages.getLanguages().then((vsLanguages) => {
        context.subscriptions.push(vscode_1.commands.registerCommand(output_1.channelCommand, output_1.showChannel), vscode_1.languages.registerDocumentFormattingEditProvider(vsLanguages, editProvider));
        status_1.setupStatusHandler();
        output_1.setupOutputHandler();
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
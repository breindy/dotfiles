"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const output_1 = require("./output");
const config_1 = require("./config");
const statusKey = 'Prettier:';
let statusBarItem;
let currentDocument;
function statusInitial() {
    statusBarItem.show();
    updateStatus('...');
}
exports.statusInitial = statusInitial;
function statusSuccess() {
    updateStatus('$(check)');
}
exports.statusSuccess = statusSuccess;
function statusFailed() {
    updateStatus('$(issue-opened)');
}
exports.statusFailed = statusFailed;
function clearStatus() {
    statusBarItem.text = ``;
}
exports.clearStatus = clearStatus;
function updateStatus(message) {
    statusBarItem.text = `${statusKey} ${message}`;
}
function toggleStatusBar(document) {
    if (document.languageId === `Log`) {
        return;
    }
    if (!currentDocument || document !== currentDocument) {
        currentDocument = document;
        config_1.isLanguageActive(document.languageId) ? statusInitial() : clearStatus();
    }
}
function setupStatusHandler() {
    let config = config_1.getExtensionConfig();
    statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 42);
    statusBarItem.command = output_1.channelCommand;
    vscode_1.window.activeTextEditor &&
        toggleStatusBar(vscode_1.window.activeTextEditor.document);
    vscode_1.window.onDidChangeActiveTextEditor((e) => toggleStatusBar(e.document));
    vscode_1.workspace.onDidChangeConfiguration(() => {
        config = config_1.getExtensionConfig();
        !config.statusBar && clearStatus();
    });
    !config.statusBar && clearStatus();
}
exports.setupStatusHandler = setupStatusHandler;
//# sourceMappingURL=status.js.map
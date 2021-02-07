'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const PreviewManager_1 = require("./PreviewManager");
const vscodeUtilities_1 = require("./vscodeUtilities");
let previewManager = null;
function activate(context) {
    previewManager = new PreviewManager_1.default(context);
    // Register the commands that are provided to the user
    const arepl = vscode.commands.registerCommand("extension.currentAREPLSession", () => {
        previewManager.startArepl();
    });
    const newAreplSession = vscode.commands.registerCommand("extension.newAREPLSession", () => {
        vscodeUtilities_1.default.newUnsavedPythonDoc(vscodeUtilities_1.default.getHighlightedText())
            .then(() => { previewManager.startArepl(); });
    });
    const closeArepl = vscode.commands.registerCommand("extension.closeAREPL", () => {
        previewManager.dispose();
    });
    // exact same as above, just defining command so users are aware of the feature
    const areplOnHighlightedCode = vscode.commands.registerCommand("extension.newAREPLSessionOnHighlightedCode", () => {
        vscodeUtilities_1.default.newUnsavedPythonDoc(vscodeUtilities_1.default.getHighlightedText())
            .then(() => { previewManager.startArepl(); });
    });
    const executeAREPL = vscode.commands.registerCommand("extension.executeAREPL", () => {
        previewManager.runArepl();
    });
    const executeAREPLBlock = vscode.commands.registerCommand("extension.executeAREPLBlock", () => {
        previewManager.runAreplBlock();
    });
    const printDir = vscode.commands.registerCommand("extension.printDir", () => {
        previewManager.printDir();
    });
    // push to subscriptions list so that they are disposed automatically
    context.subscriptions.push(...[
        arepl,
        newAreplSession,
        closeArepl,
        areplOnHighlightedCode,
        executeAREPL,
        executeAREPLBlock,
        printDir
    ]);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map
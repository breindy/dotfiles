"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const vscode_1 = require("vscode");
/**
 * simple alias for workspace.getConfiguration("AREPL")
 */
function settings() {
    return vscode_1.workspace.getConfiguration("AREPL");
}
exports.settings = settings;
//# sourceMappingURL=settings.js.map
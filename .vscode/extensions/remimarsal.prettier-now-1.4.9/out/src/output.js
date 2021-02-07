"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const config_1 = require("./config");
exports.channelCommand = `prettier-now.show-output`;
let channel;
function clearChannel() {
    channel.clear();
}
exports.clearChannel = clearChannel;
function showChannel() {
    channel.show();
}
exports.showChannel = showChannel;
function hideChannel() {
    channel.hide();
}
exports.hideChannel = hideChannel;
function addToOutput(message, fileName) {
    const config = config_1.getExtensionConfig();
    const metas = `[${new Date().toLocaleTimeString()}] ${fileName}:\n`;
    channel.appendLine(metas);
    channel.appendLine(`${message}`);
    channel.appendLine('-'.repeat(metas.length));
    config.openOutput && showChannel();
}
exports.addToOutput = addToOutput;
function setupOutputHandler() {
    channel = vscode_1.window.createOutputChannel('Prettier');
}
exports.setupOutputHandler = setupOutputHandler;
//# sourceMappingURL=output.js.map
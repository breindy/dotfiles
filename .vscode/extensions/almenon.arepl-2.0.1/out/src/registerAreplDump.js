"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * registers arepl dump python file w/ python so it can be imported
 * @param pythonPath
 */
function registerAreplDump(pythonPath, extensionDir) {
    const sitePackagePath = getsitePackagePath(pythonPath);
    // i don't know why the heck site-packages folder would not exist
    // but it never hurts to be a little paranoid
    if (!fs_1.existsSync(sitePackagePath))
        mkDirByPathSync(sitePackagePath);
    fs_1.writeFileSync(path_1.join(sitePackagePath, "areplDump.pth"), path_1.join(extensionDir, "node_modules", "arepl-backend", "python"));
}
exports.registerAreplDump = registerAreplDump;
/**
 * unregisters arepl dump python file from python
 */
function unregisterAreplDump(pythonPath) {
    const sitePackagePath = getsitePackagePath(pythonPath);
    fs_1.unlinkSync(path_1.join(sitePackagePath, "areplDump.pth"));
}
exports.unregisterAreplDump = unregisterAreplDump;
function getsitePackagePath(pythonPath) {
    // for some godforsaken reason it returns the path with a space at the end
    // hence the trim
    // pythonPath needs to be wrapped in quotes because path might have spaces
    return child_process_1.execSync(`"${pythonPath}" -m site --user-site`).toString().trim();
}
/**
 * node's inbuilt mkdirSync can't create multiple folders (wtf!).
 * So i got this func from stackoverflow: https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync
 */
function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
    const initDir = path_1.isAbsolute(targetDir) ? path_1.sep : "";
    const baseDir = isRelativeToScript ? __dirname : ".";
    targetDir.split(path_1.sep).reduce((parentDir, childDir) => {
        const curDir = path_1.resolve(baseDir, parentDir, childDir);
        if (curDir == '/')
            return '/'; // to avoid EISDIR error on mac
        try {
            fs_1.mkdirSync(curDir);
        }
        catch (err) {
            if (err.code === 'EEXIST') {
                return curDir;
            }
            const accOrPermErr = err.code === 'EACCES' || err.code === 'EPERM';
            if (!accOrPermErr || accOrPermErr && targetDir === curDir) {
                throw err;
            }
        }
        return curDir;
    }, initDir);
}
//# sourceMappingURL=registerAreplDump.js.map
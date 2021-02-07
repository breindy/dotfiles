"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const throttle_1 = require("./throttle");
const utilities_1 = require("./utilities");
const settings_1 = require("./settings");
/**
 * shows AREPL output (variables, errors, timing, and stdout/stderr)
 * https://code.visualstudio.com/docs/extensions/webview
 */
class PythonPanelPreview {
    constructor(context, htmlUpdateFrequency = 50) {
        this.context = context;
        this.lastTime = 999999999;
        this.landingPage = `
    <br>
    <p style="font-size:14px">Start typing or make a change and your code will be evaluated.</p>
    
    <p style="font-size:14px">⚠ <b style="color:red">WARNING:</b> code is evaluated WHILE YOU TYPE - don't try deleting files/folders! ⚠</p>
    <p>evaluation while you type can be turned off or adjusted in the settings</p>
    <br>
    <h3>AREPL v2.0.1 🐛🐛 - Kanuma</h3>
    <ul>
    <li>🐛 Fixed error with AREPL.skipLandingPage setting</li>
    <li>🐛 Fixed error when a exception was raised while using dump</li>
    <li>Help me make arepl better by filling out this short survey: <a href="https://forms.gle/m7xirfRnSRoPAe9e9">https://forms.gle/m7xirfRnSRoPAe9e9</a></li>
    </ul>
    <br>
    
    <h3>Examples</h3>
    
<h4>Simple List</h4>
<code style="white-space:pre-wrap">
x = [1,2,3]
y = [num*2 for num in x]
print(y)
</code>

<h4>Dumping</h4>
<code style="white-space:pre-wrap">
from arepl_dump import dump 

def milesToKilometers(miles):
    kilometers = miles*1.60934
    dump() # dumps all the vars in your function

    # or dump when function is called for a second time
    dump(None,1) 

milesToKilometers(2*2)
milesToKilometers(3*3)

for char in ['a','b','c']:
    dump(char,2) # dump a var at a specific iteration

a=1
dump(a) # dump specific vars at any point in your program
a=2
</code>

<h4>Turtle</h4>
<code style="white-space:pre-wrap">
import turtle

# window in right hand side of screen
turtle.setup(500,500,-1,0)

# you can comment this out to keep state inbetween runs
turtle.reset()

turtle.forward(100)
turtle.left(90)
</code>

<h4>Web call</h4>
<code style="white-space:pre-wrap">
import requests
import datetime as dt

r = requests.get("https://api.github.com")

#$save
# #$save saves state so request is not re-executed when modifying below

now = dt.datetime.now()
if r.status_code == 200:
    print("API up at " + str(now))

</code>`;
        this.footer = `<br><br>
        <div id="footer">
        <p style="margin:0px;">
            report an <a href="https://github.com/almenon/arepl-vscode/issues">issue</a>  |
            ⭐ <a href="https://marketplace.visualstudio.com/items?itemName=almenon.arepl#review-details">rate me</a> ⭐ |
            talk on <a href="https://gitter.im/arepl/lobby">gitter</a> |
                <a href="https://twitter.com/intent/tweet?button_hashtag=arepl" id="twitterButton">
                    <i id="twitterIcon"></i>Tweet #arepl</a>
        </p>
        </div>`;
        this.errorContainer = "";
        this.jsonRendererCode = `<script></script>`;
        this.emptyPrint = `<br><h3>Print Output:</h3><div id="print"></div>`;
        this.printContainer = this.emptyPrint;
        this.timeContainer = "";
        this.customCSS = "";
        this._onDidChange = new vscode.EventEmitter();
        if (htmlUpdateFrequency != 0) {
            // refreshing html too much can freeze vscode... lets avoid that
            const l = new throttle_1.Limit();
            this.throttledUpdate = l.throttledUpdate(this.updateContent, htmlUpdateFrequency);
        }
        else
            this.throttledUpdate = this.updateContent;
    }
    start(linkedFileName) {
        this.panel = vscode.window.createWebviewPanel("arepl", "AREPL - " + linkedFileName, vscode.ViewColumn.Two, {
            enableScripts: true
        });
        this.css = `<link rel="stylesheet" type="text/css" href="${this.getMediaPath("pythonPanelPreview.css", this.panel.webview)}">`;
        this.jsonRendererScript = `<script src="${this.getMediaPath("jsonRenderer.js", this.panel.webview)}"></script>`;
        this.panel.webview.html = this.landingPage;
        return this.panel;
    }
    updateVars(vars) {
        let userVarsCode = `userVars = ${JSON.stringify(vars)};`;
        // escape end script tag or else the content will escape its container and WREAK HAVOC
        userVarsCode = userVarsCode.replace(/<\/script>/g, "<\\/script>");
        this.jsonRendererCode = `<script>
            window.onload = function(){
                ${userVarsCode}
                let jsonRenderer = renderjson.set_icons('+', '-') // default icons look a bit wierd, overriding
                    .set_show_to_level(${settings_1.settings().get("show_to_level")}) 
                    .set_max_string_length(${settings_1.settings().get("max_string_length")});
                document.getElementById("results").appendChild(jsonRenderer(userVars));
            }
            </script>`;
    }
    updateTime(time) {
        let color;
        time = Math.floor(time); // we dont care about anything smaller than ms
        if (time > this.lastTime)
            color = "red";
        else
            color = "green";
        this.lastTime = time;
        this.timeContainer = `<p style="position:fixed;left:90%;top:90%;color:${color};">${time} ms</p>`;
    }
    /**
     * @param refresh if true updates page immediately.  otherwise error will show up whenever updateContent is called
     */
    updateError(err, refresh = false) {
        // escape the <module>
        err = utilities_1.default.escapeHtml(err);
        err = this.makeErrorGoogleable(err);
        this.errorContainer = `<div id="error">${err}</div>`;
        if (refresh)
            this.throttledUpdate();
    }
    injectCustomCSS(css, refresh = false) {
        this.customCSS = css;
        if (refresh)
            this.throttledUpdate();
    }
    handlePrint(printResults) {
        // escape any accidental html
        printResults = utilities_1.default.escapeHtml(printResults);
        this.printContainer = `<br><h3>Print Output:</h3><div class="print">${printResults}</div>`;
        this.throttledUpdate();
    }
    clearPrint() {
        this.printContainer = this.emptyPrint;
    }
    displayProcessError(err) {
        let errMsg = `Error in the AREPL extension!\n${err}`;
        if (err.includes("ENOENT") || err.includes("9009")) { // NO SUCH FILE OR DIRECTORY
            // user probably just doesn't have python installed
            errMsg = errMsg + `\n\nAre you sure you have installed python 3 and it is in your PATH?
            You can download python here: https://www.python.org/downloads/`;
        }
        this.updateError(errMsg, true);
    }
    makeErrorGoogleable(err) {
        if (err && err.trim().length > 0) {
            let errLines = err.split("\n");
            // exception usually on last line so start from bottom
            for (let i = errLines.length - 1; i >= 0; i--) {
                // most exceptions follow format ERROR: explanation
                // ex: json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
                // so we can identify them by a single word at start followed by colon
                const errRegex = /(^[\w\.]+): /;
                if (errLines[i].match(errRegex)) {
                    const googleLink = "https://www.google.com/search?q=python ";
                    errLines[i] = errLines[i].link(googleLink + errLines[i]);
                }
            }
            return errLines.join("\n");
        }
        else
            return err;
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    getMediaPath(mediaFile, webview) {
        const onDiskPath = vscode.Uri.file(path.join(this.context.extensionPath, "media", mediaFile));
        return webview.asWebviewUri(onDiskPath);
    }
    updateContent() {
        const printPlacement = settings_1.settings().get("printResultPlacement");
        const showFooter = settings_1.settings().get("showFooter");
        const variables = '<h3>Variables:</h3><div id="results"></div>';
        // todo: handle different themes.  check body class: https://code.visualstudio.com/updates/June_2016
        this.html = `<!doctype html>
        <html lang="en">
        <head>
            <title>AREPL</title>
            ${this.css}
            <style>${this.customCSS}</style>
            ${this.jsonRendererScript}
            ${this.jsonRendererCode}
        </head>
        <body>
            ${this.errorContainer}
            ${printPlacement == "bottom" ?
            variables + this.printContainer :
            this.printContainer + variables}
            ${this.timeContainer}
            ${showFooter ? this.footer : ""}
            <div id="${Math.random()}" style="display:none"></div>
        </body>
        </html>`;
        // the weird div with a random id above is necessary
        // if not there weird issues appear
        try {
            this.panel.webview.html = this.html;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes("disposed")) {
                // swallow - user probably just got rid of webview inbetween throttled update call
                console.warn(error);
            }
            else
                throw error;
        }
        this._onDidChange.fire(vscode.Uri.parse(PythonPanelPreview.PREVIEW_URI));
    }
}
exports.default = PythonPanelPreview;
PythonPanelPreview.scheme = "pythonPanelPreview";
PythonPanelPreview.PREVIEW_URI = PythonPanelPreview.scheme + "://authority/preview";
//# sourceMappingURL=pythonPanelPreview.js.map
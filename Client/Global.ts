var app: App;
var list = <HTMLUListElement>document.getElementById("list");
var settings: Dynamic = new CustomEventTarget();
var settingsChangeEvent = new Event("change");

function currentTimeFormat(includeMilliseconds: boolean = true) {
    let now = new Date();
    let result = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

    if (includeMilliseconds)
        result += "." + now.getMilliseconds();

    return result;
}

function log(msg: string) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(currentTimeFormat() + ": " + msg));
    list.appendChild(li);

    if (list.children.length > 10 && list.firstChild)
        list.removeChild(list.firstChild);
}

var getSettingValues = function (parent: Element, settings: Dynamic) {
    const elements = parent.getElementsByClassName("setting");

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        const name = element.getAttribute("name");

        if (!name) continue;

        if (element instanceof HTMLInputElement) {
            if (element.type === "checkbox")
                settings[name] = element.checked;
            else if (element.type === "radio") {
                if (element.checked)
                    settings[name] = element.value;
            }
            else if (element.type === "number" || element.type === "range")
                settings[name] = element.valueAsNumber;
            else {
                if (element.hasAttribute("array"))
                    settings[name] = element.value.split(' ');
                else
                    settings[name] = element.value;
            }
        } else
            settings[name] = element.innerHTML;
    }
}

var loadSettings = function () {
    const elements = document.getElementsByClassName("settings");

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        const name = element.getAttribute("name");

        if (!name) continue;

        const group: Dynamic = settings[name] || {};
        settings[name] = group;
        getSettingValues(element, group);
    }

    settings.dispatchEvent(settingsChangeEvent);
}

function handleSettingsChanged() {
    let log = <HTMLElement>document.getElementById("temp");
    log.innerHTML = JSON.stringify(settings);
}

var startApp = function () {
    if (app) {
        app.stop();
    }

    settings = new CustomEventTarget();
    settings.addEventListener('change', handleSettingsChanged);

    loadSettings();
    let list = <HTMLUListElement>document.getElementById("list");

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    canvas.width = Math.max(window.innerWidth - 20, 300);
    canvas.height = 480;
    app = new App(canvas, settings);
    app.setup();
}

var attachSettingHandlers = function () {
    const elements = document.getElementsByClassName("setting");

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        if (element instanceof HTMLInputElement) {
            if (element.hasAttribute("restart"))
                element.addEventListener("change", () => startApp());
            else
                element.addEventListener("change", () => loadSettings());
        }
    }
}

window.onload = e => {
    attachSettingHandlers();
    startApp();
}
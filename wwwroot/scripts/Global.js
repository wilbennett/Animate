"use strict";
var list = document.getElementById("list");
var settings = new CustomEventTarget();
var settingsChangeEvent = new Event("change");
function currentTimeFormat(includeMilliseconds) {
    if (includeMilliseconds === void 0) { includeMilliseconds = true; }
    var now = new Date();
    var result = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    if (includeMilliseconds)
        result += "." + now.getMilliseconds();
    return result;
}
function log(msg) {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(currentTimeFormat() + ": " + msg));
    list.appendChild(li);
    if (list.children.length > 10 && list.firstChild)
        list.removeChild(list.firstChild);
}
var getSettingValues = function (parent, settings) {
    var elements = parent.getElementsByClassName("setting");
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var name_1 = element.getAttribute("name");
        if (!name_1)
            continue;
        if (element instanceof HTMLInputElement) {
            if (element.type === "checkbox")
                settings[name_1] = element.checked;
            else if (element.type === "radio") {
                if (element.checked)
                    settings[name_1] = element.value;
            }
            else if (element.type === "number" || element.type === "range")
                settings[name_1] = element.valueAsNumber;
            else {
                if (element.hasAttribute("array"))
                    settings[name_1] = element.value.split(' ');
                else
                    settings[name_1] = element.value;
            }
        }
        else
            settings[name_1] = element.innerHTML;
    }
};
var loadSettings = function () {
    var elements = document.getElementsByClassName("settings");
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var name_2 = element.getAttribute("name");
        if (!name_2)
            continue;
        var group = settings[name_2] || {};
        settings[name_2] = group;
        getSettingValues(element, group);
    }
    settings.dispatchEvent(settingsChangeEvent);
};
function handleSettingsChanged() {
    var log = document.getElementById("temp");
    log.innerHTML = JSON.stringify(settings);
}
var attachSettingHandlers = function () {
    var elements = document.getElementsByClassName("setting");
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element instanceof HTMLInputElement) {
            if (element.hasAttribute("restart"))
                element.addEventListener("change", function () { return startApp(); });
            else
                element.addEventListener("change", function () { return loadSettings(); });
        }
    }
};
//# sourceMappingURL=Global.js.map
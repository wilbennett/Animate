"use strict";
Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    if (index >= 0)
        this.splice(index, 1);
    return this;
};
//# sourceMappingURL=ArrayExtensions.js.map
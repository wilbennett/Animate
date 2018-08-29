"use strict";
var MouseTracker = /** @class */ (function () {
    function MouseTracker(_element) {
        var _this = this;
        this.element = _element;
        this.element.addEventListener("mousemove", function (ev) {
            _this.x = ev.pageX - _element.offsetLeft;
            _this.y = ev.pageY - _element.offsetTop;
        });
    }
    return MouseTracker;
}());
//# sourceMappingURL=MouseTracker.js.map
"use strict";
// Class that allows working with custom events of objects not attached to the DOM.
var CustomEventTarget = /** @class */ (function () {
    function CustomEventTarget() {
        this.target = document.createTextNode("");
        this.addEventListener = this.target.addEventListener.bind(this.target);
        this.removeEventListener = this.target.removeEventListener.bind(this.target);
        this.dispatchEvent = this.target.dispatchEvent.bind(this.target);
    }
    return CustomEventTarget;
}());
;
//# sourceMappingURL=CustomEventTarget.js.map
"use strict";
var MathEx = /** @class */ (function () {
    function MathEx() {
    }
    MathEx.toRadians = function (degrees) { return degrees * MathEx.RADIANS_RATIO; };
    MathEx.toDegrees = function (radians) { return radians * MathEx.DEGREES_RATIO; };
    MathEx.random = function (min, max, array) {
        if (typeof min === "object") {
            array = min;
            min = 0;
            max = array.length;
        }
        if (typeof min === "undefined") {
            min = 0;
            max = 1;
        }
        if (!max) {
            max = min;
            min = 0;
        }
        var value = Math.random() * max + min;
        return array ? array[Math.floor(value)] : value;
    };
    MathEx.TWO_PI = 2 * Math.PI;
    MathEx.RADIANS_RATIO = Math.PI / 180;
    MathEx.DEGREES_RATIO = 180 / Math.PI;
    return MathEx;
}());
//# sourceMappingURL=MathEx.js.map
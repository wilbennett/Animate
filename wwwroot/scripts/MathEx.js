"use strict";
var MathEx = /** @class */ (function () {
    function MathEx() {
    }
    MathEx.toRadians = function (degrees) { return degrees * this.RADIANS_RATIO; };
    MathEx.toDegrees = function (radians) { return radians * this.DEGREES_RATIO; };
    MathEx.constrainRadians = function (radians) {
        if (radians < 0 || radians > this.TWO_PI)
            radians %= this.TWO_PI;
        return radians;
    };
    MathEx.clamp = function (value, min, max) {
        if (value < min)
            return min;
        if (value > max)
            return max;
        return value;
    };
    MathEx.sign = function (value) {
        return ((value > 0) - (value < 0)) || +value;
    };
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
    MathEx.calcGrowth = function (startValue, growthRate, time) {
        return startValue * Math.pow(1 + growthRate, time);
    };
    MathEx.calcDecay = function (startValue, decayRate, time) {
        return startValue * Math.pow(1 - decayRate, time);
    };
    MathEx.calcGrowthTime = function (startValue, decayRate, targetValue) {
        return Math.log(startValue / targetValue) / Math.log(1 + decayRate);
    };
    MathEx.calcDecayTime = function (startValue, decayRate, targetValue) {
        return Math.log(startValue / targetValue) / Math.log(1 - decayRate);
    };
    MathEx.TWO_PI = 2 * Math.PI;
    MathEx.RADIANS_RATIO = Math.PI / 180;
    MathEx.DEGREES_RATIO = 180 / Math.PI;
    return MathEx;
}());
//# sourceMappingURL=MathEx.js.map
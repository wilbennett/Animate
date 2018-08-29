﻿class MathEx {
    static readonly TWO_PI: number = 2 * Math.PI;
    static readonly RADIANS_RATIO = Math.PI / 180;
    static readonly DEGREES_RATIO = 180 / Math.PI;

    static toRadians(degrees: number) { return degrees * MathEx.RADIANS_RATIO; }
    static toDegrees(radians: number) { return radians * MathEx.DEGREES_RATIO; }

    static random(min: number, max: number): number;
    static random(max: number): number;
    static random(): number;
    static random(array: any[]): any;
    static random(min?: any, max?: any, array?: any) {
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

        let value = Math.random() * max + min;
        return array ? array[Math.floor(value)] : value;
    }
}

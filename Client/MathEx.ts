class MathEx {
    static readonly TWO_PI: number = 2 * Math.PI;
    static readonly RADIANS_RATIO = Math.PI / 180;
    static readonly DEGREES_RATIO = 180 / Math.PI;

    static toRadians(degrees: number) { return degrees * this.RADIANS_RATIO; }
    static toDegrees(radians: number) { return radians * this.DEGREES_RATIO; }

    static constrainRadians(radians: number) {
        if (radians < 0 || radians > this.TWO_PI)
            radians %= this.TWO_PI;

        return radians;
    }

    static clamp(value: number, min: number, max: number) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    static sign(value: number) {
        return (<any>(value > 0) - <any>(value < 0)) || +value;
    }

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

    static calcGrowth(startValue: number, growthRate: number, time: number) {
        return startValue * Math.pow(1 + growthRate, time);
    }

    static calcDecay(startValue: number, decayRate: number, time: number) {
        return startValue * Math.pow(1 - decayRate, time);
    }

    static calcGrowthTime(startValue: number, decayRate: number, targetValue: number) {
        return Math.log(startValue / targetValue) / Math.log(1 + decayRate);
    }

    static calcDecayTime(startValue: number, decayRate: number, targetValue: number) {
        return Math.log(startValue / targetValue) / Math.log(1 - decayRate);
    }
}

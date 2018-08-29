class Math2D {
    static dot(x1: number, y1: number, x2: number, y2: number) { return x1 * x2 + y1 * y2; }

    static magnitudeSquared(x: number, y: number) { return Math2D.dot(x, y, x, y); }
    static magnitude(x: number, y: number) { return Math.sqrt(Math2D.magnitudeSquared(x, y)); }

    static radians(x: number, y: number) {
        let result = Math.atan2(y, x);

        if (result < 0)
            result = MathEx.TWO_PI + result;

        return result;
    }

    static degrees(x: number, y: number) { return MathEx.toDegrees(Math2D.radians(x, y)); }
    static polar(x: number, y: number) { return new Polar(Math2D.magnitude(x, y), Math2D.radians(x, y)); }

    private static inflateBoundsCore(bounds: number[], dx: number, dy: number) {
        let newLeft = bounds[0] - dx;
        let newTop = bounds[1] - dy;
        let newWidth = bounds[2] + dx + dx;
        let newHeight = bounds[3] + dy + dy;

        if (newWidth < 0 && newHeight < 0) {
            bounds[2] = 0;
            bounds[3] = 0;
        }
        else if (newWidth < 0) {
            bounds[2] = 0;
            bounds[3] = newHeight;
        }
        else if (newHeight < 0) {
            bounds[2] = newWidth;
            bounds[3] = 0;
        }
        else {
            bounds[0] = newLeft;
            bounds[1] = newTop;
            bounds[2] = newWidth;
            bounds[3] = newHeight;
        }

        return bounds;
    }

    static inflateBounds(obj: IBoundsInfo, dx: number, dy: number): number[];
    static inflateBounds(bounds: number[], dx: number, dy: number): number[];
    static inflateBounds(x: number, y: number, w: number, h: number, dx: number, dy: number): number[];
    static inflateBounds(x: any, y: any, w: any, h?: any, dx?: any, dy?: any): any {
        if (Array.isArray(x)) {
            let bounds: number[] = x;
            dx = y;
            dy = w;
            return this.inflateBoundsCore(bounds, dx, dy);
        }

        if (typeof x == "object") {
            let obj: IBoundsInfo = x;
            dx = y;
            dy = w;
            return this.inflateBoundsCore([obj.x, obj.y, obj.width, obj.height], dx, dy);
        }

        return this.inflateBoundsCore([x, y, w, h], dx, dy);
    }

    private static isPointInBoundsCore(x: number, y: number, w: number, h: number, px: number, py: number) {
        return px >= x && py >= y && px < (x + w) && py < (y + h);
    }

    static isPointInBounds(obj: IBoundsInfo, px: number, py: number): boolean;
    static isPointInBounds(bounds: number[], px: number, py: number): boolean;
    static isPointInBounds(x: number, y: number, w: number, h: number, px: number, py: number): boolean;
    static isPointInBounds(x: any, y: any, w: any, h?: any, px?: any, py?: any): any {
        if (Array.isArray(x)) {
            let bounds: number[] = x;
            px = y;
            py = w;
            return this.isPointInBoundsCore(bounds[0], bounds[1], bounds[2], bounds[3], px, py);
        }

        if (typeof x == "object") {
            let obj: IBoundsInfo = x;
            px = y;
            py = w;
            return this.isPointInBoundsCore(obj.x, obj.y, obj.width, obj.height, px, py);
        }

        return this.isPointInBoundsCore(x, y, w, h, px, py);
    }
}

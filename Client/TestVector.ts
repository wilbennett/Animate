class LocInfo {
    _deltaX: number;
    _deltaY: number;

    constructor(public x: number, public y: number, private _left: number, private _top: number, private _right: number, private _bottom: number) {
        this._deltaX = 0;
        this._deltaY = -1;
    }

    public advance() {
        this.x += this._deltaX;
        this.y += this._deltaY;
        //this._ry = this._rCenterY - this._rNormalLength; 
        //this._ry = this._rTop;

        if (this.x < this._left) {
            this.x = this._left;
            this._deltaX = 0;
            this._deltaY = -1;
        }

        if (this.x > this._right) {
            this.x = this._right;
            this._deltaX = 0;
            this._deltaY = 1;
        }

        if (this.y < this._top) {
            this.y = this._top;
            this._deltaY = 0;
            this._deltaX = 1;
        }

        if (this.y > this._bottom) {
            this.y = this._bottom;
            this._deltaY = 0;
            this._deltaX = -1;
        }
    }
}

class TestVector {
    private readonly _ctx: CanvasRenderingContext2D;

    private _rCenter: Vector2D;
    private _rRadius: number;
    private _testRay: Ray2D;
    private _rPolar: Polar;

    private _lCenter: Vector2D;
    private _lRadius: number;
    private _testLine: Line2D;
    private _lPolar: Polar;

    private _rViewportUp: Viewport2D;
    private _rCenterVU: Vector2D;
    private _rRadiusVU: number;
    private _testRayVU: Ray2D;
    private _rPolarVU: Polar;

    private _rViewportDown: Viewport2D;
    private _rCenterVD: Vector2D;
    private _rRadiusVD: number;
    private _testRayVD: Ray2D;
    private _rPolarVD: Polar;

    private _lViewportUp: Viewport2D;
    private _lCenterVU: Vector2D;
    private _lRadiusVU: number;
    private _testLineVU: Line2D;
    private _lPolarVU: Polar;

    private _lViewportDown: Viewport2D;
    private _lCenterVD: Vector2D;
    private _lRadiusVD: number;
    private _testLineVD: Line2D;
    private _lPolarVD: Polar;

    constructor(private _canvas: HTMLCanvasElement) {
        this._ctx = <CanvasRenderingContext2D>this._canvas.getContext("2d");

        let ss = 150;
        let sx = 10;
        let sy = 10;
        let sw = ss;
        let sh = ss;
        let sd = 10;
        let sy2 = sy + sh + sd;

        let x = sx;
        let y = sy;

        let diameter = ss;
        let radius = diameter / 2;
        this._rCenter = new Vector2D(x + radius, y + radius);
        this._rRadius = radius;

        this._testRay = new Ray2D(new Vector2D(this._rCenter.x - radius, this._rCenter.y), new Vector2D(1, 0), this._rRadius * 2);
        this._rPolar = new Polar(this._rRadius, 0);

        x = sx;
        y = sy2;
        this._lCenter = new Vector2D(x + radius, y + radius);
        this._lRadius = radius;

        this._testLine = new Line2D(new Vector2D(this._lCenter.x - radius, this._lCenter.y), new Vector2D(this._lCenter.x + radius, this._lCenter.y));
        this._lPolar = new Polar(this._lRadius, 0);

        sx = sx + sw + sd;
        x = sx;
        y = sy;
        this._rCenterVU = new Vector2D(0, 0);
        this._rRadiusVU = radius;

        this._rViewportUp = new Viewport2D(WorldOrientation.Up, -radius, -radius, diameter, diameter, x, y);
        this._testRayVU = new Ray2D(new Vector2D(-radius, 0), new Vector2D(1, 0), this._rRadiusVU * 2);
        this._rPolarVU = new Polar(this._rRadiusVU, 0);

        x = sx;
        y = sy2;
        this._rCenterVD = new Vector2D(0, 0);
        this._rRadiusVD = radius;

        this._rViewportDown = new Viewport2D(WorldOrientation.Down, -radius, -radius, diameter, diameter, x, y);
        this._testRayVD = new Ray2D(new Vector2D(-radius, 0), new Vector2D(1, 0), this._rRadiusVD * 2);
        this._rPolarVD = new Polar(this._rRadiusVD, 0);

        sx = sx + sw + sd;
        x = sx;
        y = sy;
        this._lCenterVU = new Vector2D(0, 0);
        this._lRadiusVU = radius;

        this._lViewportUp = new Viewport2D(WorldOrientation.Up, -radius, -radius, diameter, diameter, x, y);
        this._testLineVU = new Line2D(new Vector2D(-radius, 0), new Vector2D(radius, 0));
        this._lPolarVU = new Polar(this._lRadiusVU, 0);

        y = sy2;
        this._lCenterVD = new Vector2D(0, 0);
        this._lRadiusVD = radius;

        this._lViewportDown = new Viewport2D(WorldOrientation.Down, -radius, -radius, diameter, diameter, x, y);
        this._testLineVD = new Line2D(new Vector2D(-radius, 0), new Vector2D(radius, 0));
        this._lPolarVD = new Polar(this._lRadiusVD, 0);
    }

    circleOutline(center: Vector2D, radius: number, viewport?: Viewport2D) {
        const ctx = this._ctx;

        if (viewport) {
            center = viewport.toScreen(center);
        }

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = 1;
        //ctx.setLineDash([5, 0, 5]);
        ctx.arc(center.x, center.y, radius, 0, MathEx.TWO_PI);
        ctx.stroke();
        ctx.restore();
    }

    testRay(ray: Ray2D, center: Vector2D, radius: number, polar: Polar, viewport?: Viewport2D) {
        const ctx = this._ctx;

        this.circleOutline(center, radius, viewport);

        polar.add(MathEx.TWO_PI / 360);
        let pVector = polar.vector.clone().add(center);
        let lineIn: Line2D = new Line2D(pVector, center);
        let rayIn: Ray2D = new Ray2D(lineIn.origin, lineIn.direction, lineIn.length);

        let rayReflect = rayIn.reflectOff(ray);
        let rayNormal = new Ray2D(center, ray.normal, radius);

        ray.draw(ctx, 5, "blue", viewport);
        rayNormal.draw(ctx, 3, "red", viewport);
        rayIn.draw(ctx, 4, "black", viewport);
        rayReflect.draw(ctx, 4, "gray", viewport);
        //console.log(`Origin (${rayReflect.origin.x}, ${rayReflect.origin.y}) - Endpoint (${rayReflect.endPoint.x}, ${rayReflect.endPoint.y})`);
    }

    testLine(line: Line2D, center: Vector2D, radius: number, polar: Polar, viewport?: Viewport2D) {
        const ctx = this._ctx;

        this.circleOutline(center, radius, viewport);

        polar.add(MathEx.TWO_PI / 360);
        let pVector = polar.vector.clone().add(center);

        let lineIn: Line2D = new Line2D(pVector, center);
        let lineReflect: Line2D = line.reflect(lineIn);
        let lineNormal = Line2D.fromRay(new Ray2D(center, line.normal, radius));

        line.draw(ctx, 5, "blue", viewport);
        lineNormal.draw(ctx, 3, "red", viewport);
        lineReflect.draw(ctx, 4, "gray", viewport);
        lineIn.draw(ctx, 4, "black", viewport);
        //console.log(`Origin (${lineReflect.origin.x}, ${lineReflect.origin.y}) - Endpoint (${lineReflect.endPoint.x}, ${lineReflect.endPoint.y})`);
    }

    animLoop = () => {
        const ctx = this._ctx;
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this.testRay(this._testRay, this._rCenter, this._rRadius, this._rPolar);
        this.testLine(this._testLine, this._lCenter, this._lRadius, this._lPolar);

        this._rViewportUp.draw(ctx, 2, "white");
        this.testRay(this._testRayVU, this._rCenterVU, this._rRadiusVU, this._rPolarVU, this._rViewportUp);
        this._rViewportDown.draw(ctx, 2, "white");
        this.testRay(this._testRayVD, this._rCenterVD, this._rRadiusVD, this._rPolarVD, this._rViewportDown);

        this._lViewportUp.draw(ctx, 2, "white");
        this.testLine(this._testLineVU, this._lCenterVU, this._lRadiusVU, this._lPolarVU, this._lViewportUp);
        this._lViewportDown.draw(ctx, 2, "white");
        this.testLine(this._testLineVD, this._lCenterVD, this._lRadiusVD, this._lPolarVD, this._lViewportDown);

        requestAnimationFrame(this.animLoop);
    }

    start() {
        requestAnimationFrame(this.animLoop);
    }
}

var handleOnLoad = function () {
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    new TestVector(canvas).start();
}

window.addEventListener("load", handleOnLoad);

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
    private _rRayStart: Vector2D;
    private _rRayInStart: Vector2D;

    private _lCenter: Vector2D;
    private _lRadius: number;
    private _lLineStart: Vector2D;
    private _lLineInStart: Vector2D;

    private _rViewportUp: Viewport2D;
    private _rCenterVU: Vector2D;
    private _rRadiusVU: number;
    private _rRayStartVU: Vector2D;
    private _rRayInStartVU: Vector2D;

    private _rViewportDown: Viewport2D;
    private _rCenterVD: Vector2D;
    private _rRadiusVD: number;
    private _rRayStartVD: Vector2D;
    private _rRayInStartVD: Vector2D;

    private _lViewportUp: Viewport2D;
    private _lCenterVU: Vector2D;
    private _lRadiusVU: number;
    private _lLineStartVU: Vector2D;
    private _lLineInStartVU: Vector2D;

    private _lViewportDown: Viewport2D;
    private _lCenterVD: Vector2D;
    private _lRadiusVD: number;
    private _lLineStartVD: Vector2D;
    private _lLineInStartVD: Vector2D;

    private _rRayR: Ray2D;

    private _lLineR: Line2D;

    private _rViewportRUp: Viewport2D;
    private _rRayRVU: Ray2D;

    private _rViewportRDown: Viewport2D;
    private _rRayRVD: Ray2D;

    private _lViewportRUp: Viewport2D;
    private _lLineRVU: Line2D;

    private _lViewportRDown: Viewport2D;
    private _lLineRVD: Line2D;

    private _rRayRA: Ray2D;
    private _rCenterRA: Vector2D;
    private _rRadiusRA: number;

    private _lLineRA: Line2D;
    private _lCenterRA: Vector2D;
    private _lRadiusRA: number;

    private _rViewportRAUp: Viewport2D;
    private _rRayRAU: Ray2D;
    private _rCenterRAU: Vector2D;
    private _rRadiusRAU: number;

    private _rViewportRADown: Viewport2D;
    private _rRayRAD: Ray2D;
    private _rCenterRAD: Vector2D;
    private _rRadiusRAD: number;

    private _lViewportRAUp: Viewport2D;
    private _lLineRAU: Line2D;
    private _lCenterRAU: Vector2D;
    private _lRadiusRAU: number;

    private _lViewportRADown: Viewport2D;
    private _lLineRAD: Line2D;
    private _lCenterRAD: Vector2D;
    private _lRadiusRAD: number;

    constructor(private _canvas: HTMLCanvasElement) {
        this._ctx = <CanvasRenderingContext2D>this._canvas.getContext("2d");

        let ss = 100;
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

        this._rRayStart = new Vector2D(this._rCenter.x - radius, this._rCenter.y);
        this._rRayInStart = this._rRayStart;

        x = sx;
        y = sy2;
        this._lCenter = new Vector2D(x + radius, y + radius);
        this._lRadius = radius;

        this._lLineStart = new Vector2D(this._lCenter.x - radius, this._lCenter.y);
        this._lLineInStart = this._lLineStart;

        sx = sx + sw + sd;
        x = sx;
        y = sy;
        this._rCenterVU = new Vector2D(0, 0);
        this._rRadiusVU = radius;

        this._rViewportUp = new Viewport2D(WorldOrientation.Up, -radius, -radius, diameter, diameter, x, y);
        this._rRayStartVU = new Vector2D(-radius, 0);
        this._rRayInStartVU = this._rRayStartVU;

        x = sx;
        y = sy2;
        this._rCenterVD = new Vector2D(0, 0);
        this._rRadiusVD = radius;

        this._rViewportDown = new Viewport2D(WorldOrientation.Down, -radius, -radius, diameter, diameter, x, y);
        this._rRayStartVD = new Vector2D(-radius, 0);
        this._rRayInStartVD = this._rRayStartVD;

        sx = sx + sw + sd;
        x = sx;
        y = sy;
        this._lCenterVU = new Vector2D(0, 0);
        this._lRadiusVU = radius;

        this._lViewportUp = new Viewport2D(WorldOrientation.Up, -radius, -radius, diameter, diameter, x, y);
        this._lLineStartVU = new Vector2D(-radius, 0);
        this._lLineInStartVU = this._lLineStartVU;

        y = sy2;
        this._lCenterVD = new Vector2D(0, 0);
        this._lRadiusVD = radius;

        this._lViewportDown = new Viewport2D(WorldOrientation.Down, -radius, -radius, diameter, diameter, x, y);
        this._lLineStartVD = new Vector2D(-radius, 0);
        this._lLineInStartVD = this._lLineStartVD;

        sx = sx + sw + sd;
        x = sx;
        y = sy;

        let center = new Vector2D(x + radius, y + radius);
        this._rRayR = new Ray2D(center, new Vector2D(1, 0), radius);

        y = sy2;
        center = new Vector2D(x + radius, y + radius);
        this._lLineR = Line2D.fromRay(new Ray2D(center, new Vector2D(1, 0), radius));

        sx = sx + sw + sd;
        x = sx;
        y = sy;

        center = Vector2D.emptyVector;

        this._rViewportRUp = new Viewport2D(WorldOrientation.Up, -radius, -radius, diameter, diameter, x, y);
        this._rRayRVU = new Ray2D(center, new Vector2D(1, 0), radius);

        y = sy2;

        center = Vector2D.emptyVector;

        this._rViewportRDown = new Viewport2D(WorldOrientation.Down, -radius, -radius, diameter, diameter, x, y);
        this._rRayRVD = new Ray2D(center, new Vector2D(1, 0), radius);

        sx = sx + sw + sd;
        x = sx;
        y = sy;

        center = Vector2D.emptyVector;

        this._lViewportRUp = new Viewport2D(WorldOrientation.Up, -radius, -radius, diameter, diameter, x, y);
        this._lLineRVU = Line2D.fromRay(new Ray2D(center, new Vector2D(1, 0), radius));

        y = sy2;

        center = Vector2D.emptyVector;

        this._lViewportRDown = new Viewport2D(WorldOrientation.Down, -radius, -radius, diameter, diameter, x, y);
        this._lLineRVD = Line2D.fromRay(new Ray2D(center, new Vector2D(1, 0), radius));

        sx = 10;
        sy = sy2 + sh + sd;
        sy2 = sy + sh + sd;

        x = sx;
        y = sy;

        this._rCenterRA = new Vector2D(x + radius, y + radius);
        this._rRadiusRA = radius;
        let line = new Line2D(new Vector2D(x, this._rCenterRA.y), new Vector2D(this._rCenterRA.x, y + diameter));
        this._rRayRA = new Ray2D(line.origin, line.direction, line.length);

        y = sy2;

        this._lCenterRA = new Vector2D(x + radius, y + radius);
        this._lRadiusRA = radius;
        this._lLineRA = new Line2D(new Vector2D(x, this._lCenterRA.y), new Vector2D(this._rCenterRA.x, y + diameter));

        sx = sx + sw + sd;
        x = sx;
        y = sy;

        center = Vector2D.emptyVector;

        this._rViewportRAUp = new Viewport2D(WorldOrientation.Up, -radius, -radius, diameter, diameter, x, y);
        this._rCenterRAU = center;
        this._rRadiusRAU = radius;
        line = new Line2D(new Vector2D(-radius, center.y), new Vector2D(center.x, radius));
        this._rRayRAU = new Ray2D(line.origin, line.direction, line.length);

        y = sy2;

        this._rViewportRADown = new Viewport2D(WorldOrientation.Down, -radius, -radius, diameter, diameter, x, y);
        this._rCenterRAD = center;
        this._rRadiusRAD = radius;
        line = new Line2D(new Vector2D(-radius, center.y), new Vector2D(center.x, radius));
        this._rRayRAD = new Ray2D(line.origin, line.direction, line.length);

        sx = sx + sw + sd;
        x = sx;
        y = sy;

        this._lViewportRAUp = new Viewport2D(WorldOrientation.Up, -radius, -radius, diameter, diameter, x, y);
        this._lCenterRAU = center;
        this._lRadiusRAU = radius;
        this._lLineRAU = new Line2D(new Vector2D(-radius, center.y), new Vector2D(center.x, radius));

        y = sy2;

        this._lViewportRADown = new Viewport2D(WorldOrientation.Down, -radius, -radius, diameter, diameter, x, y);
        this._lCenterRAD = center;
        this._lRadiusRAD = radius;
        this._lLineRAD = new Line2D(new Vector2D(-radius, center.y), new Vector2D(center.x, radius));
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

    testRay(rayStart: Vector2D, rayInStart: Vector2D, center: Vector2D, radius: number, viewport?: Viewport2D) {
        const ctx = this._ctx;

        this.circleOutline(center, radius, viewport);

        let ray = new Ray2D(rayStart, rayStart.directionTo(center), radius * 2);
        let rayIn = new Ray2D(rayInStart, rayInStart.directionTo(center), radius);

        let rayReflect = rayIn.reflectOff(ray);
        let rayNormal = new Ray2D(center, ray.normal, radius);

        ray.draw(ctx, 5, "blue", viewport);
        rayNormal.draw(ctx, 3, "red", viewport);
        rayIn.draw(ctx, 4, "black", viewport);
        rayReflect.draw(ctx, 4, "gray", viewport);
        //console.log(`Origin (${rayReflect.origin.x}, ${rayReflect.origin.y}) - Endpoint (${rayReflect.endPoint.x}, ${rayReflect.endPoint.y})`);
    }

    testLine(lineStart: Vector2D, lineInStart: Vector2D, center: Vector2D, radius: number, viewport?: Viewport2D) {
        const ctx = this._ctx;

        this.circleOutline(center, radius, viewport);

        let line = Line2D.fromRay(new Ray2D(lineStart, lineStart.directionTo(center), radius * 2));
        let lineIn = new Line2D(lineInStart, center);

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

        let rotDegrees = 1;
        let inDegrees = rotDegrees * 1.2;

        this._rRayStart = this._rRayStart.rotateDegreesAbout(rotDegrees, this._rCenter);
        this._rRayInStart = this._rRayInStart.rotateDegreesAbout(inDegrees, this._rCenter);
        this.testRay(this._rRayStart, this._rRayInStart, this._rCenter, this._rRadius);

        this._lLineStart = this._lLineStart.rotateDegreesAbout(rotDegrees, this._lCenter);
        this._lLineInStart = this._lLineInStart.rotateDegreesAbout(inDegrees, this._lCenter);
        this.testLine(this._lLineStart, this._lLineInStart, this._lCenter, this._lRadius);

        this._rRayStartVU = this._rRayStartVU.rotateDegreesAbout(rotDegrees, this._rCenterVU);
        this._rRayInStartVU = this._rRayInStartVU.rotateDegreesAbout(inDegrees, this._rCenterVU);
        this._rViewportUp.draw(ctx, 2, "white");
        this.testRay(this._rRayStartVU, this._rRayInStartVU, this._rCenterVU, this._rRadiusVU, this._rViewportUp);

        this._rRayStartVD = this._rRayStartVD.rotateDegreesAbout(rotDegrees, this._rCenterVD);
        this._rRayInStartVD = this._rRayInStartVD.rotateDegreesAbout(inDegrees, this._rCenterVD);
        this._rViewportDown.draw(ctx, 2, "white");
        this.testRay(this._rRayStartVD, this._rRayInStartVD, this._rCenterVD, this._rRadiusVD, this._rViewportDown);

        this._lLineStartVU = this._lLineStartVU.rotateDegreesAbout(rotDegrees, this._lCenterVU);
        this._lLineInStartVU = this._lLineInStartVU.rotateDegreesAbout(inDegrees, this._lCenterVU);
        this._lViewportUp.draw(ctx, 2, "white");
        this.testLine(this._lLineStartVU, this._lLineInStartVU, this._lCenterVU, this._lRadiusVU, this._lViewportUp);

        this._lLineStartVD = this._lLineStartVD.rotateDegreesAbout(rotDegrees, this._lCenterVD);
        this._lLineInStartVD = this._lLineInStartVD.rotateDegreesAbout(inDegrees, this._lCenterVD);
        this._lViewportDown.draw(ctx, 2, "white");
        this.testLine(this._lLineStartVD, this._lLineInStartVD, this._lCenterVD, this._lRadiusVD, this._lViewportDown);

        this._rRayR = this._rRayR.rotateDegrees(rotDegrees);
        this.circleOutline(this._rRayR.origin, this._rRayR.length);
        this._rRayR.draw(ctx, 2, "blue");

        this._lLineR = this._lLineR.rotateDegrees(rotDegrees);
        this.circleOutline(this._lLineR.origin, this._lLineR.length);
        this._lLineR.draw(ctx, 2, "blue");

        this._rRayRVU = this._rRayRVU.rotateDegrees(rotDegrees);
        this.circleOutline(this._rRayRVU.origin, this._rRayRVU.length, this._rViewportRUp);
        this._rViewportRUp.draw(ctx, 2, "white");
        this._rRayRVU.draw(ctx, 2, "blue", this._rViewportRUp);

        this._rRayRVD = this._rRayRVD.rotateDegrees(rotDegrees);
        this.circleOutline(this._rRayRVD.origin, this._rRayRVD.length, this._rViewportRDown);
        this._rViewportRDown.draw(ctx, 2, "white");
        this._rRayRVD.draw(ctx, 2, "blue", this._rViewportRDown);

        this._lLineRVU = this._lLineRVU.rotateDegrees(rotDegrees);
        this.circleOutline(this._lLineRVU.origin, this._lLineRVU.length, this._lViewportRUp);
        this._lViewportRUp.draw(ctx, 2, "white");
        this._lLineRVU.draw(ctx, 2, "blue", this._lViewportRUp);

        this._lLineRVD = this._lLineRVD.rotateDegrees(rotDegrees);
        this.circleOutline(this._lLineRVD.origin, this._lLineRVD.length, this._lViewportRDown);
        this._lViewportRDown.draw(ctx, 2, "white");
        this._lLineRVD.draw(ctx, 2, "blue", this._lViewportRDown);

        this._rRayRA = this._rRayRA.rotateDegreesAbout(rotDegrees, this._rCenterRA);
        this.circleOutline(this._rCenterRA, this._rRadiusRA);
        this._rRayRA.draw(ctx, 2, "blue");

        this._lLineRA = this._lLineRA.rotateDegreesAbout(rotDegrees, this._lCenterRA);
        this.circleOutline(this._lCenterRA, this._lRadiusRA);
        this._lLineRA.draw(ctx, 2, "blue");

        this._rRayRAU = this._rRayRAU.rotateDegreesAbout(rotDegrees, this._rCenterRAU);
        this.circleOutline(this._rCenterRAU, this._rRadiusRAU, this._rViewportRAUp);
        this._rViewportRAUp.draw(ctx, 2, "white");
        this._rRayRAU.draw(ctx, 2, "blue", this._rViewportRAUp);

        this._rRayRAD = this._rRayRAD.rotateDegreesAbout(rotDegrees, this._rCenterRAU);
        this.circleOutline(this._rCenterRAD, this._rRadiusRAD, this._rViewportRADown);
        this._rViewportRADown.draw(ctx, 2, "white");
        this._rRayRAD.draw(ctx, 2, "blue", this._rViewportRADown);

        this._lLineRAU = this._lLineRAU.rotateDegreesAbout(rotDegrees, this._lCenterRAU);
        this.circleOutline(this._lCenterRAU, this._lRadiusRAU, this._lViewportRAUp);
        this._lViewportRAUp.draw(ctx, 2, "white");
        this._lLineRAU.draw(ctx, 2, "blue", this._lViewportRAUp);

        this._lLineRAD = this._lLineRAD.rotateDegreesAbout(rotDegrees, this._lCenterRAU);
        this.circleOutline(this._lCenterRAD, this._lRadiusRAD, this._lViewportRADown);
        this._lViewportRADown.draw(ctx, 2, "white");
        this._lLineRAD.draw(ctx, 2, "blue", this._lViewportRADown);

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

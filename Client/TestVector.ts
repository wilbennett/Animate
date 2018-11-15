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
    private _rRayR2: Ray2D;

    private _lLineR: Line2D;
    private _lLineR2: Line2D;

    private _rViewportRUp: Viewport2D;
    private _rRayRVU: Ray2D;
    private _rRayRVU2: Ray2D;

    private _rViewportRDown: Viewport2D;
    private _rRayRVD: Ray2D;
    private _rRayRVD2: Ray2D;

    private _lViewportRUp: Viewport2D;
    private _lLineRVU: Line2D;
    private _lLineRVU2: Line2D;

    private _lViewportRDown: Viewport2D;
    private _lLineRVD: Line2D;
    private _lLineRVD2: Line2D;

    private _rRayRA: Ray2D;
    private _rRayRA2: Ray2D;
    private _rCenterRA: Vector2D;
    private _rRadiusRA: number;

    private _lLineRA: Line2D;
    private _lLineRA2: Line2D;
    private _lCenterRA: Vector2D;
    private _lRadiusRA: number;

    private _rViewportRAUp: Viewport2D;
    private _rRayRAU: Ray2D;
    private _rRayRAU2: Ray2D;
    private _rCenterRAU: Vector2D;
    private _rRadiusRAU: number;

    private _rViewportRADown: Viewport2D;
    private _rRayRAD: Ray2D;
    private _rRayRAD2: Ray2D;
    private _rCenterRAD: Vector2D;
    private _rRadiusRAD: number;

    private _lViewportRAUp: Viewport2D;
    private _lLineRAU: Line2D;
    private _lLineRAU2: Line2D;
    private _lCenterRAU: Vector2D;
    private _lRadiusRAU: number;

    private _lViewportRADown: Viewport2D;
    private _lLineRAD: Line2D;
    private _lLineRAD2: Line2D;
    private _lCenterRAD: Vector2D;
    private _lRadiusRAD: number;

    constructor(private _canvas: HTMLCanvasElement) {
        this._ctx = <CanvasRenderingContext2D>this._canvas.getContext("2d");

        let box = new TestBox(10, 10, 100, 100, 10);

        let center0 = Vector2D.emptyVector;
        this._rCenter = box.center;
        this._rRadius = box.radius;

        this._rRayStart = new Vector2D(this._rCenter.x - box.radius, this._rCenter.y);
        this._rRayInStart = this._rRayStart;

        box.moveDown();
        this._lCenter = box.center;
        this._lRadius = box.radius;

        this._lLineStart = new Vector2D(this._lCenter.x - box.radius, this._lCenter.y);
        this._lLineInStart = this._lLineStart;

        box.moveUpRight();
        this._rCenterVU = center0;
        this._rRadiusVU = box.radius;

        this._rViewportUp = new Viewport2D(this._ctx, WorldOrientation.Up, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._rRayStartVU = new Vector2D(-box.radius, 0);
        this._rRayInStartVU = this._rRayStartVU;

        box.moveDown();
        this._rCenterVD = center0;
        this._rRadiusVD = box.radius;

        this._rViewportDown = new Viewport2D(this._ctx, WorldOrientation.Down, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._rRayStartVD = new Vector2D(-box.radius, 0);
        this._rRayInStartVD = this._rRayStartVD;

        box.moveUpRight();
        this._lCenterVU = center0;
        this._lRadiusVU = box.radius;

        this._lViewportUp = new Viewport2D(this._ctx, WorldOrientation.Up, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._lLineStartVU = new Vector2D(-box.radius, 0);
        this._lLineInStartVU = this._lLineStartVU;

        box.moveDown();
        this._lCenterVD = center0;
        this._lRadiusVD = box.radius;

        this._lViewportDown = new Viewport2D(this._ctx, WorldOrientation.Down, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._lLineStartVD = new Vector2D(-box.radius, 0);
        this._lLineInStartVD = this._lLineStartVD;

        box.moveUpRight();
        this._rRayR = new Ray2D(box.center, new Vector2D(1, 0), box.radius);
        this._rRayR2 = this._rRayR;

        box.moveDown();
        this._lLineR = Line2D.fromDirection(box.center, new Vector2D(1, 0), box.radius);
        this._lLineR2 = this._lLineR;

        box.moveUpRight();
        this._rViewportRUp = new Viewport2D(this._ctx, WorldOrientation.Up, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._rRayRVU = new Ray2D(center0, new Vector2D(1, 0), box.radius);
        this._rRayRVU2 = this._rRayRVU;

        box.moveDown();
        this._rViewportRDown = new Viewport2D(this._ctx, WorldOrientation.Down, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._rRayRVD = new Ray2D(center0, new Vector2D(1, 0), box.radius);
        this._rRayRVD2 = this._rRayRVD;

        box.moveUpRight();
        this._lViewportRUp = new Viewport2D(this._ctx, WorldOrientation.Up, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._lLineRVU = Line2D.fromDirection(center0, new Vector2D(1, 0), box.radius);
        this._lLineRVU2 = this._lLineRVU;

        box.moveDown();
        this._lViewportRDown = new Viewport2D(this._ctx, WorldOrientation.Down, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._lLineRVD = Line2D.fromDirection(center0, new Vector2D(1, 0), box.radius);
        this._lLineRVD2 = this._lLineRVD;

        box.reset();
        box.moveDown();
        box.moveDown();
        this._rCenterRA = box.center;
        this._rRadiusRA = box.radius;
        this._rRayRA = Ray2D.fromPoints(new Vector2D(box.x, this._rCenterRA.y), new Vector2D(this._rCenterRA.x, box.y + box.h));
        this._rRayRA2 = Ray2D.fromPoints(new Vector2D(box.x + 5, this._rCenterRA.y), new Vector2D(this._rCenterRA.x, this._rCenterRA.y));

        box.moveDown();
        this._lCenterRA = box.center;
        this._lRadiusRA = box.radius;
        this._lLineRA = new Line2D(new Vector2D(box.x, this._lCenterRA.y), new Vector2D(this._lCenterRA.x, box.y + box.h));
        this._lLineRA2 = new Line2D(new Vector2D(box.x + 5, this._lCenterRA.y), new Vector2D(this._lCenterRA.x, this._lCenterRA.y));

        box.moveUpRight();
        this._rViewportRAUp = new Viewport2D(this._ctx, WorldOrientation.Up, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._rCenterRAU = center0;
        this._rRadiusRAU = box.radius;
        this._rRayRAU = Ray2D.fromPoints(new Vector2D(-box.radius, center0.y), new Vector2D(center0.x, box.radius));
        this._rRayRAU2 = Ray2D.fromPoints(new Vector2D(-box.radius + 5, center0.y), new Vector2D(center0.x, center0.y));

        box.moveDown();
        this._rViewportRADown = new Viewport2D(this._ctx, WorldOrientation.Down, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._rCenterRAD = center0;
        this._rRadiusRAD = box.radius;
        this._rRayRAD = Ray2D.fromPoints(new Vector2D(-box.radius, center0.y), new Vector2D(center0.x, box.radius));
        this._rRayRAD2 = Ray2D.fromPoints(new Vector2D(-box.radius + 5, center0.y), new Vector2D(center0.x, center0.y));

        box.moveUpRight();
        this._lViewportRAUp = new Viewport2D(this._ctx, WorldOrientation.Up, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._lCenterRAU = center0;
        this._lRadiusRAU = box.radius;
        this._lLineRAU = new Line2D(new Vector2D(-box.radius, center0.y), new Vector2D(center0.x, box.radius));
        this._lLineRAU2 = new Line2D(new Vector2D(-box.radius + 5, center0.y), new Vector2D(center0.x, center0.y));

        box.moveDown();
        this._lViewportRADown = new Viewport2D(this._ctx, WorldOrientation.Down, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._lCenterRAD = center0;
        this._lRadiusRAD = box.radius;
        this._lLineRAD = new Line2D(new Vector2D(-box.radius, center0.y), new Vector2D(center0.x, box.radius));
        this._lLineRAD2 = new Line2D(new Vector2D(-box.radius + 5, center0.y), new Vector2D(center0.x, center0.y));
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

    drawAngleText(source: Ray2D, target: Ray2D, center: Vector2D, viewport?: Viewport2D, mod90: boolean = false) {
        const ctx = this._ctx;

        if (viewport)
            center = viewport.toScreen(center);

        let degreesBetween = source.degreesBetween(target);

        if (mod90)
            degreesBetween %= 90;

        ctx.font = "20px arial";
        ctx.textAlign = "center";
        ctx.fillText(degreesBetween.toFixed(0), center.x, center.y);
    }

    drawIntersection(source: Ray2D, target: Ray2D, viewport?: Viewport2D) {
        const ctx = this._ctx;

        source.draw(ctx, 2, "purple", viewport);
        let vector = source.getInstersection(target);

        if (!vector) return;

        if (viewport)
            vector = viewport.toScreen(vector);

        vector.draw(ctx, 4, "green");
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
        this.drawAngleText(rayIn, ray, center, viewport);
        //console.log(`Origin (${rayReflect.origin.x}, ${rayReflect.origin.y}) - Endpoint (${rayReflect.endPoint.x}, ${rayReflect.endPoint.y})`);
    }

    testLine(lineStart: Vector2D, lineInStart: Vector2D, center: Vector2D, radius: number, viewport?: Viewport2D) {
        const ctx = this._ctx;

        this.circleOutline(center, radius, viewport);

        let line = Line2D.fromDirection(lineStart, lineStart.directionTo(center), radius * 2);
        let lineIn = new Line2D(lineInStart, center);

        let lineReflect: Line2D = line.reflect(lineIn);
        let lineNormal = Line2D.fromDirection(center, line.normal, radius);

        line.draw(ctx, 5, "blue", viewport);
        lineNormal.draw(ctx, 3, "red", viewport);
        lineReflect.draw(ctx, 4, "gray", viewport);
        lineIn.draw(ctx, 4, "black", viewport);
        this.drawAngleText(lineIn, line, center, viewport);
        //console.log(`Origin (${lineReflect.origin.x}, ${lineReflect.origin.y}) - Endpoint (${lineReflect.endPoint.x}, ${lineReflect.endPoint.y})`);
    }

    getRayEndpointVector(ray: Ray2D, viewport?: Viewport2D) {
        let vector = Vector2D.fromDegrees(ray.direction.degrees).normalize();
        vector = vector.mult(ray.length).add(ray.origin);

        if (viewport)
            vector = viewport.toScreen(vector);

        return vector;
    }

    animLoop = () => {
        const ctx = this._ctx;
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        const vColor = "white";
        const rColor = "blue";
        const rColor2 = "purple";
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
        this._rViewportUp.draw(ctx, 2, vColor);
        this.testRay(this._rRayStartVU, this._rRayInStartVU, this._rCenterVU, this._rRadiusVU, this._rViewportUp);

        this._rRayStartVD = this._rRayStartVD.rotateDegreesAbout(rotDegrees, this._rCenterVD);
        this._rRayInStartVD = this._rRayInStartVD.rotateDegreesAbout(inDegrees, this._rCenterVD);
        this._rViewportDown.draw(ctx, 2, vColor);
        this.testRay(this._rRayStartVD, this._rRayInStartVD, this._rCenterVD, this._rRadiusVD, this._rViewportDown);

        this._lLineStartVU = this._lLineStartVU.rotateDegreesAbout(rotDegrees, this._lCenterVU);
        this._lLineInStartVU = this._lLineInStartVU.rotateDegreesAbout(inDegrees, this._lCenterVU);
        this._lViewportUp.draw(ctx, 2, vColor);
        this.testLine(this._lLineStartVU, this._lLineInStartVU, this._lCenterVU, this._lRadiusVU, this._lViewportUp);

        this._lLineStartVD = this._lLineStartVD.rotateDegreesAbout(rotDegrees, this._lCenterVD);
        this._lLineInStartVD = this._lLineInStartVD.rotateDegreesAbout(inDegrees, this._lCenterVD);
        this._lViewportDown.draw(ctx, 2, vColor);
        this.testLine(this._lLineStartVD, this._lLineInStartVD, this._lCenterVD, this._lRadiusVD, this._lViewportDown);

        this._rRayR = this._rRayR.rotateDegrees(rotDegrees);
        this._rRayR2 = this._rRayR2.rotateDegrees(inDegrees);
        this.circleOutline(this._rRayR.origin, this._rRayR.length);
        this._rRayR.draw(ctx, 2, rColor);
        this._rRayR2.draw(ctx, 2, rColor2);
        let vector: Vector2D | null = this.getRayEndpointVector(this._rRayR);
        vector.draw(ctx, 3, "green");
        this.drawAngleText(this._rRayR, this._rRayR2, this._rRayR.origin);

        this._lLineR = this._lLineR.rotateDegrees(rotDegrees);
        this._lLineR2 = this._lLineR2.rotateDegrees(inDegrees);
        this.circleOutline(this._lLineR.origin, this._lLineR.length);
        this._lLineR.draw(ctx, 2, rColor);
        this._lLineR2.draw(ctx, 2, rColor2);
        this.drawAngleText(this._lLineR, this._lLineR2, this._lLineR.origin);

        this._rRayRVU = this._rRayRVU.rotateDegrees(rotDegrees);
        this._rRayRVU2 = this._rRayRVU2.rotateDegrees(inDegrees);
        this.circleOutline(this._rRayRVU.origin, this._rRayRVU.length, this._rViewportRUp);
        this._rViewportRUp.draw(ctx, 2, vColor);
        this._rRayRVU.draw(ctx, 2, rColor, this._rViewportRUp);
        this._rRayRVU2.draw(ctx, 2, rColor2, this._rViewportRUp);
        vector = this.getRayEndpointVector(this._rRayRVU, this._rViewportRUp);
        vector.draw(ctx, 3, "green");
        this.drawAngleText(this._rRayRVU, this._rRayRVU2, this._rRayRVU.origin, this._rViewportRUp);

        this._rRayRVD = this._rRayRVD.rotateDegrees(rotDegrees);
        this._rRayRVD2 = this._rRayRVD2.rotateDegrees(inDegrees);
        this.circleOutline(this._rRayRVD.origin, this._rRayRVD.length, this._rViewportRDown);
        this._rViewportRDown.draw(ctx, 2, vColor);
        this._rRayRVD.draw(ctx, 2, rColor, this._rViewportRDown);
        this._rRayRVD2.draw(ctx, 2, rColor2, this._rViewportRDown);
        this.drawAngleText(this._rRayRVD, this._rRayRVD2, this._rRayRVD.origin, this._rViewportRDown);

        this._lLineRVU = this._lLineRVU.rotateDegrees(rotDegrees);
        this._lLineRVU2 = this._lLineRVU2.rotateDegrees(inDegrees);
        this.circleOutline(this._lLineRVU.origin, this._lLineRVU.length, this._lViewportRUp);
        this._lViewportRUp.draw(ctx, 2, vColor);
        this._lLineRVU.draw(ctx, 2, rColor, this._lViewportRUp);
        this._lLineRVU2.draw(ctx, 2, rColor2, this._lViewportRUp);
        this.drawAngleText(this._lLineRVU, this._lLineRVU2, this._lLineRVU.origin, this._lViewportRUp);

        this._lLineRVD = this._lLineRVD.rotateDegrees(rotDegrees);
        this._lLineRVD2 = this._lLineRVD2.rotateDegrees(inDegrees);
        this.circleOutline(this._lLineRVD.origin, this._lLineRVD.length, this._lViewportRDown);
        this._lViewportRDown.draw(ctx, 2, vColor);
        this._lLineRVD.draw(ctx, 2, rColor, this._lViewportRDown);
        this._lLineRVD2.draw(ctx, 2, rColor2, this._lViewportRDown);
        this.drawAngleText(this._lLineRVD, this._lLineRVD2, this._lLineRVD.origin, this._lViewportRDown);

        this._rRayRA = this._rRayRA.rotateDegreesAbout(rotDegrees, this._rCenterRA);
        this.circleOutline(this._rCenterRA, this._rRadiusRA);
        this._rRayRA.draw(ctx, 2, rColor);
        this.drawIntersection(this._rRayRA2, this._rRayRA);

        this._lLineRA = this._lLineRA.rotateDegreesAbout(rotDegrees, this._lCenterRA);
        this.circleOutline(this._lCenterRA, this._lRadiusRA);
        this._lLineRA.draw(ctx, 2, rColor);
        this.drawIntersection(this._lLineRA2, this._lLineRA);

        this._rRayRAU = this._rRayRAU.rotateDegreesAbout(rotDegrees, this._rCenterRAU);
        this.circleOutline(this._rCenterRAU, this._rRadiusRAU, this._rViewportRAUp);
        this._rViewportRAUp.draw(ctx, 2, vColor);
        this._rRayRAU.draw(ctx, 2, rColor, this._rViewportRAUp);
        this.drawIntersection(this._rRayRAU2, this._rRayRAU, this._rViewportRAUp);

        this._rRayRAD = this._rRayRAD.rotateDegreesAbout(rotDegrees, this._rCenterRAU);
        this.circleOutline(this._rCenterRAD, this._rRadiusRAD, this._rViewportRADown);
        this._rViewportRADown.draw(ctx, 2, vColor);
        this._rRayRAD.draw(ctx, 2, rColor, this._rViewportRADown);
        this.drawIntersection(this._rRayRAD2, this._rRayRAD, this._rViewportRADown);

        this._lLineRAU = this._lLineRAU.rotateDegreesAbout(rotDegrees, this._lCenterRAU);
        this.circleOutline(this._lCenterRAU, this._lRadiusRAU, this._lViewportRAUp);
        this._lViewportRAUp.draw(ctx, 2, vColor);
        this._lLineRAU.draw(ctx, 2, rColor, this._lViewportRAUp)
        this.drawIntersection(this._lLineRAU2, this._lLineRAU, this._lViewportRAUp);

        this._lLineRAD = this._lLineRAD.rotateDegreesAbout(rotDegrees, this._lCenterRAU);
        this.circleOutline(this._lCenterRAD, this._lRadiusRAD, this._lViewportRADown);
        this._lViewportRADown.draw(ctx, 2, vColor);
        this._lLineRAD.draw(ctx, 2, rColor, this._lViewportRADown);
        this.drawIntersection(this._lLineRAD2, this._lLineRAD, this._lViewportRADown);

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

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

class Test {
    private readonly _ctx: CanvasRenderingContext2D;
    private _rLength = 100;
    private _rLeft = 100;
    private _rNormalLength = 50;
    private _rCenterY = 100;
    private _rNormal: Vector2D;
    private _rLoc: LocInfo = new LocInfo(this._rLeft, this._rCenterY, this._rLeft, this._rCenterY - this._rNormalLength, this._rLeft + this._rLength, this._rCenterY + this._rNormalLength);
    private _testRay: Ray2D;
    private _rayNormal: Ray2D;

    private _lLength = 100;
    private _lLeft = 100;
    private _lNormalLength = 50;
    private _lCenterY = 300;
    private _lNormal: Vector2D;
    private _lLoc: LocInfo = new LocInfo(this._lLeft, this._lCenterY, this._lLeft, this._lCenterY - this._lNormalLength, this._lLeft + this._lLength, this._lCenterY + this._lNormalLength);
    private _testLine: Line2D;
    private _lineNormal: Line2D;

    constructor(private _canvas: HTMLCanvasElement) {
        this._ctx = <CanvasRenderingContext2D>this._canvas.getContext("2d");
    }

    testRay() {
        const ctx = this._ctx;

        this._rLoc.advance();

        let lineIn: Line2D = new Line2D(new Vector2D(this._rLoc.x, this._rLoc.y), this._rayNormal.origin);
        let rayIn: Ray2D = new Ray2D(lineIn.origin, lineIn.direction, lineIn.length);

        let rayReflect = rayIn.reflectOff(this._testRay);

        this._testRay.draw(ctx, 5, "blue");
        this._rayNormal.draw(ctx, 3, "red");
        rayIn.draw(ctx, 4, "black");
        rayReflect.draw(ctx, 4, "gray");
        //console.log(`Origin (${rayReflect.origin.x}, ${rayReflect.origin.y}) - Endpoint (${rayReflect.endPoint.x}, ${rayReflect.endPoint.y})`);
    }

    testLine() {
        const ctx = this._ctx;

        this._lLoc.advance();

        let lineIn: Line2D = new Line2D(new Vector2D(this._lLoc.x, this._lLoc.y), this._lineNormal.origin);
        let rayReflect: Line2D = this._testLine.reflect(lineIn);

        this._testLine.draw(ctx, 5, "blue");
        this._lineNormal.draw(ctx, 3, "red");
        rayReflect.draw(ctx, 4, "gray");
        lineIn.draw(ctx, 4, "black");
        //console.log(`Origin (${rayReflect.origin.x}, ${rayReflect.origin.y}) - Endpoint (${rayReflect.endPoint.x}, ${rayReflect.endPoint.y})`);
    }

    animLoop = () => {
        const ctx = this._ctx;
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.testRay();
        this.testLine();

        requestAnimationFrame(this.animLoop);
    }

    start() {
        let ray = new Ray2D(new Vector2D(this._rLeft, this._rCenterY), new Vector2D(3, 0), this._rLength);
        //ray = new Ray2D(new Vector2D(this._rLeft, this._rCenterY), new Vector2D(3, 7), this._rLength);
        this._testRay = ray;
        this._rNormal = ray.normal;
        this._rayNormal = new Ray2D(ray.origin, this._rNormal, this._rNormalLength);
        this._rayNormal = new Ray2D(ray.getPointAt(ray.length / 2), this._rNormal, this._rNormalLength);

        let line = new Line2D(new Vector2D(this._lLeft, this._lCenterY), new Vector2D(this._lLeft + this._lLength, this._lCenterY));
        this._testLine = line;
        this._lNormal = line.normal;
        this._lineNormal = new Ray2D(line.origin, this._lNormal, this._lNormalLength);
        this._lineNormal = new Ray2D(line.getPointAt(line.length / 2), this._lNormal, this._lNormalLength);

        requestAnimationFrame(this.animLoop);
    }
}

var handleOnLoad = function () {
    //console.log("In handleOnLoad");
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    new Test(canvas).start();
}

window.addEventListener("load", handleOnLoad);
//console.log("In test.js");

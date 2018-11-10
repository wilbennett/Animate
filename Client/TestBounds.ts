﻿class LocInfo {
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

class TestBall {
    constructor(
        private _position: Vector2D,
        private _velocity: Vector2D,
        private _radius: number,
        private _color: string,
        private _boundary: ContainerBounds) {

    }

    update() {
        this._position = this._position.add(this._velocity);
        this.checkBoundary();
    }

    draw(ctx: CanvasRenderingContext2D, bounds?: OrientedBounds) {
        let position = this._position;
        let radiusX = this._radius;
        let radiusY = this._radius;

        if (bounds) {
            position = bounds.toScreen(position);
            radiusX = radiusX * bounds.boundsToScreenScaleX;
            radiusY = radiusY * bounds.boundsToScreenScaleY;
        }

        ctx.beginPath();
        //ctx.arc(position.x, position.y, this._radius, 0, MathEx.TWO_PI, true);
        ctx.ellipse(position.x, position.y, radiusX, radiusY, 0, 0, MathEx.TWO_PI);
        ctx.fillStyle = this._color;
        ctx.fill();
        ctx.strokeStyle = this._color;
        ctx.stroke();
    }

    private checkBoundary() {
        const boundary = this._boundary;

        this._position = this._position.add(this._velocity);

        let leftPenetration = boundary.leftPenetration(this._position.x - this._radius);
        let topPenetration = boundary.topPenetration(boundary.offsetAbove(this._position.y, this._radius));
        let rightPenetration = boundary.rightPenetration(this._position.x + this._radius);
        let bottomPenetration = boundary.bottomPenetration(boundary.offsetBelow(this._position.y, this._radius));

        if (leftPenetration > 0) {
            //this._velocity.x *= -1;
            this._position.x = boundary.leftOffset(this._radius);
            this._velocity = boundary.reflectLeft(this._velocity);
        }

        if (rightPenetration > 0) {
            //this._velocity.x *= -1;
            this._position.x = boundary.rightOffset(this._radius);
            this._velocity = boundary.reflectRight(this._velocity);
        }

        if (topPenetration > 0) {
            //this._velocity.y *= -1;
            this._position.y = boundary.topOffsetBelow(this._radius);
            this._velocity = boundary.reflectTop(this._velocity);
        }

        if (bottomPenetration > 0) {
            //this._velocity.y *= -1;
            this._position.y = boundary.bottomOffsetAbove(this._radius);
            this._velocity = boundary.reflectBottom(this._velocity);
            //const force = Math.abs(this._velocity.y); // TODO: Calculate proper force.

            //if (force <= Math.abs(this._gravityConst)) {
            //    this._velocity.y = 0;
            //    this._allowBounce = false;
            //}
        }
    }
}

class TestBounds {
    private readonly _ctx: CanvasRenderingContext2D;
    private _rLength: number;
    private _rLeft: number;
    private _rNormalLength: number;
    private _rCenterY: number;
    private _rNormal: Vector2D;
    private _rLoc: LocInfo;
    private _testRay: Ray2D;
    private _rayNormal: Ray2D;

    private _lLength: number;
    private _lLeft: number;
    private _lNormalLength: number;
    private _lCenterY: number;
    private _lNormal: Vector2D;
    private _lLoc: LocInfo;
    private _testLine: Line2D;
    private _lineNormal: Line2D;

    private _orientedBoundsUp: OrientedBounds;
    private _orientedBoundsDown: OrientedBounds;
    private _orientedLineUp: Line2D;
    private _orientedLineDown: Line2D;

    private _orientedBoundsUpT: OrientedBounds;
    private _orientedBoundsDownT: OrientedBounds;
    private _orientedLineUpT: Line2D;
    private _orientedLineDownT: Line2D;

    private _viewportUp: Viewport2D;
    private _viewportDown: Viewport2D;
    private _boundsUp: ContainerBounds;
    private _boundsDown: ContainerBounds;
    private _ballUp: TestBall;
    private _ballDown: TestBall;

    private _viewportUpT: Viewport2D;
    private _viewportDownT: Viewport2D;
    private _boundsUpT: ContainerBounds;
    private _boundsDownT: ContainerBounds;
    private _ballUpT: TestBall;
    private _ballDownT: TestBall;

    // Scale up.
    private _viewportUpU: Viewport2D;
    private _viewportDownU: Viewport2D;
    private _boundsUpU: ContainerBounds;
    private _boundsDownU: ContainerBounds;
    private _ballUpU: TestBall;
    private _ballDownU: TestBall;

    private _viewportUpUT: Viewport2D;
    private _viewportDownUT: Viewport2D;
    private _boundsUpUT: ContainerBounds;
    private _boundsDownUT: ContainerBounds;
    private _ballUpUT: TestBall;
    private _ballDownUT: TestBall;

    // Scale down.
    private _viewportUpD: Viewport2D;
    private _viewportDownD: Viewport2D;
    private _boundsUpD: ContainerBounds;
    private _boundsDownD: ContainerBounds;
    private _ballUpD: TestBall;
    private _ballDownD: TestBall;

    private _viewportUpDT: Viewport2D;
    private _viewportDownDT: Viewport2D;
    private _boundsUpDT: ContainerBounds;
    private _boundsDownDT: ContainerBounds;
    private _ballUpDT: TestBall;
    private _ballDownDT: TestBall;

    constructor(private _canvas: HTMLCanvasElement) {
        this._ctx = <CanvasRenderingContext2D>this._canvas.getContext("2d");

        let sx = 10;
        let sy = 10;
        let sw = 150;
        let sh = 100;
        let sd = 10;
        let sy2 = sy + sh + sd;

        this._rLeft = sx;
        this._rCenterY = sy + sh / 2;
        this._rNormalLength = sh / 2;
        this._rLength = sw;
        this._rLoc = new LocInfo(this._rLeft, this._rCenterY, this._rLeft, this._rCenterY - this._rNormalLength, this._rLeft + this._rLength, this._rCenterY + this._rNormalLength);
        let ray = new Ray2D(new Vector2D(this._rLeft, this._rCenterY), new Vector2D(3, 0), this._rLength);
        //ray = new Ray2D(new Vector2D(this._rLeft, this._rCenterY), new Vector2D(3, 7), this._rLength);
        this._testRay = ray;
        this._rNormal = ray.normal;
        this._rayNormal = new Ray2D(ray.origin, this._rNormal, this._rNormalLength);
        this._rayNormal = new Ray2D(ray.getPointAt(ray.length / 2), this._rNormal, this._rNormalLength);

        this._lLeft = sx;
        this._lCenterY = sy2 + sh / 2;
        this._lNormalLength = sh / 2;
        this._lLength = sw;

        this._lLoc = new LocInfo(this._lLeft, this._lCenterY, this._lLeft, this._lCenterY - this._lNormalLength, this._lLeft + this._lLength, this._lCenterY + this._lNormalLength);
        let line = new Line2D(new Vector2D(this._lLeft, this._lCenterY), new Vector2D(this._lLeft + this._lLength, this._lCenterY));
        this._testLine = line;
        this._lNormal = line.normal;
        this._lineNormal = Line2D.fromRay(new Ray2D(line.getPointAt(line.length / 2), this._lNormal, this._lNormalLength));

        sx = sx + sw + sd;
        let x = sx;
        let y = sy;

        this._orientedBoundsUp = new OrientedBounds(WorldOrientation.Up, x, y, sw, sh);
        this._orientedLineUp = new Line2D(new Vector2D(x + 5, y + 5), new Vector2D(x + sw - 5 - 1, y + sh - 5 - 1));

        y = sy2;
        this._orientedBoundsDown = new OrientedBounds(WorldOrientation.Down, x, sy2, sw, sh);
        this._orientedLineDown = new Line2D(new Vector2D(x + 5, y + 5), new Vector2D(x + sw - 5 - 1, y + sh - 5 - 1));

        sx = sx + sw + sd;
        x = sx;
        y = sy;

        this._orientedBoundsUpT = new OrientedBounds(WorldOrientation.Up, x, y, sw, sh);
        this._orientedLineUpT = new Line2D(new Vector2D(x + 5, y + 5), new Vector2D(x + sw - 5 - 1, y + sh - 5 - 1));

        y = sy2;
        this._orientedBoundsDownT = new OrientedBounds(WorldOrientation.Down, x, sy2, sw, sh);
        this._orientedLineDownT = new Line2D(new Vector2D(x + 5, y + 5), new Vector2D(x + sw - 5 - 1, y + sh - 5 - 1));

        sx = sx + sw + sd;
        x = sx;
        y = sy;

        //* // Normal.
        this._viewportUp = new Viewport2D(WorldOrientation.Up, 0, 0, sw, sh, x, y);

        y = sy2;
        this._viewportDown = new Viewport2D(WorldOrientation.Down, 0, 0, sw, sh, x, y);

        sx = sx + sw + sd;
        x = sx;
        y = sy;

        this._viewportUpT = new Viewport2D(WorldOrientation.Up, 0, 0, sw, sh, x, y);

        y = sy2;
        this._viewportDownT = new Viewport2D(WorldOrientation.Down, 0, 0, sw, sh, x, y);

        this._boundsUp = new ContainerBounds(WorldOrientation.Up, 10, 10, this._viewportUp.width - 20, this._viewportUp.height - 20);
        this._boundsDown = new ContainerBounds(WorldOrientation.Down, 10, 10, this._viewportDown.width - 20, this._viewportDown.height - 20);

        this._ballUp = new TestBall(this._boundsUp.center, new Vector2D(2, 2), 10, "purple", this._boundsUp);
        this._ballDown = new TestBall(this._boundsDown.center, new Vector2D(2, 2), 10, "green", this._boundsDown);

        this._boundsUpT = new ContainerBounds(WorldOrientation.Up, 10, 10, this._viewportUpT.width - 20, this._viewportUpT.height - 20);
        this._boundsDownT = new ContainerBounds(WorldOrientation.Down, 10, 10, this._viewportDownT.width - 20, this._viewportDownT.height - 20);

        this._ballUpT = new TestBall(this._boundsUpT.center, new Vector2D(2, 2), 10, "purple", this._boundsUpT);
        this._ballDownT = new TestBall(this._boundsDownT.center, new Vector2D(2, 2), 10, "green", this._boundsDownT);

        // Scale up.
        sx = 10;
        sy = sy2 + sh + sd;
        sy2 = sy + sh + sd;
        x = sx;
        y = sy;

        let scale = 0.75;
        this._viewportUpU = new Viewport2D(WorldOrientation.Up, 0, 0, sw * scale, sh * scale, x, y, sw, sh);

        y = sy2;
        this._viewportDownU = new Viewport2D(WorldOrientation.Down, 0, 0, sw * scale, sh * scale, x, y, sw, sh);

        sx = sx + sw + sd;
        x = sx;
        y = sy;

        this._viewportUpUT = new Viewport2D(WorldOrientation.Up, 0, 0, sw * scale, sh * scale, x, y, sw, sh);

        y = sy2;
        this._viewportDownUT = new Viewport2D(WorldOrientation.Down, 0, 0, sw * scale, sh * scale, x, y, sw, sh);

        this._boundsUpU = new ContainerBounds(WorldOrientation.Up, 10, 10, this._viewportUpU.width - 20, this._viewportUpU.height - 20);
        this._boundsDownU = new ContainerBounds(WorldOrientation.Down, 10, 10, this._viewportDownU.width - 20, this._viewportDownU.height - 20);

        this._ballUpU = new TestBall(this._boundsUpU.center, new Vector2D(2, 2), 10, "purple", this._boundsUpU);
        this._ballDownU = new TestBall(this._boundsDownU.center, new Vector2D(2, 2), 10, "green", this._boundsDownU);

        this._boundsUpUT = new ContainerBounds(WorldOrientation.Up, 10, 10, this._viewportUpUT.width - 20, this._viewportUpUT.height - 20);
        this._boundsDownUT = new ContainerBounds(WorldOrientation.Down, 10, 10, this._viewportDownUT.width - 20, this._viewportDownUT.height - 20);

        this._ballUpUT = new TestBall(this._boundsUpUT.center, new Vector2D(2, 2), 10, "purple", this._boundsUpUT);
        this._ballDownUT = new TestBall(this._boundsDownUT.center, new Vector2D(2, 2), 10, "green", this._boundsDownUT);

        // Scale down.
        scale = 2;
        sx = sx + sw + sd;
        x = sx;
        y = sy;

        this._viewportUpD = new Viewport2D(WorldOrientation.Up, 0, 0, sw * scale, sh * scale, x, y, sw, sh);

        y = sy2;
        this._viewportDownD = new Viewport2D(WorldOrientation.Down, 0, 0, sw * scale, sh * scale, x, y, sw, sh);

        sx = sx + sw + sd;
        x = sx;
        y = sy;

        this._viewportUpDT = new Viewport2D(WorldOrientation.Up, 0, 0, sw * scale, sh * scale, x, y, sw, sh);

        y = sy2;
        this._viewportDownDT = new Viewport2D(WorldOrientation.Down, 0, 0, sw * scale, sh * scale, x, y, sw, sh);

        this._boundsUpD = new ContainerBounds(WorldOrientation.Up, 10, 10, this._viewportUpD.width - 20, this._viewportUpD.height - 20);
        this._boundsDownD = new ContainerBounds(WorldOrientation.Down, 10, 10, this._viewportDownD.width - 20, this._viewportDownD.height - 20);

        this._ballUpD = new TestBall(this._boundsUpD.center, new Vector2D(2, 2), 10, "purple", this._boundsUpD);
        this._ballDownD = new TestBall(this._boundsDownD.center, new Vector2D(2, 2), 10, "green", this._boundsDownD);

        this._boundsUpDT = new ContainerBounds(WorldOrientation.Up, 10, 10, this._viewportUpDT.width - 20, this._viewportUpDT.height - 20);
        this._boundsDownDT = new ContainerBounds(WorldOrientation.Down, 10, 10, this._viewportDownDT.width - 20, this._viewportDownDT.height - 20);

        this._ballUpDT = new TestBall(this._boundsUpDT.center, new Vector2D(2, 2), 10, "purple", this._boundsUpDT);
        this._ballDownDT = new TestBall(this._boundsDownDT.center, new Vector2D(2, 2), 10, "green", this._boundsDownDT);

        //console.log(`viewport up scale to screen X: ${this._viewportUp.boundsToScreenScaleX}`);
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

    testOrientedBounds(bounds: OrientedBounds, line: Line2D, color: string) {
        const ctx = this._ctx;

        bounds.draw(ctx, 2, color, bounds);
        line.draw(ctx, 2, color, bounds);
    }

    testOrientedBoundsT(bounds: OrientedBounds, line: Line2D, color: string) {
        const ctx = this._ctx;

        bounds.applyTransform(ctx);
        bounds.draw(ctx, 2, color);
        line.draw(ctx, 2, color);
        bounds.restoreTransform(ctx);
    }

    testViewport(
        viewport: Viewport2D,
        ball: TestBall,
        bounds: OrientedBounds,
        viewportColor: string,
        boundsColor: string) {
        const ctx = this._ctx;

        ball.update();
        viewport.draw(ctx, 2, viewportColor, viewport);
        bounds.draw(ctx, 2, boundsColor, viewport);
        ball.draw(ctx, viewport);
    }

    testViewportT(
        viewport: Viewport2D,
        ball: TestBall,
        bounds: OrientedBounds,
        viewportColor: string,
        boundsColor: string) {
        const ctx = this._ctx;

        viewport.applyTransform(ctx);
        ball.update();
        viewport.draw(ctx, 2, viewportColor);
        bounds.draw(ctx, 2, boundsColor);
        ball.draw(ctx);
        viewport.restoreTransform(ctx);
    }

    drawGuideLine(bounds: OrientedBounds) {
        const ctx = this._ctx;
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.moveTo(bounds.screenRight, bounds.screenTop);
        ctx.lineTo(bounds.screenLeft, bounds.screenTop);
        ctx.stroke();
    }

    animLoop = () => {
        const ctx = this._ctx;
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this.drawGuideLine(this._orientedBoundsUp);
        this.drawGuideLine(this._orientedBoundsDown);
        this.drawGuideLine(this._orientedBoundsUpT);
        this.drawGuideLine(this._orientedBoundsDownT);
        this.drawGuideLine(this._viewportUp);
        this.drawGuideLine(this._viewportDown);
        this.drawGuideLine(this._viewportUpT);
        this.drawGuideLine(this._viewportDownT);
        this.drawGuideLine(this._viewportUpU);
        this.drawGuideLine(this._viewportDownU);
        this.drawGuideLine(this._viewportUpUT);
        this.drawGuideLine(this._viewportDownUT);
        this.drawGuideLine(this._viewportUpD);
        this.drawGuideLine(this._viewportDownD);
        this.drawGuideLine(this._viewportUpDT);
        this.drawGuideLine(this._viewportDownDT);

        this.testRay();
        this.testLine();

        let vpColor = "white";
        let upColor = "purple";
        let dnColor = "blue";

        this.testOrientedBounds(this._orientedBoundsUp, this._orientedLineUp, upColor);
        this.testOrientedBounds(this._orientedBoundsDown, this._orientedLineDown, dnColor);

        this.testOrientedBoundsT(this._orientedBoundsUpT, this._orientedLineUpT, upColor);
        this.testOrientedBoundsT(this._orientedBoundsDownT, this._orientedLineDownT, dnColor);

        this.testViewport(this._viewportUp, this._ballUp, this._boundsUp, vpColor, upColor);
        this.testViewport(this._viewportDown, this._ballDown, this._boundsDown, vpColor, dnColor);

        this.testViewportT(this._viewportUpT, this._ballUpT, this._boundsUpT, vpColor, upColor);
        this.testViewportT(this._viewportDownT, this._ballDownT, this._boundsDownT, vpColor, dnColor);

        this.testViewport(this._viewportUpU, this._ballUpU, this._boundsUpU, vpColor, upColor);
        this.testViewport(this._viewportDownU, this._ballDownU, this._boundsDownU, vpColor, dnColor);

        this.testViewportT(this._viewportUpUT, this._ballUpUT, this._boundsUpUT, vpColor, upColor);
        this.testViewportT(this._viewportDownUT, this._ballDownUT, this._boundsDownUT, vpColor, dnColor);

        this.testViewport(this._viewportUpD, this._ballUpD, this._boundsUpD, vpColor, upColor);
        this.testViewport(this._viewportDownD, this._ballDownD, this._boundsDownD, vpColor, dnColor);

        this.testViewportT(this._viewportUpDT, this._ballUpDT, this._boundsUpDT, vpColor, upColor);
        this.testViewportT(this._viewportDownDT, this._ballDownDT, this._boundsDownDT, vpColor, dnColor);

        requestAnimationFrame(this.animLoop);
    }

    start() {
        requestAnimationFrame(this.animLoop);
    }
}

var handleOnLoad = function () {
    //console.log("In handleOnLoad");
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    new TestBounds(canvas).start();
}

window.addEventListener("load", handleOnLoad);
//console.log("In test.js");

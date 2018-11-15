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
            this._position = this._position.withX(boundary.leftOffset(this._radius));
            this._velocity = boundary.reflectLeft(this._velocity);
        }

        if (rightPenetration > 0) {
            this._position = this._position.withX(boundary.rightOffset(this._radius));
            this._velocity = boundary.reflectRight(this._velocity);
        }

        if (topPenetration > 0) {
            this._position = this._position.withY(boundary.topOffsetBelow(this._radius));
            this._velocity = boundary.reflectTop(this._velocity);
        }

        if (bottomPenetration > 0) {
            this._position = this._position.withY(boundary.bottomOffsetAbove(this._radius));
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

        let box = new TestBox(10, 10, 150, 100, 10);

        this._orientedBoundsUp = new OrientedBounds(WorldOrientation.Up, box.x, box.y, box.w, box.h);
        this._orientedLineUp = new Line2D(box.offsetTopLeft(5, 5), box.offsetBottomRight(-5, - 5));

        box.moveDown();
        this._orientedBoundsDown = new OrientedBounds(WorldOrientation.Down, box.x, box.y, box.w, box.h);
        this._orientedLineDown = new Line2D(box.offsetTopLeft(5, 5), box.offsetBottomRight(-5, - 5));

        box.moveUpRight();
        this._orientedBoundsUpT = new OrientedBounds(WorldOrientation.Up, box.x, box.y, box.w, box.h);
        this._orientedLineUpT = new Line2D(box.offsetTopLeft(5, 5), box.offsetBottomRight(-5, - 5));

        box.moveDown();
        this._orientedBoundsDownT = new OrientedBounds(WorldOrientation.Down, box.x, box.y, box.w, box.h);
        this._orientedLineDownT = new Line2D(box.offsetTopLeft(5, 5), box.offsetBottomRight(-5, - 5));

        box.moveUpRight();

        //* // Normal.
        this._viewportUp = new Viewport2D(this._ctx, WorldOrientation.Up, 0, 0, box.w, box.h, box.x, box.y);

        box.moveDown();
        this._viewportDown = new Viewport2D(this._ctx, WorldOrientation.Down, 0, 0, box.w, box.h, box.x, box.y);

        box.moveUpRight();
        this._viewportUpT = new Viewport2D(this._ctx, WorldOrientation.Up, 0, 0, box.w, box.h, box.x, box.y);

        box.moveDown();
        this._viewportDownT = new Viewport2D(this._ctx, WorldOrientation.Down, 0, 0, box.w, box.h, box.x, box.y);

        this._boundsUp = new ContainerBounds(WorldOrientation.Up, 10, 10, this._viewportUp.width - 20, this._viewportUp.height - 20);
        this._boundsDown = new ContainerBounds(WorldOrientation.Down, 10, 10, this._viewportDown.width - 20, this._viewportDown.height - 20);

        this._ballUp = new TestBall(this._boundsUp.center, new Vector2D(2, 2), 10, "purple", this._boundsUp);
        this._ballDown = new TestBall(this._boundsDown.center, new Vector2D(2, 2), 10, "green", this._boundsDown);

        this._boundsUpT = new ContainerBounds(WorldOrientation.Up, 10, 10, this._viewportUpT.width - 20, this._viewportUpT.height - 20);
        this._boundsDownT = new ContainerBounds(WorldOrientation.Down, 10, 10, this._viewportDownT.width - 20, this._viewportDownT.height - 20);

        this._ballUpT = new TestBall(this._boundsUpT.center, new Vector2D(2, 2), 10, "purple", this._boundsUpT);
        this._ballDownT = new TestBall(this._boundsDownT.center, new Vector2D(2, 2), 10, "green", this._boundsDownT);

        // Scale up.
        box.reset();
        box.moveDown();
        box.moveDown();

        let scale = 0.75;
        this._viewportUpU = new Viewport2D(this._ctx, WorldOrientation.Up, 0, 0, box.w * scale, box.h * scale, box.x, box.y, box.w, box.h);

        box.moveDown();
        this._viewportDownU = new Viewport2D(this._ctx, WorldOrientation.Down, 0, 0, box.w * scale, box.h * scale, box.x, box.y, box.w, box.h);

        box.moveUpRight();
        this._viewportUpUT = new Viewport2D(this._ctx, WorldOrientation.Up, 0, 0, box.w * scale, box.h * scale, box.x, box.y, box.w, box.h);

        box.moveDown();
        this._viewportDownUT = new Viewport2D(this._ctx, WorldOrientation.Down, 0, 0, box.w * scale, box.h * scale, box.x, box.y, box.w, box.h);

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
        box.moveUpRight();
        this._viewportUpD = new Viewport2D(this._ctx, WorldOrientation.Up, 0, 0, box.w * scale, box.h * scale, box.x, box.y, box.w, box.h);

        box.moveDown();
        this._viewportDownD = new Viewport2D(this._ctx, WorldOrientation.Down, 0, 0, box.w * scale, box.h * scale, box.x, box.y, box.w, box.h);

        box.moveUpRight();
        this._viewportUpDT = new Viewport2D(this._ctx, WorldOrientation.Up, 0, 0, box.w * scale, box.h * scale, box.x, box.y, box.w, box.h);

        box.moveDown();
        this._viewportDownDT = new Viewport2D(this._ctx, WorldOrientation.Down, 0, 0, box.w * scale, box.h * scale, box.x, box.y, box.w, box.h);

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

    testOrientedBounds(bounds: OrientedBounds, line: Line2D, color: string) {
        const ctx = this._ctx;

        bounds.draw(ctx, 2, color, bounds);
        line.draw(ctx, 2, color, bounds);
    }

    testOrientedBoundsT(bounds: OrientedBounds, line: Line2D, color: string) {
        const ctx = this._ctx;

        bounds.applyTransformToContext(ctx);
        bounds.draw(ctx, 2, color);
        line.draw(ctx, 2, color);
        bounds.restoreTransformToContext(ctx);
    }

    testViewport(
        viewport: Viewport2D,
        ball: TestBall,
        bounds: OrientedBounds,
        viewportColor: string,
        boundsColor: string) {
        const ctx = this._ctx;

        ball.update();
        viewport.draw(ctx, 2, viewportColor);
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

        viewport.applyTransform();
        ball.update();
        viewport.draw(ctx, 2, viewportColor);
        bounds.draw(ctx, 2, boundsColor);
        ball.draw(ctx);
        viewport.restoreTransform();
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

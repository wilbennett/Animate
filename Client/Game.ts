class Game {
    private ctx: CanvasRenderingContext2D;
    private height: number = window.innerHeight;
    private width: number = window.innerWidth;
    private canvasMouse: MouseTracker;
    private output: HTMLOutputElement;
    private gravity: Gravity;
    private friction: Force;
    private liquid: Liquid;
    private radar: Radar;
    private leftFan: Wind;
    private rightFan: Wind;
    private world: World2D;
    private balls: Ball[] = [];
    private ballsToRemove: Ball[] = [];
    private backgroundGradient: CanvasGradient;
    private backColorStart: string;
    private backColorEnd: string;
    private viewportDeltaX = 2;
    private viewportDeltaY = 0;
    private backgroundOffset = 0;
    private backgroundDelta = 0.002;

    constructor(private canvas: HTMLCanvasElement, private _settings: Dynamic) {
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
        this.height = this.canvas.height;
        this.width = this.canvas.width;
        const ctx = this.ctx;
        const width = this.width;
        const height = this.height;

        const orientation = _settings.World.up ? WorldOrientation.Up : WorldOrientation.Down;
        const worldWidth = _settings.World.wide ? width * 1.5 : width;
        const worldHeight = _settings.World.tall ? height * 1.5 : height;
        this.world = new World2D(ctx, orientation, 0, 0, worldWidth, worldHeight, width, height);

        const world = this.world;
        this.canvasMouse = new MouseTracker(this.canvas);

        this.output = <HTMLOutputElement>document.getElementById("output");
        this.friction = new Friction();
        this.gravity = new Gravity(world.orientation, 0.3);
        this.liquid = new Liquid(new Vector(world.minX, world.offsetAbove(world.minY, 200)), 0.05, world.width / 8, 90);
        this.radar = new Radar(world.center, Math.min(worldWidth, worldHeight) / 2 * 0.90, "purple", 0.01);

        world.addCharacter(this.liquid);
        world.addCharacter(this.radar);

        this.leftFan = this.createFan(world.left, this._settings.LeftFan);
        this.rightFan = this.createFan(world.right, this._settings.RightFan);
        world.addCharacter(this.leftFan);
        world.addCharacter(this.rightFan);
    }

    public handleSettingsChanged() {
        log("Game settings changed");

        if (Math.abs(this.viewportDeltaX) !== Math.abs(this._settings.Viewport.deltaX)) {
            const mult = this.viewportDeltaX >= 0 ? 1 : -1;
            this.viewportDeltaX = this._settings.Viewport.deltaX * mult;
        }

        if (Math.abs(this.viewportDeltaY) !== Math.abs(this._settings.Viewport.deltaY)) {
            const mult = this.viewportDeltaY >= 0 ? 1 : -1;
            this.viewportDeltaY = this._settings.Viewport.deltaY * mult;
        }

        this.backColorStart = this._settings.World.backColorStart || "blue";
        this.backColorEnd = this._settings.World.backColorEnd || "lightgreen";

        this.createBackgroundGradient();
        this.updateFan(this.leftFan, this._settings.LeftFan);
        this.updateFan(this.rightFan, this._settings.RightFan);
    }

    private createFan(x: number, settings: Dynamic) {
        const world = this.world;

        let fanPos = settings.position;
        let fanAngle = settings.angle;
        let fanRadius = settings.strength;

        return new Wind(
            new Vector(x, world.offsetAbove(world.minY, world.height * fanPos)),
            world.localizeDegrees(fanAngle),
            fanRadius);
    }

    private createRandomBalls() {
        let colors: string[] = this._settings.Balls.colors || ['blue', 'green', 'red', 'black', 'white'];

        for (var i = 0; i < this._settings.Balls.count; i++) {
            let mass = MathEx.random(this._settings.Balls.minSize, this._settings.Balls.maxSize);
            //mass = 4;
            let radius = mass * 5;
            let color = MathEx.random(colors);
            //color = "blue";
            let startY = this.world.viewport.topOffset(radius);
            let ball = new Ball(
                radius,
                color,
                new Vector(MathEx.random(radius, this.width - radius * 2), startY),
                new Vector(MathEx.random(0, 5), 0),
                new Vector(0, 0.00),
                mass * mass,
                50,
                this.gravity.gravityConst,
                this.world,
                this.addBallToRemove);

            ball.addUniversalForce(this.gravity);
            ball.addUniversalForce(this.friction);
            ball.frictionCoeffecient = this._settings.Balls.frictionCoeffecient * (ball.radius * ball.radius / 2);
            this.balls[i] = ball;
            this.world.addCharacter(ball);
        }
    }

    private removeBall(ball: Ball) {
        this.world.removeCharacter(ball);
        let index = this.balls.indexOf(ball);

        if (index >= 0)
            this.balls.splice(index, 1);
    }

    private addBallToRemove = (ball: Ball) => this.ballsToRemove.push(ball);

    private processBallsToRemove() {
        this.ballsToRemove.forEach(ball => this.removeBall(ball), this);
        this.ballsToRemove = [];
    }

    private updateViewport() {
        const world = this.world;

        if (this._settings.Viewport.movement === "Horizontal") {
            if (!world.moveViewportHorizontal(this.viewportDeltaX)) {
                this.viewportDeltaX = -this.viewportDeltaX;
            }
        }
        else if (this._settings.Viewport.movement === "Vertical") {
            if (!world.moveViewportVertical(this.viewportDeltaY)) {
                this.viewportDeltaY = -this.viewportDeltaY;
            }
        }
        else if (this._settings.Viewport.movement === "Rotate") {
            world.centerViewportAt(this.radar.armPos.x, this.radar.armPos.y);
        }
    }

    private createBackgroundGradient() {
        const ctx = this.ctx;
        const world = this.world;
        const viewport = world.viewport;
        const center = world.center;

        viewport.applyTransform();

        this.backgroundOffset += this.backgroundDelta;

        if (this.backgroundOffset < 0.6) {
            this.backgroundOffset = 0.6;
            this.backgroundDelta = -this.backgroundDelta;
        }

        if (this.backgroundOffset > 1) {
            this.backgroundOffset = 1;
            this.backgroundDelta = -this.backgroundDelta;
        }

        //this.backgroundGradient = ctx.createLinearGradient(0, 0, world.width, world.height);
        this.backgroundGradient = ctx.createRadialGradient(center.x, center.y, 2, center.x, center.y, world.width / 2);
        this.backgroundGradient.addColorStop(0, this.backColorStart);
        this.backgroundGradient.addColorStop(this.backgroundOffset, this.backColorEnd);
        //this.backgroundGradient.addColorStop(1, this.paintedBackStart);

        viewport.restoreTransform();
    }

    private paintBackground() {
        const ctx = this.ctx;
        const world = this.world;
        const viewport = world.viewport;
        const center = world.center;

        viewport.applyTransform();

        ctx.fillStyle = this.backgroundGradient;
        let bounds: IBounds = viewport;
        ctx.beginPath();
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
        ctx.closePath();

        ctx.beginPath();
        bounds = world.inflate(-15, -15);
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        ctx.closePath();

        viewport.restoreTransform();
    }

    private updateFan(fan: Wind, settings: Dynamic) {
        const world = this.world;

        let fanPos = settings.position;
        let fanAngle = settings.angle;
        let fanRadius = settings.strength;

        fan.position.y = world.offsetAbove(world.minY, world.height * fanPos);
        fan.degrees = world.localizeDegrees(fanAngle);
        fan.strength = fanRadius;
    }

    private paintRadarAngle() {
        const ctx = this.ctx;
        const viewport = this.world.viewport;

        ctx.save();
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.textAlign = "center";
        let [radarX, radarY] = viewport.toScreen(this.radar.position.x, this.radar.position.y);
        ctx.fillText(this.radar.degrees.toFixed(0).toString(), radarX, radarY);
        ctx.restore();
    }

    public update(frame: number, timestamp: DOMHighResTimeStamp, delta: number): void {
        this.updateViewport();
        this.createBackgroundGradient();
        this.liquid.position.x = this.radar.armPos.x - this.liquid.bounds.width / 2;
        this.liquid.position.y = this.radar.armPos.y - this.liquid.bounds.height / 2;

        if (this.balls.length === 0)
            this.createRandomBalls();

        this.world.update(frame, timestamp, delta);
        this.processBallsToRemove();
    }

    public render(frame: number): void {
        this.paintBackground();
        this.paintRadarAngle();

        const world = this.world;
        const viewport = world.viewport;

        this.world.render(frame);

        if (this.balls.length === 0) return;

        //let ball = this.balls[0];

        this.output.innerHTML = "(" + this.canvasMouse.x + ", " + this.canvasMouse.y + ") <br/>" +
            "world: " + world + "<br/>" +
            "viewport: " + viewport + "<br/>" +
            "viewport top: " + viewport.top.toFixed(0) + "<br/>" +
            "viewport bottom: " + viewport.bottom.toFixed(0) + "<br/>" +
            "viewport height: " + viewport.height.toFixed(0) + "<br/>" +
            //"position: " + ball.position.toString() + "<br/>" +
            //"acceleration: " + ball.acceleration.toString() + "<br/>" +
            //"velocity: " + ball.velocity.toString() + "<br/>" +
            //"velocity mag: " + ball.velocity.mag.toFixed(3) + "<br/>" +
            //"velocity radians: " + ball.velocity.radians.toFixed(3) + "<br/>" +
            //"velocity angle: " + ball.velocity.degrees.toFixed(1) + "<br/>" +
            //"rotate velocity: " + ball.rotateVelocity.toFixed(2) + "<br/>" +
            "gravity: " + this.gravity.gravityConst.toFixed(3) + "<br/>" +
            "";
    }

    public stop() {

    }
}   
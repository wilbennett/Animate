class TestBallPhysics {
    private _ctx: CanvasRenderingContext2D;
    private _rafHandle = -1;

    private _worldZeroGU: World2D;
    private _worldZeroGD: World2D;

    private _worldGravityU: World2D;
    private _worldGravityD: World2D;

    constructor(private readonly _canvas: HTMLCanvasElement, private _settings: Dynamic) {
        this._ctx = <CanvasRenderingContext2D>this._canvas.getContext("2d");

        let box = new TestBox(10, 10, 40, 200, 10);

        let radius = 15;
        let ballColor = "blue";

        this._worldZeroGU = new World2D(this._ctx, WorldOrientation.Up, 0, 0, box.w, box.h, box.x, box.y);
        let world = this._worldZeroGU;
        world.setGravity(0);
        let ball = this.createBall(world, world.center.x, radius, ballColor);

        box.moveDown();
        this._worldZeroGD = new World2D(this._ctx, WorldOrientation.Down, 0, 0, box.w, box.h, box.x, box.y);
        world = this._worldZeroGD;
        world.setGravity(0);
        ball = this.createBall(world, world.center.x, radius, ballColor);

        box.moveUpRight();
        box = new TestBox(box.x, box.y, 100, 200, 10);
        this._worldGravityU = new World2D(this._ctx, WorldOrientation.Up, 0, 0, box.w, box.h, box.x, box.y);
        world = this._worldGravityU;
        ball = this.createBall(world, world.center.x, radius, ballColor);

        box.moveDown();
        this._worldGravityD = new World2D(this._ctx, WorldOrientation.Down, 0, 0, box.w, box.h, box.x, box.y);
        world = this._worldGravityD;
        ball = this.createBall(world, world.center.x, radius, ballColor);
    }

    setup() {
        this._rafHandle = requestAnimationFrame(this.gameLoop);
    }

    stop() {

    }

    public handleSettingsChanged() {
        this.cancelFrame();
    }

    private cancelFrame() {
        cancelAnimationFrame(this._rafHandle);
    }

    private createBall(world: World2D, x: number, radius: number, color: string, restitution?: number) {
        let mass = radius * 5;

        let ball = new Ball(
            radius,
            color,
            new Vector2D(x, world.topOffsetBelow(radius)),
            new Vector2D(0, 0),
            mass,
            world.containerBounds,
            ball => {
                world.removeCharacter(ball);
                this.createBall(world, x, radius < 30 ? radius + 5 : 10, color, restitution);
            },
            restitution);

        world.addCharacter(ball);
        return ball;
    }

    private drawBallForce(viewport: Viewport2D, ball: Ball) {
        let ctx = viewport.ctx;
        //viewport.applyTransform();

        let position = viewport.toScreen(ball.position);
        ball.calculateForce();
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(ball.force.toString(), position.x, position.y);
        //ctx.fillText(ball.momentum.toString(), position.x, position.y - 20);

        //viewport.restoreTransform();
    }

    private testBall(world: World2D, now: number) {
        const ctx = this._ctx;

        world.viewport.draw(ctx, 2, "white");
        world.update(0, now, 1);
        world.render(0);

        world.characters.forEach(character => {
            if (character instanceof Ball)
                this.drawBallForce(world.viewport, character);
        });
    }

    private gameLoop = (now: DOMHighResTimeStamp) => {
        const ctx = this._ctx;
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this.testBall(this._worldZeroGU, now);
        this.testBall(this._worldZeroGD, now);

        this.testBall(this._worldGravityU, now);
        this.testBall(this._worldGravityD, now);

        this._rafHandle = requestAnimationFrame(this.gameLoop);
    }
}

var ballApp: TestBallPhysics;

var startApp = function () {
    if (ballApp) {
        ballApp.stop();
    }

    settings = new CustomEventTarget();
    settings.addEventListener('change', handleSettingsChanged);

    loadSettings();
    let list = <HTMLUListElement>document.getElementById("list");

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    canvas.width = Math.max(window.innerWidth - 20, 300);
    canvas.height = 480;
    ballApp = new TestBallPhysics(canvas, settings);
    ballApp.setup();
}

window.onload = e => {
    attachSettingHandlers();
    startApp();
}

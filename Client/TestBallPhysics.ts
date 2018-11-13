class TestBallPhysics {
    private _ctx: CanvasRenderingContext2D;
    private _rafHandle = -1;

    private _worldU: World2D;

    private _worldD: World2D;

    constructor(private readonly _canvas: HTMLCanvasElement, private _settings: Dynamic) {
        this._ctx = <CanvasRenderingContext2D>this._canvas.getContext("2d");

        let box = new TestBox(10, 10, 100, 200, 10);

        let radius = 10;
        let ballColor = "blue";

        this._worldU = new World2D(WorldOrientation.Up, 0, 0, box.w, box.h, box.x, box.y);
        //this._worldU.setGravity(0);
        let ball = this.createBall(radius, ballColor, this._worldU);
        ball.addUniversalForce(new Friction());
        ball.frictionCoeffecient = ball.mass * 0.01;

        box.moveDown();
        this._worldD = new World2D(WorldOrientation.Down, 0, 0, box.w, box.h, box.x, box.y);
        this._worldD.setGravity(0);
        ball = this.createBall(radius, ballColor, this._worldD);
        ball.addUniversalForce(new Friction());
        ball.frictionCoeffecient = ball.mass * 0.01;
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

    private createBall(radius: number, color: string, world: World2D) {
        let mass = radius * 1;

        let ball = new Ball(
            radius,
            color,
            new Vector2D(world.center.x, world.topOffsetBelow(radius + 5)),
            new Vector2D(0, 0),
            Vector2D.emptyVector,
            mass,
            1500,
            world.gravity.gravityConst,
            world.containerBounds,
            ball => {
                world.removeCharacter(ball);
                this.createBall(radius, color, world);
            });

        ball.addUniversalForce(world.gravity);
        world.addCharacter(ball);
        return ball;
    }

    private testBall(world: World2D, now: number) {
        const ctx = this._ctx;

        world.viewport.draw(ctx, 2, "white");
        world.update(0, now, 1);
        world.render(ctx, 0);
    }

    private gameLoop = (now: DOMHighResTimeStamp) => {
        const ctx = this._ctx;
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this.testBall(this._worldU, now);
        this.testBall(this._worldD, now);

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

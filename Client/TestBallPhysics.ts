class TestBallPhysics {
    private _ctx: CanvasRenderingContext2D;
    private _rafHandle = -1;

    private _worldZeroGU: World2D;

    private _worldZeroGD: World2D;

    constructor(private readonly _canvas: HTMLCanvasElement, private _settings: Dynamic) {
        this._ctx = <CanvasRenderingContext2D>this._canvas.getContext("2d");

        let box = new TestBox(10, 10, 40, 200, 10);

        let radius = 10;
        let ballColor = "blue";

        this._worldZeroGU = new World2D(WorldOrientation.Up, 0, 0, box.w, box.h, box.x, box.y);
        this._worldZeroGU.setGravity(0);
        let ball = this.createBall(this._worldZeroGU.center.x, radius, ballColor, this._worldZeroGU);

        box.moveDown();
        this._worldZeroGD = new World2D(WorldOrientation.Down, 0, 0, box.w, box.h, box.x, box.y);
        this._worldZeroGD.setGravity(0);
        ball = this.createBall(this._worldZeroGD.center.x, radius, ballColor, this._worldZeroGD);

        box.moveUpRight();
        box = new TestBox(box.x, box.y, 40, 200, 10);
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

    private createBall(x: number, radius: number, color: string, world: World2D) {
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
                this.createBall(x, radius < 30 ? radius + 5 : 10, color, world);
            });

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

        this.testBall(this._worldZeroGU, now);
        this.testBall(this._worldZeroGD, now);

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

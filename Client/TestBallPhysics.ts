class TestBallPhysics {
    private _ctx: CanvasRenderingContext2D;
    private _rafHandle = -1;

    private _worldU: World2D;
    private _gravityU: Gravity;

    private _worldD: World2D;
    private _gravityD: Gravity;

    constructor(private readonly _canvas: HTMLCanvasElement, private _settings: Dynamic) {
        this._ctx = <CanvasRenderingContext2D>this._canvas.getContext("2d");

        let box = new TestBox(10, 10, 100, 200, 10);

        let radius = 10;
        let ballColor = "blue";

        this._gravityU = new Gravity(WorldOrientation.Up, 0.3);
        this._worldU = new World2D(WorldOrientation.Up, 0, 0, box.w, box.h, box.x, box.y);
        this.createBall(radius, ballColor, this._worldU, this._gravityU);

        box.moveDown();
        this._gravityD = new Gravity(WorldOrientation.Down, 0.3);
        this._worldD = new World2D(WorldOrientation.Down, 0, 0, box.w, box.h, box.x, box.y);
        this.createBall(radius, ballColor, this._worldD, this._gravityD);
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

    private createBall(radius: number, color: string, world: World2D, gravity: Gravity) {
        let mass = radius * 5;
        mass *= mass;

        let ball = new Ball(
            radius,
            color,
            new Vector2D(world.center.x, world.topOffsetBelow(radius)),
            new Vector2D(MathEx.random(0, 5), 0),
            Vector2D.emptyVector,
            mass,
            50,
            gravity.gravityConst,
            world.containerBounds,
            ball => { });

        world.addCharacter(ball);
    }

    private testBall(world: World2D) {
        const ctx = this._ctx;

        world.viewport.draw(ctx, 2, "white");
        world.render(ctx, 0);
    }

    private gameLoop = (timestamp: DOMHighResTimeStamp) => {
        this.testBall(this._worldU);
        this.testBall(this._worldD);

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

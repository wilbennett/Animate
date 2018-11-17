class WorldInfo {
    pendingBallsToAdd: Ball[] = [];
}

class BallInfo {
    maxVelocity: Vector2D = Vector2D.emptyVector;
}

class TestBallPhysics {
    private _ctx: CanvasRenderingContext2D;
    private _rafHandle = -1;
    private _priorNow: number;

    private _worldZeroGU: World2D;
    private _worldZeroGD: World2D;

    private _worldGravityU: World2D;
    private _worldGravityD: World2D;

    private _worldLiquidU: World2D;
    private _worldLiquidD: World2D;

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

        box.moveUpRight();
        this._worldLiquidU = new World2D(this._ctx, WorldOrientation.Up, 0, 0, box.w, box.h, box.x, box.y);
        world = this._worldLiquidU;
        world.tag = new WorldInfo();
        ball = this.createBall(world, world.center.x, radius, ballColor);
        this.createBall(world, world.x + 5, 10, ballColor, false);
        let drag = 500.4;
        let liquidHeight = world.height / 3;
        let liquid = new Fluid(new Vector2D(world.x, world.offsetBelow(world.center.y, liquidHeight * 0.5)), 2, drag, world.width, liquidHeight);
        world.addForce(liquid);
        world.addCharacter(liquid);

        box.moveDown();
        this._worldLiquidD = new World2D(this._ctx, WorldOrientation.Down, 0, 0, box.w, box.h, box.x, box.y);
        world = this._worldLiquidD;
        world.tag = new WorldInfo();
        ball = this.createBall(world, world.center.x, radius, ballColor);
        this.createBall(world, world.x + 5, 10, ballColor, false);
        liquid = new Fluid(new Vector2D(world.x, world.offsetAbove(world.center.y, liquidHeight * 0.5)), 2, drag, world.width, liquidHeight);
        world.addForce(liquid);
        world.addCharacter(liquid);
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

    private createBall(world: World2D, x: number, radius: number, color: string, autoSize: boolean = true, restitution?: number) {
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
                this.createBall(world, x, autoSize && radius < 30 ? radius + 5 : 10, color, autoSize, restitution);
            },
            restitution);

        ball.tag = new BallInfo();

        if (!world.tag) {
            world.addCharacter(ball);
        }
        else {
            let tag = <WorldInfo>world.tag;
            tag.pendingBallsToAdd.push(ball);
            let haveBall = world.characters.some(character => character instanceof Ball);

            if (!haveBall) {
                tag.pendingBallsToAdd.forEach(b => world.addCharacter(b));
                tag.pendingBallsToAdd = [];
            }
        }

        return ball;
    }

    private drawBallForce(viewport: Viewport2D, ball: Ball) {
        let ctx = viewport.ctx;

        let position = viewport.toScreen(ball.position);
        ball.calculateForce();
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        //ctx.fillText(ball.force.toString(), position.x, position.y);
        ctx.fillText(ball.velocity.toString(), position.x, position.y - 20);
    }

    private testBall(world: World2D, now: number, elapsedTime: number) {
        const ctx = this._ctx;

        world.viewport.draw(ctx, 2, "white");
        world.update(0, now, elapsedTime, elapsedTime);
        world.render(0);

        world.characters.forEach(character => {
            if (character instanceof Ball) {
                let tag = <BallInfo>character.tag;

                //if (character.velocity.y > 0)
                {
                    if (character.velocity.mag > tag.maxVelocity.mag) {
                        //console.log("Ball max velocity: " + character.velocity.toString() +
                        //    " diff: " + character.velocity.subtract(tag.maxVelocity).toString());
                        tag.maxVelocity = character.velocity;
                    }
                }

                this.drawBallForce(world.viewport, character);
            }
        });
    }

    private gameLoop = (now: DOMHighResTimeStamp) => {
        const ctx = this._ctx;
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        now = now / 1000;

        if (!this._priorNow)
            this._priorNow = now;

        let elapsedTime = now - this._priorNow;
        this._priorNow = now;

        this.testBall(this._worldZeroGU, now, elapsedTime);
        this.testBall(this._worldZeroGD, now, elapsedTime);

        this.testBall(this._worldGravityU, now, elapsedTime);
        this.testBall(this._worldGravityD, now, elapsedTime);

        this.testBall(this._worldLiquidU, now, elapsedTime);
        this.testBall(this._worldLiquidD, now, elapsedTime);

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

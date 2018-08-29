interface IBounds {
    orientation: WorldOrientation;
    x: number;
    y: number;
    width: number;
    height: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
    centerX: number;
    centerY: number;
    center: Vector;
    minX: number;
    minY: number;
    boundsArray: number[];

    leftOffset(x: number): number;
    rightOffset(x: number): number;
    topOffset(y: number): number;
    bottomOffset(y: number): number;

    offsetAbove(y: number, delta: number): number;
    offsetBelow(y: number, delta: number): number;

    leftPenetration(x: number): number;
    rightPenetration(x: number): number;
    topPenetration(y: number): number;
    bottomPenetration(y: number): number;

    isUp(y: number): boolean;
    isDown(y: number): boolean;

    toWorld(x: number, y: number): number[];
    toScreen(x: number, y: number): number[];

    inflate(dx: number, dy: number): IBounds;
}

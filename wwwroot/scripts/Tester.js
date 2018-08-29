var Tester = /** @class */ (function () {
    function Tester(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.height = this.canvas.height;
        this.width = this.canvas.width;
        this.canvasMouse = new MouseTracker(this.canvas);
        this.coord = document.getElementById("coord");
    }
    Tester.prototype.render = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        var point = new Point(this.canvasMouse.x, this.canvasMouse.y);
        point.draw(this.ctx, 50, 'blue');
        this.coord.innerHTML = this.canvasMouse.x + ', ' + this.canvasMouse.y;
    };
    return Tester;
}());
//# sourceMappingURL=Tester.js.map

class MouseTracker {
    private element: HTMLElement;
    public x: number;
    public y: number;

    constructor(_element: HTMLElement) {
        this.element = _element;

        this.element.addEventListener("mousemove", (ev) => {
            this.x = ev.pageX - _element.offsetLeft;
            this.y = ev.pageY - _element.offsetTop;
        });
    }
}

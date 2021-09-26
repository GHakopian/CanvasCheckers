export default class Drawable {
    public X:number = 0;
    public Y:number = 0;
    public Width: number = 0;
    public Height: number = 0;

    protected renderingContext:CanvasRenderingContext2D;

	constructor(renderingContext:CanvasRenderingContext2D) {
        this.renderingContext = renderingContext;
	}

    public IntersectsWithPoint(x:number, y:number) {
        return (x >= this.X && x <= this.X + this.Width && y >= this.Y && y <= this.Y + this.Height);
    }
}
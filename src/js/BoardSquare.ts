import Drawable from "./Drawable";

export default class BoardSquare extends Drawable {
    public IsDark:boolean;
    public PositionLabel:string;
    public HighlightColor:string = "#00FF00";
    public HighlightOpacity:number = 0;
    public XIndex:number;
    public YIndex:number;

    private currentHighlightOpacity:number = 0;
	constructor(renderingContext:CanvasRenderingContext2D) {
        super(renderingContext);
		this.Width = 100;
		this.Height = 100;
	}

	public Update():void {
		this.Draw();
	}

	private Draw(): void {
		this.renderingContext.fillStyle =  this.IsDark ? "#111" : "#AAA";
        this.renderingContext.fillRect(this.X, this.Y, this.Width, this.Height);
        this.currentHighlightOpacity += (this.HighlightOpacity - this.currentHighlightOpacity)/3;
        this.renderingContext.fillStyle =  (this.HighlightColor+Math.round(this.currentHighlightOpacity));
        this.renderingContext.fillRect(this.X, this.Y, this.Width, this.Height);    
	}
}
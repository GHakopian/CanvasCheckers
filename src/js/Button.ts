import Drawable from "./Drawable";

export default class Button extends Drawable {
	public Label:string = "";
	public OnButtonPress: () => void;
	private IsDown:boolean;
	private HighlightOpacity:number = 99;
    private currentHighlightOpacity:number = 0;

	constructor(renderingContext:CanvasRenderingContext2D) {
        super(renderingContext);
		this.Width = 200;
		this.Height = 40;
	}

	public OnUp(x:number, y :number): void {
		if(this.IntersectsWithPoint(x,y)){
			this.IsDown = false;
			this.HighlightOpacity = 60;
			if(this.OnButtonPress) {
				this.OnButtonPress();
			}
		}
	}

	public OnDown(x:number, y :number): void {
		if(this.IntersectsWithPoint(x,y)){
			this.IsDown = true;
			this.HighlightOpacity = 99;
		}
	}

	public OnMove(x:number, y :number): void {
		if(this.IntersectsWithPoint(x,y)){
			this.HighlightOpacity = 60;
		}else{
			this.HighlightOpacity = 0;
		}
	}

	public Update():void {
		this.Draw();
	}

	private Draw(): void {
        this.renderingContext.fillStyle = "#1111AA";
        this.renderingContext.fillRect(this.X, this.Y, this.Width, this.Height);
		this.currentHighlightOpacity += (this.HighlightOpacity - this.currentHighlightOpacity)/4;
        this.renderingContext.fillStyle = ("#444FFF"+Math.round(this.currentHighlightOpacity));
        this.renderingContext.fillRect(this.X, this.Y, this.Width, this.Height);
		this.renderingContext.fillStyle = "white";
		this.renderingContext.font = "30px Arial";
		this.renderingContext.fillText(this.Label, this.X+8, this.Y+30);
	}
}
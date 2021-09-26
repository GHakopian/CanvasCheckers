import Button from "./Button";
import Drawable from "./Drawable";

export default class StartMenu extends Drawable {
    public StartGameButton:Button;
	public IsHidden:boolean = false;
	
    private menuX:number = 0;
    private menuY:number = 0; 

	constructor(renderingContext:CanvasRenderingContext2D) {
        super(renderingContext);

        this.StartGameButton = new Button(renderingContext);
        this.StartGameButton.Label = "Start Game";

		this.Width = 100;
		this.Height = 100;
	}

	public OnUp(x:number, y :number): void {
		if(this.IsHidden){return;}
		this.StartGameButton.OnUp(x,y);
	}

	public OnDown(x:number, y :number): void {
		if(this.IsHidden){return;}
        this.StartGameButton.OnDown(x,y);
	}

	public OnMove(x:number, y :number): void {
		if(this.IsHidden){return;}
        this.StartGameButton.OnMove(x,y);
	}

	public Update():void {
        this.Width = window.innerWidth;
        this.Height = window.innerHeight;
        this.menuX = window.innerWidth / 2 - 110;
        this.menuY = window.innerHeight / 2 - 150;
		if(!this.IsHidden) {
			this.Draw();
			this.StartGameButton.X = this.menuX+10;
			this.StartGameButton.Y = this.menuY+10;
			this.StartGameButton.Update();
		}
	}

	private Draw(): void {
		this.renderingContext.fillStyle =  "#333333";
        this.renderingContext.fillRect(this.X, this.Y, this.Width, this.Height);
		this.renderingContext.fillStyle =  "#000000BB";
        this.renderingContext.fillRect(this.menuX, this.menuY, 220, 100);
	}
}
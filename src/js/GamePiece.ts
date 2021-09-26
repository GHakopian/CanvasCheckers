import BoardSquare from "./BoardSquare";
import Drawable from "./Drawable";

export default class GamePiece extends Drawable {
	public Color: string = "red";
	public Owner: string = "";
	public CurrentBoardSquare: BoardSquare;
	private IsHighlighted: boolean = false;
	public IsDragging: boolean = false;

	constructor(renderingContext: CanvasRenderingContext2D) {
		super(renderingContext);
		this.Width = 80;
		this.Height = 80;
	}

	public OnUp(): void {
		this.IsDragging = false;
	}

	public OnDown(x:number, y :number): void {
		if (this.IntersectsWithPoint(x, y)) {
			this.CenterToPoint(x, y);
			this.IsDragging = true;
		}
	}

	public OnMove(x:number, y :number): void {
		if (this.IntersectsWithPoint(x, y)) {
			this.IsHighlighted = true;
		} else {
			this.IsHighlighted = false;
		}

		if (this.IsDragging) {
			this.CenterToPoint(x, y);
		}
	}

	public Update(): void {
		if (this.CurrentBoardSquare) {
			if (!this.IsDragging) {
				// animate to position
				let destinationX = (this.CurrentBoardSquare.X + this.CurrentBoardSquare.Width / 2) - this.Width / 2;
				let destinationY = (this.CurrentBoardSquare.Y + this.CurrentBoardSquare.Width / 2) - this.Height / 2;
				this.X += (destinationX - this.X)/3;
				this.Y += (destinationY - this.Y)/3;
			}
		}
		this.Draw();
	}

	private CenterToPoint(x: number, y: number) {
		this.X += ((x - this.Width / 2) - this.X)/2;
		this.Y += ((y - this.Height / 2) - this.Y)/2;
	}

	private Draw(): void {
		this.renderingContext.beginPath();
		this.renderingContext.ellipse(this.X + this.Width / 2, this.Y + this.Height / 2, this.Width / 2, this.Height / 2, 0, 0, 2 * Math.PI);
		this.renderingContext.fillStyle = this.Color;
		this.renderingContext.fill();
		if (this.IsHighlighted) {
			this.renderingContext.lineWidth = 2;
			this.renderingContext.strokeStyle = "yellow";
		} else {
			this.renderingContext.lineWidth = 1;
			this.renderingContext.strokeStyle = "white";
		}
		this.renderingContext.stroke();
	}
}
import BoardSquare from "./BoardSquare";
import Drawable from "./Drawable";
import Move from "./Move";

export default class Board extends Drawable {
	private boardSquares: BoardSquare[][];
	private positionLabels: string[] = ["A", "B", "C", "D", "E", "F", "G", "H"];

	constructor(renderingContext: CanvasRenderingContext2D) {
		super(renderingContext);
		this.Width = 1000;
		this.Height = 1000;
	}

	public init() {
		this.boardSquares = [];
		for (let i = 0; i < 8; i++) {
			this.boardSquares[i] = [];
			for (let j = 0; j < 8; j++) {
				let square = new BoardSquare(this.renderingContext);
				square.Width = (this.Width - 50) / 8;
				square.Height = (this.Height - 50) / 8;
				square.PositionLabel = this.positionLabels[i] + (8 - j);
				square.X = this.X + 25 + i * square.Width;
				square.Y = this.Y + 25 + j * square.Height;
				square.XIndex = i;
				square.YIndex = j;
				square.IsDark = (i + j) % 2 === 1;
				this.boardSquares[i][j] = (square);
			}
		}
	}

	public GetSquareSize():number{
		return this.boardSquares[0][0] ? this.boardSquares[0][0].Width : 0;
	}

	public GetDistanceInSquares(fromSquare: BoardSquare, toSquare: BoardSquare): number {
		let distance = fromSquare.XIndex - toSquare.XIndex;
		if (distance < 0) { distance *= -1; }
		return distance;
	}

	public GetDiagonalSquaresFromSquare(startSquare: BoardSquare) {
		let adjacentSquares = [];

		let yOffset = startSquare.YIndex - startSquare.XIndex;
		let endIndex = 8; // todo, come up with a formula to get the total number of diagonal squares
		for (let i = 0; i < endIndex; i++) {
			let square = this.boardSquares[i][i + yOffset];
			if (square) {
				adjacentSquares.push(square);
			}
		}

		let startIndex = startSquare.YIndex + startSquare.XIndex;
		endIndex = startSquare.YIndex - (8 - startSquare.XIndex);
		for (let i = startIndex; i > endIndex; i--) {
			let xIndex = i - startIndex === 0 ? i - startIndex : (i - startIndex) * -1;
			let square = this.boardSquares[xIndex][i];
			if (square) {
				adjacentSquares.push(square);
			}
		}
		return adjacentSquares;
	}

	public ClearHighlights() {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				let square = this.boardSquares[i][j];
				square.HighlightColor = "#00FF00";
				square.HighlightOpacity = 0;
			}
		}
	}

	public HighlightMoves(moves: Move[]) {
		for (let i = 0; i < moves.length; i++) {
			if(moves[i].TargetedPiece){
				moves[i].TargetedPiece.CurrentBoardSquare.HighlightColor = "#ff9b00";
				moves[i].TargetedPiece.CurrentBoardSquare.HighlightOpacity = 99;
			}else{
				moves[i].ToSquare.HighlightColor = "#00FF00";
			}
			moves[i].ToSquare.HighlightOpacity = 99;
		}
	}

	public GetBoardSquareByPositionLabel(positionLabel: string): BoardSquare {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				let square = this.boardSquares[i][j];
				if (square.PositionLabel === positionLabel) {
					return square;
				}
			}
		}
	}

	public GetBoardSquareFromPoint(x: number, y: number): BoardSquare {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				let square = this.boardSquares[i][j];
				if (square.IntersectsWithPoint(x, y)) {
					return square;
				}
			}
		}
	}

	public Update(): void {
		this.Draw();

		if (this.boardSquares) {
			for (let i = 0; i < 8; i++) {
				for (let j = 0; j < 8; j++) {
					let square = this.boardSquares[i][j];
					square.X = this.X + 25 + i * square.Width;
					square.Y = this.Y + 25 + j * square.Width;
					square.Update();
				}
			}
		}
	}

	private Draw(): void {
		var gradient = this.renderingContext.createLinearGradient(111, 112, 150, 0);
		gradient.addColorStop(0, "#333");
		gradient.addColorStop(1, "#666");
		this.renderingContext.fillStyle = gradient;
		this.renderingContext.fillRect(this.X, this.Y, this.Width, this.Height);
		this.renderingContext.fillStyle = "white";
		this.renderingContext.font = "15px Arial";

		for (let i = 0; i < this.boardSquares.length; i++) {
			for (let j = 0; j < this.boardSquares[i].length; j++) {
				let square = this.boardSquares[i][j];
				square.Width = (this.Width - 50) / 8;
				square.Height = (this.Height - 50) / 8;
				square.X = this.X + 25 + i * square.Width;
				square.Y = this.Y + 25 + j * square.Height;
			}
		}

		// drawing the position labels
		let blockWidth = (this.Width - 50) / 8;
		for (let i = 0; i < 8; i++) {
			this.renderingContext.fillText(this.positionLabels[i], this.X + 20 + (blockWidth / 2) + blockWidth * i, this.Y + this.Height - 8);
			this.renderingContext.fillText("" + (8 - i), this.X + 8, this.Y + 30 + (blockWidth / 2) + blockWidth * i);
		}
	}
}
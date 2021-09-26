import BoardSquare from "./BoardSquare";
import GamePiece from "./GamePiece";

export default class Move {
    public FromSquare:BoardSquare;
    public ToSquare:BoardSquare;
    public TargetedPiece:GamePiece;
    public IsStrikingMove:boolean;
    public Player:string;
    
	constructor() {

	}
}
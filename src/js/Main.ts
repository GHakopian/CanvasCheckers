import Board from "./Board";
import BoardSquare from "./BoardSquare";
import GamePiece from "./GamePiece";
import StartMenu from "./StartMenu";
import Move from "./Move";

export default class Game {
    private canvas: HTMLCanvasElement;
    private renderingContext: CanvasRenderingContext2D;
    private board: Board;
    private startMenu:StartMenu;
    private gamePieces: GamePiece[] = [];
    private LegalMovesForCurrentPlayer: Move[] = [];
    private currentTurn: string = "Player1";

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.style.background = "grey";
        this.canvas.onmousemove = this.OnMouseMove;
        this.canvas.ontouchmove = this.OnTouchMove;
        this.canvas.onmousedown = this.OnMouseDown;
        this.canvas.ontouchstart = this.OnTouchDown;
        this.canvas.onmouseup = this.OnMouseUp;
        this.canvas.ontouchend = this.OnTouchUp;
        this.canvas.ontouchcancel = this.OnTouchUp;
        this.renderingContext = this.canvas.getContext("2d");
        this.board = new Board(this.renderingContext);
        this.board.init();
        this.startMenu = new StartMenu(this.renderingContext);
        this.startMenu.StartGameButton.OnButtonPress = this.StartGame;

    }

    public StartGame = () => {
        this.AddGamePieces([
            "B8", "D8", "F8", "H8",
            "A7", "C7", "E7", "G7",
            "B6", "D6", "F6", "H6",
        ], "red", "Player2");

        this.AddGamePieces([
            "A3", "C3", "E3", "G3",
            "B2", "D2", "F2", "H2",
            "A1", "C1", "E1", "G1",
        ], "blue", "Player1");
        this.startMenu.IsHidden = true;
    }

    private AddGamePieces(positionLabels: string[], color: string, owner: string) {
        for (let i = 0; i < positionLabels.length; i++) {
            let gamePiece = new GamePiece(this.renderingContext);
            gamePiece.Color = color;
            gamePiece.Owner = owner;
            let square = this.board.GetBoardSquareByPositionLabel(positionLabels[i]);
            gamePiece.CurrentBoardSquare = square;
            this.gamePieces.push(gamePiece);
        }
    }

    public MovePieceToTop(piece: GamePiece): void {
        this.gamePieces.splice(this.gamePieces.indexOf(piece), 1);
        this.gamePieces.push(piece);
    }

    public GetLegalMoves(squares: BoardSquare[], currentPiece: GamePiece): Move[] {
        let legalMoves: Move[] = [];
        let friendlyPieces = this.gamePieces.filter((p: GamePiece) => p.Owner === currentPiece.Owner);
        let enemyPieces = this.gamePieces.filter((p: GamePiece) => p.Owner !== currentPiece.Owner);
        let canStrike = false;

        for (let i = 0; i < squares.length; i++) {
            let square = squares[i];
            if (this.board.GetDistanceInSquares(currentPiece.CurrentBoardSquare, square) < 2) {
                let friendlyPiece = friendlyPieces.find((p: GamePiece) => p.CurrentBoardSquare === square);
                if (friendlyPiece) { continue; }
                let enemyPiece = enemyPieces.find((p: GamePiece) => p.CurrentBoardSquare === square);
                if (enemyPiece) {
                    let xIndex = currentPiece.CurrentBoardSquare.XIndex - enemyPiece.CurrentBoardSquare.XIndex;
                    let yIndex = currentPiece.CurrentBoardSquare.YIndex - enemyPiece.CurrentBoardSquare.YIndex;
                    let strikingSquare = squares.find((s: BoardSquare) => s.XIndex === enemyPiece.CurrentBoardSquare.XIndex - xIndex && s.YIndex === enemyPiece.CurrentBoardSquare.YIndex - yIndex);
                    if (strikingSquare) {
                        let piece = this.gamePieces.find((p: GamePiece) => p.CurrentBoardSquare === strikingSquare);
                        if (!piece) {
                            let move = {
                                FromSquare: currentPiece.CurrentBoardSquare,
                                Player: currentPiece.Owner,
                                TargetedPiece: enemyPiece,
                                ToSquare: strikingSquare,
                                IsStrikingMove: true
                            } as Move;
                            legalMoves.push(move);
                            canStrike = true;
                        }
                    }
                    continue;
                }

                let move = {
                    FromSquare: currentPiece.CurrentBoardSquare,
                    Player: currentPiece.Owner,
                    ToSquare: square
                } as Move;

                // filter out backwards moves that are not striking moves
                if (move.Player === "Player1") {
                    if (move.ToSquare.YIndex < move.FromSquare.YIndex) {
                        legalMoves.push(move);
                    }
                }
                if (move.Player === "Player2") {
                    if (move.ToSquare.YIndex > move.FromSquare.YIndex) {
                        legalMoves.push(move);
                    }
                }
            }
        }

        if (legalMoves.find((m: Move) => m.IsStrikingMove)) {
            legalMoves = legalMoves.filter((m: Move) => m.IsStrikingMove);
        }

        return legalMoves;
    }



    public OnMouseUp = (event: MouseEvent) => {
        this.handleOnUpInput(event.x,event.y);
    }

    public OnTouchUp = (event: TouchEvent) => {
        if(event.changedTouches && event.changedTouches.length > 0) {
            this.handleOnUpInput(event.changedTouches[0].pageX,event.changedTouches[0].pageY);
        }
    }

    public OnMouseDown = (event: MouseEvent): void => {
        this.handleOnDownInput(event.x,event.y);
    }

    public OnTouchDown = (event: TouchEvent): void => {
        if(event.touches && event.touches.length > 0){
            this.handleOnDownInput(event.touches[0].pageX,event.touches[0].pageY);
        }
    }

    public OnMouseMove = (event: MouseEvent) => {
        this.handOnMoveInput(event.x,event.y);
    }

    public OnTouchMove = (event: TouchEvent) => {
        if(event.touches && event.touches.length > 0){
            this.handOnMoveInput(event.touches[0].pageX,event.touches[0].pageY);
        }
    }

    private handleOnUpInput(x: number, y: number){
        for (let i = 0; i < this.gamePieces.length; i++) {
            let gamePiece = this.gamePieces[i];
            if (gamePiece.IsDragging) {
                let square = this.board.GetBoardSquareFromPoint(x, y);
                if (square) {
                    let move = this.LegalMovesForCurrentPlayer.find((m: Move) => m.ToSquare === square);
                    if (move) {
                        gamePiece.CurrentBoardSquare = square;
                        if (move.IsStrikingMove && move.TargetedPiece) {
                            this.gamePieces.splice(this.gamePieces.indexOf(move.TargetedPiece), 1);
                        }
                        this.UpdateLegalMovesForCurrentPlayer();

                        if (!move.IsStrikingMove || !this.LegalMovesForCurrentPlayer.find((m: Move) => m.IsStrikingMove)) {
                            this.currentTurn = this.currentTurn === "Player1" ? "Player2" : "Player1";
                        }
                    }
                }
            }
            gamePiece.OnUp();
        }
        this.board.ClearHighlights();

        this.startMenu.OnUp(x,y);
    }

    private handleOnDownInput(x: number, y: number){
        this.UpdateLegalMovesForCurrentPlayer();
        for (let i = 0; i < this.gamePieces.length; i++) {
            let piece = this.gamePieces[i];
            if (piece.Owner !== this.currentTurn) { continue; }
            let strikingMoves = this.LegalMovesForCurrentPlayer.filter((m: Move) => m.TargetedPiece);
            if (strikingMoves && strikingMoves.length > 0) {
                if (!strikingMoves.find((m: Move) => m.FromSquare === piece.CurrentBoardSquare)) {
                    continue;
                }
            }
            piece.OnDown(x, y);
            if (piece.IsDragging) {
                let squares = this.board.GetDiagonalSquaresFromSquare(piece.CurrentBoardSquare);
                this.MovePieceToTop(piece);
                this.LegalMovesForCurrentPlayer = this.GetLegalMoves(squares, piece);
                this.board.HighlightMoves(this.LegalMovesForCurrentPlayer);
            }
        }

        this.startMenu.OnDown(x,y);
    }

    private handOnMoveInput(x: number, y: number) {
        for (let i = 0; i < this.gamePieces.length; i++) {
            let piece = this.gamePieces[i];
            if (piece.Owner !== this.currentTurn) { continue; }
            piece.OnMove(x, y);
        }
        this.startMenu.OnMove(x,y);
    }

    public UpdateLegalMovesForCurrentPlayer() {
        this.LegalMovesForCurrentPlayer = [];
        for (let i = 0; i < this.gamePieces.length; i++) {
            let piece = this.gamePieces[i];
            if (piece.Owner === this.currentTurn) {
                let squares = this.board.GetDiagonalSquaresFromSquare(piece.CurrentBoardSquare);
                this.LegalMovesForCurrentPlayer.push(...this.GetLegalMoves(squares, piece));
            }
        }
    }

    public Update(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.board.X = this.canvas.width / 2 - this.board.Width / 2;
        this.board.Y = this.canvas.height / 2 - this.board.Height / 2;
        this.board.Height = window.innerHeight / 1.2;
        this.board.Width = this.board.Height;
        this.board.Update();

        for (let i = 0; i < this.gamePieces.length; i++) {
            let piece = this.gamePieces[i];
            piece.Width = this.board.GetSquareSize() / 1.5;
            piece.Height = piece.Width;
            piece.Update();
        }

        this.startMenu.Update();
    }
}
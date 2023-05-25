import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import GameOver from "./GameOver.js";
import "../css/Chessboard.css";

function BaseChess() {
  const [game, setGame] = useState(new Chess());

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if(move === null) return false;
    return true;
  }

  function makeAMove(move) {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; 
  }
  
  return (
    <div>
      {game.isGameOver() ? 
      (<GameOver/>) :
      (
      <div class="gameboard">
          <h1 class="game-mode" id="base">Chess</h1>
          <h1 class="turn-indicator">{game.turn() === 'b' ? "Black to Move" : "White to Move"}</h1>
        <Chessboard id="chessboard" position={game.fen()} onPieceDrop={onDrop} />
      </div>)}
    </div>
  );
}

export default BaseChess;
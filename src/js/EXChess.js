import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import Meter from "./Meter.js";
import GameOver from "./GameOver.js";
import "../css/Chessboard.css";

function EXChess() {
  var curPiece;
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
    const result = buildMeter(move, gameCopy);
    
    setGame(gameCopy);
    return result; 
  }

  function buildMeter(move, gameCopy){
    const sourcePiece = gameCopy.get(move.from);

    if(sourcePiece){
      curPiece = sourcePiece.type.charAt(0);
    }
    return gameCopy.move(move);
  }
  
  return (
    <div>
      {game.isGameOver() ? 
      (<GameOver/>) :
      (
      <div class="gameboard">
            <h1 class="game-mode" id="ex">EX Chess</h1>
            <h1 class="turn-indicator">{game.turn() === 'b' ? "Black to Move" : "White to Move"}</h1>
            <Chessboard id="chessboard" position={game.fen()} onPieceDrop={onDrop} />
            {Meter(curPiece, game.turn())}
      </div>)}
    </div>
  );
}

export default EXChess;
import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import GameOver from "./GameOver.js";
import "./Chessboard.css";

function ZombieChess() {
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
    
    let result = zombieTake(move, gameCopy);

    setGame(gameCopy);
    return result; 
  }

  function pawnTake(sourcePiece, move, gameCopy){
    if(sourcePiece.color.charAt(0) === 'b'){
        gameCopy.remove(move.to);
        gameCopy.put({type: 'p', color: 'w'}, move.to);
        return gameCopy.move(move);
    }
    gameCopy.remove(move.to);
    gameCopy.put({type: 'p', color: 'b'}, move.to);
    return gameCopy.move(move);
  }

  function zombieTake(move, gameCopy){
    const sourcePiece = gameCopy.get(move.from);
    const targetPiece = gameCopy.get(move.to);

    if(sourcePiece && targetPiece && sourcePiece.color === targetPiece.color){
        if(sourcePiece.type.charAt(0) !== 'p'){
            gameCopy.remove(move.to);
            return gameCopy.move(move);
        }
        return pawnTake(sourcePiece, move, gameCopy)
    }
    return gameCopy.move(move);
  }

  return (
    <div>
      {game.isGameOver() ? 
      (<GameOver/>) :
      (
      <div class="gameboard">
          <h1 class="game-mode" id="zombie">Zombie Chess</h1>
          <h1 class="turn-indicator">{game.turn() === 'b' ? "Black to Move" : "White to Move"}</h1>
        <Chessboard id="chessboard" position={game.fen()} onPieceDrop={onDrop} />
      </div>)}
    </div>
  );
}

export default ZombieChess;
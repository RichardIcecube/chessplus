import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import GameOver from "./GameOver.js";
import "../css/Chessboard.css";

function EXChess() {
  const [game, setGame] = useState(new Chess());
  var p1meter = 230;
  var p2meter = 150;
  var p1stack = 0;
  var p2stack = 1;
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
            <h1 class="game-mode" id="ex">EX Chess</h1>
            <h1 class="turn-indicator">{game.turn() === 'b' ? "Black to Move" : "White to Move"}</h1>
            <div class="meter" id="p1-meter"/>
            <div class="meter" id="p2-meter"/>
            <div class="built-meter" id="p1-built-meter"/>
            <div class="built-meter" id="p2-built-meter"/>
            <h1 class="meter-stack" id="p1-meter-stack">0</h1>
            <h1 class="meter-stack" id="p2-meter-stack">0</h1>
            <script>
                var meter1 = document.querySelector('#p1-built-meter');
                var meter2 = document.querySelector('#p2-built-meter');
                meter1.style.width = '200px';
                meter2.style.width = '150px';
            </script>
            <Chessboard id="chessboard" position={game.fen()} onPieceDrop={onDrop} />
      </div>)}
    </div>
  );
}

export default EXChess;
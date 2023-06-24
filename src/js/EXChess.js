import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import Meter from "./Meter.js";
import GameOver from "./GameOver.js";
import "../css/Chessboard.css";

var p1meter = 0;
var p2meter = 0;
var p1stack = 0;
var p2stack = 0;

function EXChess() {
  var curPiece;

  const [game, setGame] = useState(new Chess());
  const PAWN_METER_GAIN = 5;
  const KNIGHT_METER_GAIN = 15;
  const BISHOP_METER_GAIN = 15;
  const ROOK_METER_GAIN = 20;
  const QUEEN_METER_GAIN = 25;
  const KING_METER_GAIN = 25;

  const MAX_METER = 280;
  const METER_STACK = 1;

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
    var builtMeter = 0;
    const sourcePiece = gameCopy.get(move.from);

    if(sourcePiece){
      curPiece = sourcePiece.type.charAt(0);
      switch(curPiece){
        case 'p':
            builtMeter = PAWN_METER_GAIN;
            break;
        case 'n':
            builtMeter = KNIGHT_METER_GAIN;
            break;
        case 'b':
            builtMeter = BISHOP_METER_GAIN;
            break;
        case 'r':
            builtMeter = ROOK_METER_GAIN;
            break;
        case 'q':
            builtMeter = QUEEN_METER_GAIN;
            break;
        case 'k':
            builtMeter = KING_METER_GAIN;
            break;
        default:
            break;
      }

      if(game.turn() === 'b'){
        p2meter += builtMeter;
      }
      else{
        p1meter += builtMeter;
      }

      while(p1meter >= MAX_METER){
        p1meter -= MAX_METER;  
        p1stack += METER_STACK;
      }

      while(p2meter >= MAX_METER){
        p2meter -= MAX_METER;  
        p2stack += METER_STACK;
      }

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
            {Meter(p1meter, p2meter, p1stack, p2stack)}
      </div>)}
    </div>
  );
}

export default EXChess;
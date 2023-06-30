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
  const [boardO, setBoardO] = useState("white");
  const [exToggle, setToggle] = useState(false);

  const PAWN_METER_GAIN = 30;
  const KNIGHT_METER_GAIN = 60;
  const BISHOP_METER_GAIN = 60;
  const ROOK_METER_GAIN = 80;
  const QUEEN_METER_GAIN = 110;
  const KING_METER_GAIN = 110;

  const MAX_METER = 280;
  const METER_STACK = 1;

  function onDrop(sourceSquare, targetSquare) {
    var move 
    if(exToggle === false) {
      move = makeAMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
    }
    else{
      //exmove function
      return EXMove(sourceSquare, targetSquare);
    }
    if(move === null) return false;
    return true;
  }

  function makeAMove(move) {
    const gameCopy = new Chess(game.fen());
    const result = buildMeter(move, gameCopy);   
    setGame(gameCopy);
    if(gameCopy.isGameOver()){
      p1meter = 0;
      p2meter = 0;
      p1stack = 0;
      p2stack = 0;
    }
    return result; 
  }

  function buildMeter(move, gameCopy){
    var builtMeter = 0;
    const sourcePiece = gameCopy.get(move.from);
    var output = gameCopy.move(move);

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

      if(game.turn() === 'b' && output !== null){
        p2meter += builtMeter;
      }
      else if(game.turn() === 'w' && output !== null){
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
    return output;
  }
  
  function flipBoard(){
    if(boardO === "white") setBoardO("black");
    else setBoardO("white");
  }

  function toggleEX(){
    if(exToggle === false) setToggle(true);
    else setToggle(false);
  }

  function EXMove(sourceSquare, targetSquare){
    const gameCopy = new Chess(game.fen());
    var piece = gameCopy.get(sourceSquare).type.charAt(0);
    switch(piece){
      case 'p':
        if(game.turn() === 'w'){
          if(p1stack < 1) return false;
          else{
          
          }
        }
        else{
          if(p2stack < 1) return false;
          else{
          
          }
        }
        break;
      case 'n':
        if(game.turn() === 'w'){
          if(p1stack < 2) return false;
          else{
          
          }
        }
        else{
          if(p2stack < 2) return false;
          else{
          
          }
        }
        break;
      case 'b':
        if(game.turn() === 'w'){
          if(p1stack < 2) return false;
          else{
          
          }
        }
        else{
          if(p2stack < 2) return false;
          else{
          
          }
        }
        break;
      case 'r':
        if(game.turn() === 'w'){
          if(p1stack < 3) return false;
          else{
          
          }
        }
        else{
          if(p2stack < 3) return false;
          else{
          
          }
        }
        break;
      case 'q':
        if(game.turn() === 'w'){
          if(p1stack < 3) return false;
          else{
          
          }
        }
        else{
          if(p2stack < 3) return false;
          else{
          
          }
        }
        break;
      case 'k':
        if(game.turn() === 'w'){
          if(p1stack < 3) return false;
          else{
            var targetPiece = gameCopy.get(targetSquare);
            if(!targetPiece){
              gameCopy.remove(sourceSquare);
              if(targetSquare === 'a1'){
                gameCopy.put({type: 'k', color: 'w'}, 'a1');
                setGame(gameCopy);
                p1stack -= 3;
                return true;
              }
              else if(targetSquare === 'h1'){
                gameCopy.put({type: 'k', color: 'w'}, 'h1');
                setGame(gameCopy);
                p1stack -= 3;
                return true;
              }
            }
          }
        }
        else{
          if(p2stack < 3) return false;
          else{
            var targetPiece = gameCopy.get(targetSquare);
            if(!targetPiece){
              gameCopy.remove(sourceSquare);
              if(targetSquare === 'a8'){
                gameCopy.put({type: 'k', color: 'b'}, 'a8');
                setGame(gameCopy);
                p2stack -= 3;
                return true;
              }
              else if(targetSquare === 'h8'){
                gameCopy.put({type: 'k', color: 'b'}, 'h8');
                setGame(gameCopy);
                p2stack -= 3;
                return true;
              }
            }
          }
        }
        break;
    }
    return false;
  }

  return (
    <div>
      {game.isGameOver() ? 
      (<GameOver/>
      ) :
      (
      <div class="gameboard">
            <h1 class="game-mode" id="ex">EX Chess</h1>
            <h1 class="turn-indicator">{game.turn() === 'b' ? "Black to Move" : "White to Move"}</h1>
            {boardO === "white" ?
              (<Chessboard id="chessboard" position={game.fen()} onPieceDrop={onDrop} boardOrientation="white"/>) :
              (<Chessboard id="chessboard" position={game.fen()} onPieceDrop={onDrop} boardOrientation="black"/>)
            }
            {Meter(p1meter, p2meter, p1stack, p2stack)}
            <button id="flipbutton" onClick={flipBoard}>Flip Board</button>
            <button id="toggleEX" onClick={toggleEX}>{exToggle === false ? "Activate EX" : "Deactivate EX"}</button>
      </div>)}
    </div>
  );
}

export default EXChess;
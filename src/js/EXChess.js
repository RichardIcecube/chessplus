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

  function displacePiece(gameCopy, prej, prei, postj, posti){
    let atoh = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let onetoeight = ['8', '7', '6', '5', '4', '3', '2', '1'];
    let pre = atoh[prej].concat(onetoeight[prei]);
    let post = atoh[postj].concat(onetoeight[posti]);
    let piece = gameCopy.remove(post);
    gameCopy.put(piece, pre);
    gameCopy.move({from: pre, to: post});
    return gameCopy;
  }

  function nextTurn(gameCopy, turn){
    let board = gameCopy.board();
    var checktop;
    var checkbottom;
    var checkleft;
    var checkright;
    if(turn === 'w'){
      for(let i = board.length - 1; i >= 0; i--){
        for(let j = board[i].length - 1; j >= 0; j--){
          if(board[i][j]){
            checktop = true;
            checkbottom = true;
            checkleft = true;
            checkright = true;
            switch(board[i][j].type){
              case 'p':
                if(i < 6){ //prevents nondeveloped pawns from losing their ability to move forward 2 spaces
                  if(board[i + 1][j]===null){
                    return displacePiece(gameCopy, j, i + 1, j, i);
                  }
                } 
                break;
              case 'n': //consider reworking to better fit the knight's movement
                if(i < 2) checktop = false;
                if(i > 5) checkbottom = false;
                if(j < 2) checkleft = false;
                if(j > 5) checkbottom = false;
                break;
              case 'b':
                if(i === 0) checktop = false;
                if(i === 7) checkbottom = false;
                if(j === 0) checkleft = false;
                if(j === 7) checkright = false;
                if(checktop && checkleft){
                  if(board[i - 1][j - 1] === null){
                    return displacePiece(gameCopy, j - 1, i - 1, j, i);
                  }
                }
                if(checktop && checkright){
                  if(board[i - 1][j + 1] === null){
                    return displacePiece(gameCopy, j + 1, i - 1, j, i);
                  }
                }
                if(checkbottom && checkleft){
                  if(board[i + 1][j - 1] === null){
                    return displacePiece(gameCopy, j - 1, i + 1, j, i);
                  }
                }
                if(checkbottom && checkright) { 
                  if(board[i + 1][j + 1] === null){
                    return displacePiece(gameCopy, j + 1, i + 1, j, i);
                  }
                }
                break;
              case 'r':
                if(i === 0) checktop = false;
                if(i === 7) checkbottom = false;
                if(j === 0) checkleft = false;
                if(j === 7) checkright = false;
                break;
              case 'q':
                if(i === 0) checktop = false;
                if(i === 7) checkbottom = false;
                if(j === 0) checkleft = false;
                if(j === 7) checkright = false;
                break;
              default:
                break;
            }
          }
        }
      }
    }
    else{
      for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
          if(board[i][j]){
            checktop = true;
            checkbottom = true;
            checkleft = true;
            checkright = true;
            switch(board[i][j].type){
              case 'p':
                if(i > 1){ //prevents nondeveloped pawns from losing their ability to move forward 2 spaces
                  if(board[i - 1][j]===null){
                    return displacePiece(gameCopy, j, i - 1, j, i);
                  }
                } 
                break;
              case 'n':
                break;
              case 'b':
                if(i === 0) checkbottom = false;
                if(i === 7) checktop = false;
                if(j === 0) checkright = false;
                if(j === 7) checkleft = false;
                if(checktop && checkleft){
                  if(board[i + 1][j + 1] === null){
                    return displacePiece(gameCopy, j + 1, i + 1, j, i);
                  }
                }
                if(checktop && checkright){
                  if(board[i + 1][j - 1] === null){
                    return displacePiece(gameCopy, j - 1, i + 1, j, i);
                  }
                }
                if(checkbottom && checkleft){
                  if(board[i - 1][j + 1] === null){
                    return displacePiece(gameCopy, j + 1, i - 1, j, i);
                  }
                }
                if(checkbottom && checkright) { 
                  if(board[i - 1][j - 1] === null){
                    return displacePiece(gameCopy, j - 1, i - 1, j, i);
                  }
                }
                break;
              case 'r':
                break;
              case 'q':
                break;
              default:
                break;
            }
          }
        }
      }
    }
    return false;
  }

  function kingTeleportAdjacent(gameCopy, turn, teleportSpace, finalSpace){
    gameCopy.put({type: 'k', color: turn}, teleportSpace);
    gameCopy.move({from: teleportSpace, to: finalSpace});
    setGame(gameCopy);
  }

  function EXMove(sourceSquare, targetSquare){
    const gameCopy = new Chess(game.fen());
    if(gameCopy.isCheck()) return false;
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
              if(targetSquare === 'a1'){
                gameCopy.remove(sourceSquare);
                if(gameCopy.get('a2') && gameCopy.get('b1') && gameCopy.get('b2')){
                  gameCopy.put({type: 'k', color: 'w'}, 'a1');
                  let next = nextTurn(gameCopy, 'w');
                  if(next === false) return false
                  setGame(next);  
                }
                else{
                  if(!gameCopy.get('a2')){
                    kingTeleportAdjacent(gameCopy, 'w', 'a2', 'a1');
                  }
                  else if(!gameCopy.get('b1')){
                    kingTeleportAdjacent(gameCopy, 'w', 'b1', 'a1');
                  }
                  else { //!gameCopy.get('b2');
                    kingTeleportAdjacent(gameCopy, 'w', 'b2', 'a1');
                  }
                }
                p1stack -= 3;
                return true;
              }
              else if(targetSquare === 'h1'){
                gameCopy.remove(sourceSquare);
                if(gameCopy.get('h2') && gameCopy.get('g1') && gameCopy.get('g2')){
                  gameCopy.put({type: 'k', color: 'w'}, 'h1');
                  let next = nextTurn(gameCopy, 'w');
                  if(next === false) return false
                  setGame(next);  
                }
                else{
                  if(!gameCopy.get('h2')){
                    kingTeleportAdjacent(gameCopy, 'w', 'h2', 'h1');
                  }
                  else if(!gameCopy.get('g1')){
                    kingTeleportAdjacent(gameCopy, 'w', 'g1', 'h1');
                  }
                  else { //!gameCopy.get('g2');
                    kingTeleportAdjacent(gameCopy, 'w', 'g2', 'h1');
                  }
                }
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
              if(targetSquare === 'a8'){
                gameCopy.remove(sourceSquare);
                if(gameCopy.get('a7') && gameCopy.get('b8') && gameCopy.get('b7')){
                  gameCopy.put({type: 'k', color: 'b'}, 'a8');
                  let next = nextTurn(gameCopy, 'b');
                  if(next === false) return false
                  setGame(next);  
                }
                else{
                  if(!gameCopy.get('a7')){
                    kingTeleportAdjacent(gameCopy, 'b', 'a7', 'a8');
                  }
                  else if(!gameCopy.get('b8')){
                    kingTeleportAdjacent(gameCopy, 'b', 'b8', 'a8');
                  }
                  else { //!gameCopy.get('b7');
                    kingTeleportAdjacent(gameCopy, 'b', 'b7', 'a8');
                  }
                }
                p2stack -= 3;
                return true;
              }
              else if(targetSquare === 'h8'){
                gameCopy.remove(sourceSquare);
                if(gameCopy.get('h7') && gameCopy.get('g8') && gameCopy.get('g7')){
                  gameCopy.put({type: 'k', color: 'b'}, 'h8');
                  let next = nextTurn(gameCopy, 'b');
                  if(next === false) return false
                  setGame(next);  
                }
                else{
                  if(!gameCopy.get('h7')){
                    kingTeleportAdjacent(gameCopy, 'b', 'h7', 'h8');
                  }
                  else if(!gameCopy.get('g8')){
                    kingTeleportAdjacent(gameCopy, 'b', 'g8', 'h8');
                  }
                  else { //!gameCopy.get('g7');
                    kingTeleportAdjacent(gameCopy, 'b', 'g7', 'h8');
                  }
                }
                p2stack -= 3;
                return true;
              }
            }
          }
        }
        break;
      default:
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
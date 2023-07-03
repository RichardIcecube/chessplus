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

  function nextTurn(gameCopy, turn){
    let board = gameCopy.board();
    if(turn === 'w'){
      for(let i = board.length - 1; i >= 0; i--){
        for(let j = board[i].length - 1; j >= 0; j--){
          if(board[i][j] === null && i > 0 && board[i - 1][j] === null){
            let atoh = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            let onetoeight = ['8', '7', '6', '5', '4', '3', '2', '1'];
            let pawn = atoh[j].concat(onetoeight[i]);
            let post = atoh[j].concat(onetoeight[i - 1]);
            gameCopy.put({type: 'p', color: turn}, pawn);
            gameCopy.move({from: pawn, to: post, promotion: 'q'});
            //gameCopy.remove(post);
            //CURRENTLY, REMOVING THIS PAWN THAT WE JUST SPAWNED RESULTS IN THE GAME GIVING AN ERROR 
            //AND THE TURN NOT PASSING TO THE NEXT PLAYER. MY CURRENT IDEA INVOLVES FIRST CHECKING IF THE ADJACENT
            //SPACES TO THE KING'S CORNER ARE OPEN FIRST, ALLOWING THE KING TO SPAWN THERE AND MOVE TO THE DESIRED
            //CORNER. IF THOSE SPACES ARE COVERED, THEN WE CHECK IF THERE ARE ANY OPEN PIECES THAT WE CAN REMOVE,
            //RESPAWN IN A POSITION THAT THEY COULD MOVE TO IN THEIR ORIGINAL POSITION, AND MOVE BACK TO THEIR 
            //ORIGINAL POSITION. THIS SOLUTION WILL TAKE A GOOD DEAL OF TIME. IN THIS CURRENT VERSION OF THE GAME,
            //TELEPORTING THE KING SPAWNS A PAWN IN THE FIRST POSITION THE CODE FINDS WHERE IT CAN ADVANCE, AND 
            //ADVANCES IT.
            return gameCopy;
          }
        }
      }
    }
    else{
      for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
          if(board[i][j] === null && i < 7 && board[i + 1][j] === null){
            let atoh = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            let onetoeight = ['8', '7', '6', '5', '4', '3', '2', '1'];
            let pawn = atoh[j].concat(onetoeight[i]);
            let post = atoh[j].concat(onetoeight[i + 1]);
            gameCopy.put({type: 'p', color: turn}, pawn);
            gameCopy.move({from: pawn, to: post, promotion: 'q'});
            //gameCopy.remove(post);
            return gameCopy;
          }
        }
      }
    }
    return false;
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
                /*
                gameCopy.remove(sourceSquare);
                gameCopy.put({type: 'k', color: 'w'}, 'a1');
                setGame(gameCopy);
                p1stack -= 3;
                return true;
                */
                gameCopy.remove(sourceSquare);
                var storePiece = gameCopy.get('a2');
                gameCopy.remove('a2');
                gameCopy.put({type: 'k', color: 'w'}, 'a2');
                gameCopy.move({ from: 'a2', to: 'a1' });
                gameCopy.remove('a2');
                gameCopy.put(storePiece, 'a2');
                setGame(gameCopy);
                p1stack -= 3;
                return true;
              }
              else if(targetSquare === 'h1'){
                /*
                gameCopy.remove(sourceSquare);
                gameCopy.put({type: 'k', color: 'w'}, 'h1');
                setGame(gameCopy);
                p1stack -= 3;
                return true;
                */
                gameCopy.remove(sourceSquare);
                gameCopy.put({type: 'k', color: 'w'}, 'h1');
                let next = nextTurn(gameCopy, 'w');
                if(next === false) return false
                setGame(next);
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
                gameCopy.put({type: 'k', color: 'b'}, 'a8');
                setGame(gameCopy);
                p2stack -= 3;
                return true;
              }
              else if(targetSquare === 'h8'){
                gameCopy.remove(sourceSquare);
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
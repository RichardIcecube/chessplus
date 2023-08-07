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
  const [prevgame, setPrevGame] = useState(new Chess());
  const [prevmeter, setPrevMeter] = useState(0);
  const [prevstack, setPrevStack] = useState(0);
  const [lastpiece, setLastPiece] = useState('');
  const [boardO, setBoardO] = useState("white");
  const [exToggle, setToggle] = useState(false);
  const [resign, setResign] = useState(false);

  const PAWN_METER_GAIN = 30;
  const KNIGHT_METER_GAIN = 60;
  const BISHOP_METER_GAIN = 60;
  const ROOK_METER_GAIN = 80;
  const QUEEN_METER_GAIN = 110;
  const KING_METER_GAIN = 110;

  const MAX_METER = 280;
  const METER_STACK = 1;

  function takeMeter(targetSquare, turn){
    let piece = game.get(targetSquare).type;
    var whiteMod;
    var blackMod;
    if(turn === 'w'){
      whiteMod = 0.7;
      blackMod = 0.6;
    }
    else{
      whiteMod = 0.6;
      blackMod = 0.7;
    }
    switch(piece){
      case 'p':
        p1meter += PAWN_METER_GAIN * whiteMod;
        p2meter += PAWN_METER_GAIN * blackMod;
      break;
      case 'b':
        p1meter += BISHOP_METER_GAIN * whiteMod;
        p2meter += BISHOP_METER_GAIN * blackMod;
      break;
      case 'n':
        p1meter += KNIGHT_METER_GAIN * whiteMod;
        p2meter += KNIGHT_METER_GAIN * blackMod;
      break;
      case 'r':
        p1meter += ROOK_METER_GAIN * whiteMod;
        p2meter += ROOK_METER_GAIN * blackMod;
      break;
      case 'q':
        p1meter += QUEEN_METER_GAIN * whiteMod;
        p2meter += QUEEN_METER_GAIN * blackMod;
      break;
      case 'k':
        p1meter += KING_METER_GAIN * whiteMod;
        p2meter += KING_METER_GAIN * blackMod;
      break;
      default:
        break;
    }
    while(p1meter >= MAX_METER){
      p1meter -= MAX_METER;
      setPrevStack(METER_STACK);  
      p1stack += METER_STACK;
    }

    while(p2meter >= MAX_METER){
      p2meter -= MAX_METER;
      setPrevStack(METER_STACK);  
      p2stack += METER_STACK;
    }
  }

  function onDrop(sourceSquare, targetSquare) {
    var move;
    if(lastpiece !== '' && game.get(sourceSquare).type !== lastpiece) return false;
    if(game.get(targetSquare).type === 'k' && exToggle === false) return false;
    if(exToggle === false) {
      move = makeAMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if(game.get(targetSquare) !== false) takeMeter(targetSquare, game.turn());
    }
    else{
      //exmove function
      return EXMove(sourceSquare, targetSquare);
    }
    if(move === null) return false;
    setLastPiece('');
    return true;
  }

  function makeAMove(move) {
    const gameCopy = new Chess(game.fen());
    const result = buildMeter(move, gameCopy);   
    setPrevGame(game);
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
        setPrevMeter(builtMeter);
        p2meter += builtMeter;
      }
      else if(game.turn() === 'w' && output !== null){
        setPrevMeter(builtMeter);
        p1meter += builtMeter;
      }

      while(p1meter >= MAX_METER){
        p1meter -= MAX_METER;
        setPrevStack(METER_STACK);  
        p1stack += METER_STACK;
      }

      while(p2meter >= MAX_METER){
        p2meter -= MAX_METER;
        setPrevStack(METER_STACK);  
        p2stack += METER_STACK;
      }

    }
    return output;
  }
  
  function flipBoard(){
    if(boardO === "white") setBoardO("black");
    else setBoardO("white");
  }

  function undoMove(){
    if(prevstack === 0){
      if(game.turn() === 'b') 
        p1meter -= prevmeter;
      else 
        p2meter -= prevmeter;
    }
    else if(prevstack >= 0){
      if(game.turn() === 'b'){
        if(p1meter === 0){
          p1stack -= prevstack;
          p1meter = MAX_METER - prevmeter;
        }
        else{
          p1meter = MAX_METER - (prevmeter - p1meter);
          p1stack -= prevstack;
        }
      }
      else{
        if(p2meter === 0){
          p2stack -= prevstack;
          p2meter = MAX_METER - prevmeter;
        }
        else{
          p2meter = MAX_METER - (prevmeter - p2meter);
          p2stack -= prevstack;
        }
      }
    }
    else{
      if(game.turn() === 'b'){
        p1stack -= prevstack;
      }
      else p2stack -= prevstack;
    }
    setPrevStack(0);
    setPrevMeter(0);
    setLastPiece('');
    setGame(prevgame);
  }
  function toggleEX(){
    if(exToggle === false) setToggle(true);
    else setToggle(false);
  }
  function toggleResign(){
    setResign(true);
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
            checktop = (i !== 0);
            checkbottom = (i !== 7);
            checkleft = (j !== 0);
            checkright = (j !== 7);
            switch(board[i][j].type){
              case 'p':
                if(i < 6){ //prevents nondeveloped pawns from losing their ability to move forward 2 spaces
                  if(board[i + 1][j]===null) return displacePiece(gameCopy, j, i + 1, j, i);
                } 
                break;
              case 'n': 
                let down2right1 = (i <= 5 && j <= 6);
                let down2left1 = (i <= 5 && j >= 1);
                let left2down1 = (j >= 2 && i <= 6);
                let left2up1 = (j >= 2 && i >= 1);
                let right2down1 = (j <= 5 && i <= 6);
                let right2up1 = (j <= 5 && i <= 1);
                let up2right1 = (i >= 2 && j <= 6);
                let up2left1 = (i >= 2 && j >= 1);
                if(down2left1 && board[i + 2][j - 1] === null) return displacePiece(gameCopy, j - 1, i + 2, j, i);
                if(down2right1 && board[i + 2][j + 1] === null) return displacePiece(gameCopy, j + 1, i + 2, j, i);
                if(left2down1 && board[i + 1][j - 2] === null) return displacePiece(gameCopy, j - 2, i + 1, j, i);
                if(left2up1 && board[i - 1][j - 2] === null) return displacePiece(gameCopy, j - 2, i - 1, j, i);
                if(right2down1 && board[i + 1][j + 2] === null) return displacePiece(gameCopy, j + 2, i + 1, j, i);
                if(right2up1 && board[i - 1][j + 2] === null) return displacePiece(gameCopy, j + 2, i - 1, j, i);
                if(up2right1 && board[i - 2][j + 1] === null) return displacePiece(gameCopy, j + 1, i - 2, j, i);
                if(up2left1 && board[i - 2][j - 1] === null) return displacePiece(gameCopy, j - 1, i - 2, j, i);
                break;
              case 'b':
                if(checktop && checkleft && board[i - 1][j - 1] === null) return displacePiece(gameCopy, j - 1, i - 1, j, i);
                if(checktop && checkright && board[i - 1][j + 1] === null) return displacePiece(gameCopy, j + 1, i - 1, j, i);
                if(checkbottom && checkleft && board[i + 1][j - 1] === null) return displacePiece(gameCopy, j - 1, i + 1, j, i);
                if(checkbottom && checkright && board[i + 1][j + 1] === null) return displacePiece(gameCopy, j + 1, i + 1, j, i);
                break;
              case 'r':
                if(checktop && board[i - 1][j] === null) return displacePiece(gameCopy, j, i - 1, j, i);
                if(checkbottom && board[i + 1][j] === null) return displacePiece(gameCopy, j, i + 1, j, i);
                if(checkleft && board[i][j - 1] === null) return displacePiece(gameCopy, j - 1, i, j, i);
                if(checkright && board[i][j + 1] === null) return displacePiece(gameCopy, j + 1, i, j, i);
                break;
              case 'q':
                if(checktop && board[i - 1][j] === null) return displacePiece(gameCopy, j, i - 1, j, i);
                if(checkbottom && board[i + 1][j] === null) return displacePiece(gameCopy, j, i + 1, j, i);
                if(checkleft && board[i][j - 1] === null) return displacePiece(gameCopy, j - 1, i, j, i);
                if(checkright && board[i][j + 1] === null) return displacePiece(gameCopy, j + 1, i, j, i);
                if(checktop && checkright && board[i - 1][j + 1] === null) return displacePiece(gameCopy, j + 1, i - 1, j, i);
                if(checkbottom && checkleft && board[i + 1][j - 1] === null) return displacePiece(gameCopy, j - 1, i + 1, j, i);
                if(checkleft && checktop && board[i - 1][j - 1] === null) return displacePiece(gameCopy, j - 1, i - 1, j, i);
                if(checkright && checkbottom && board[i + 1][j + 1] === null) return displacePiece(gameCopy, j + 1, i + 1, j, i);
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
            checkbottom = (i !== 0);
            checktop = (i !== 7);
            checkright = (j !== 0);
            checkleft = (j !== 7);
            switch(board[i][j].type){
              case 'p':
                if(i > 1){ //prevents nondeveloped pawns from losing their ability to move forward 2 spaces
                  if(board[i - 1][j]===null){
                    return displacePiece(gameCopy, j, i - 1, j, i);
                  }
                } 
                break;
              case 'n':
                let up2right1 = (i <= 5 && j <= 6);
                let up2left1 = (i <= 5 && j >= 1);
                let left2up1 = (j >= 2 && i <= 6);
                let left2down1 = (j >= 2 && i >= 1);
                let right2up1 = (j <= 5 && i <= 6);
                let right2down1 = (j <= 5 && i <= 1);
                let down2right1 = (i >= 2 && j <= 6);
                let down2left1 = (i >= 2 && j >= 1);
                if(up2left1 && board[i + 2][j - 1] === null) return displacePiece(gameCopy, j - 1, i + 2, j, i);
                if(up2right1 && board[i + 2][j + 1] === null) return displacePiece(gameCopy, j + 1, i + 2, j, i);
                if(left2up1 && board[i + 1][j - 2] === null) return displacePiece(gameCopy, j - 2, i + 1, j, i);
                if(left2down1 && board[i - 1][j - 2] === null) return displacePiece(gameCopy, j - 2, i - 1, j, i);
                if(right2up1 && board[i + 1][j + 2] === null) return displacePiece(gameCopy, j + 2, i + 1, j, i);
                if(right2down1 && board[i - 1][j + 2] === null) return displacePiece(gameCopy, j + 2, i - 1, j, i);
                if(down2right1 && board[i - 2][j + 1] === null) return displacePiece(gameCopy, j + 1, i - 2, j, i);
                if(down2left1 && board[i - 2][j - 1] === null) return displacePiece(gameCopy, j - 1, i - 2, j, i);
                break;
              case 'b':
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
                if(checkbottom && board[i - 1][j] === null) return displacePiece(gameCopy, j, i - 1, j, i);
                if(checktop && board[i + 1][j] === null) return displacePiece(gameCopy, j, i + 1, j, i);
                if(checkleft && board[i][j - 1] === null) return displacePiece(gameCopy, j - 1, i, j, i);
                if(checkright && board[i][j + 1] === null) return displacePiece(gameCopy, j + 1, i, j, i);
                break;
              case 'q':
                if(checkbottom && board[i - 1][j] === null) return displacePiece(gameCopy, j, i - 1, j, i);
                if(checktop && board[i + 1][j] === null) return displacePiece(gameCopy, j, i + 1, j, i);
                if(checkleft && board[i][j - 1] === null) return displacePiece(gameCopy, j - 1, i, j, i);
                if(checkright && board[i][j + 1] === null) return displacePiece(gameCopy, j + 1, i, j, i);
                if(checkbottom && checkright && board[i - 1][j + 1] === null) return displacePiece(gameCopy, j + 1, i - 1, j, i);
                if(checktop && checkleft && board[i + 1][j - 1] === null) return displacePiece(gameCopy, j - 1, i + 1, j, i);
                if(checkleft && checkbottom && board[i - 1][j - 1] === null) return displacePiece(gameCopy, j - 1, i - 1, j, i);
                if(checkright && checktop && board[i + 1][j + 1] === null) return displacePiece(gameCopy, j + 1, i + 1, j, i);
                break;
              default:
                break;
            }
          }
        }
      }
    }
    return gameCopy;
  }

  function kingTeleportAdjacent(gameCopy, turn, teleportSpace, finalSpace){
    gameCopy.put({type: 'k', color: turn}, teleportSpace);
    gameCopy.move({from: teleportSpace, to: finalSpace});
    setPrevGame(game);
    setGame(gameCopy);
  }

  function pawnBreak(gameCopy, source, target, remove){
    let piece = gameCopy.remove(source);
    gameCopy.put(piece, target);
    gameCopy.remove(remove);
    setPrevGame(game);
    setGame(nextTurn(gameCopy, piece.color.charAt(0)));
  }

  function nextChar(c) {
    var i = (parseInt(c, 36) + 1) % 36;
    return (!i * 10 + i).toString(36);
  }

  function prevChar(c) {
    var i = (parseInt(c, 36) - 1) % 36;
    return (!i * 10 + i).toString(36);
  }

  function pawnDiagCheck(sourceSquare, targetSquare, turn){
    let sourceLetter = sourceSquare.charAt(0);
    let targetLetter = targetSquare.charAt(0);
    let sourceNumber = sourceSquare.charAt(1);
    let targetNumber = targetSquare.charAt(1);

    if(turn === 'w'){
      return ((nextChar(sourceLetter) === targetLetter || prevChar(sourceLetter) === targetLetter) && nextChar(sourceNumber) === targetNumber); 
    }
    else{
      return ((nextChar(sourceLetter) === targetLetter || prevChar(sourceLetter) === targetLetter) && prevChar(sourceNumber) === targetNumber);
    }
  }
  
  function freeMove(gameCopy, sourceSquare, targetSquare){
    gameCopy.remove(targetSquare);
    let piece = gameCopy.remove(sourceSquare);
    gameCopy.put(piece, targetSquare);
    setPrevGame(game);
    setGame(gameCopy);
  }

  function validateKnightMove(sourceSquare, targetSquare){
    let sourceLetter = sourceSquare.charAt(0);
    let targetLetter = targetSquare.charAt(0);
    let sourceNumber = sourceSquare.charAt(1);
    let targetNumber = targetSquare.charAt(1);

    if(nextChar(sourceLetter) === targetLetter && nextChar(nextChar(sourceNumber)) === targetNumber) return true;
    if(nextChar(nextChar(sourceLetter)) === targetLetter && nextChar(sourceNumber) === targetNumber) return true;
    if(nextChar(sourceLetter) === targetLetter && prevChar(prevChar(sourceNumber)) === targetNumber) return true;
    if(prevChar(sourceLetter) === targetLetter && prevChar(prevChar(sourceNumber)) === targetNumber) return true;
    if(prevChar(prevChar(sourceLetter)) === targetLetter && prevChar(sourceNumber) === targetNumber) return true;
    if(prevChar(sourceLetter) === targetLetter && nextChar(nextChar(sourceNumber)) === targetNumber) return true;
    if(nextChar(nextChar(sourceLetter)) === targetLetter && prevChar(sourceNumber) === targetNumber) return true;
    if(prevChar(prevChar(sourceLetter)) === targetLetter && nextChar(sourceNumber) === targetNumber) return true;
    return false;
  }

  function validateDiag(sourceSquare, targetSquare){
    let sourceLetter = (parseInt(sourceSquare.charAt(0), 36) + 1) % 36;
    let targetLetter = (parseInt(targetSquare.charAt(0), 36) + 1) % 36;
    let sourceNumber = (parseInt(sourceSquare.charAt(1), 36) + 1) % 36;
    let targetNumber = (parseInt(targetSquare.charAt(1), 36) + 1) % 36;

    if(Math.abs(targetLetter - sourceLetter) === Math.abs(targetNumber - sourceNumber)) return true;       
    return false;
  }

  function validateLine(sourceSquare, targetSquare){
    let sourceLetter = sourceSquare.charAt(0);
    let targetLetter = targetSquare.charAt(0);
    let sourceNumber = sourceSquare.charAt(1);
    let targetNumber = targetSquare.charAt(1);

    if(sourceLetter === targetLetter || sourceNumber === targetNumber) return true;
    return false;
  }

  function EXMove(sourceSquare, targetSquare){
    const gameCopy = new Chess(game.fen());
    if(gameCopy.isCheck() && gameCopy.get(sourceSquare).type !== 'k') return false;
    var piece = gameCopy.get(sourceSquare).type.charAt(0);
    switch(piece){
      case 'p':
        if(game.turn() === 'w'){
          if(p1stack < 1 || gameCopy.get(targetSquare)) return false;
          else{
           if(pawnDiagCheck(sourceSquare, targetSquare, 'w')){
            let sidePiece = targetSquare.charAt(0).concat(sourceSquare.charAt(1));
            if(gameCopy.get(sidePiece) && gameCopy.get(sidePiece).type.charAt(0) === 'p') {
              pawnBreak(gameCopy,sourceSquare, targetSquare, sidePiece);
              p1stack -= 1;
              setPrevStack(-1);
              toggleEX();
              return true;
            }
           }
           return false;
          }
        }
        else{
          if(p2stack < 1 || gameCopy.get(targetSquare)) return false;
          else{
            if(pawnDiagCheck(sourceSquare, targetSquare, 'b')){
              let sidePiece = targetSquare.charAt(0).concat(sourceSquare.charAt(1));
              if(gameCopy.get(sidePiece).type.charAt(0) === 'p') {
                pawnBreak(gameCopy,sourceSquare, targetSquare, sidePiece);
                p2stack -= 1;
                setPrevStack(-1);
                toggleEX();
                return true;
              }
            }
            return false;
          }
        }
      case 'n':
        if(game.turn() === 'w'){
          if(p1stack < 3 || !gameCopy.get(targetSquare) || !validateKnightMove(sourceSquare, targetSquare)) return false;
          else{
            if(gameCopy.get(targetSquare).color === 'w' || gameCopy.get(targetSquare).type === 'k') return false;
            freeMove(gameCopy, sourceSquare, targetSquare);
            p1stack -= 3;
            setPrevStack(-3);
            setLastPiece('n');
            toggleEX();
            return true;
          }
        }
        else{
          if(p2stack < 3 || !gameCopy.get(targetSquare)|| !validateKnightMove(sourceSquare, targetSquare)) return false;
          else{
            if(gameCopy.get(targetSquare).color === 'b' || gameCopy.get(targetSquare).type === 'k') return false;
            freeMove(gameCopy, sourceSquare, targetSquare);
            p2stack -= 3;
            setPrevStack(-3);
            setLastPiece('n');
            toggleEX();
            return true;
          }
        }
      case 'b':
        if(game.turn() === 'w'){
          if(p1stack < 2 || !validateDiag(sourceSquare, targetSquare)) return false;
          else{
            if(gameCopy.get(targetSquare) !== false && (gameCopy.get(targetSquare).color === 'w' || gameCopy.get(targetSquare).type === 'k')) return false;
            freeMove(gameCopy, sourceSquare, targetSquare);
            let next = nextTurn(gameCopy, 'w');
            if(!next) return false;
            setPrevGame(game);
            setGame(next);
            p1stack -= 2;
            setPrevStack(-2);
            toggleEX();
            return true;
          }
        }
        else{
          if(p2stack < 2 || !validateDiag(sourceSquare, targetSquare)) return false;
          else{
            if(gameCopy.get(targetSquare) !== false && (gameCopy.get(targetSquare).color === 'b' || gameCopy.get(targetSquare).type === 'k')) return false;
            freeMove(gameCopy, sourceSquare, targetSquare);
            let next = nextTurn(gameCopy, 'b');
            if(!next) return false;
            setPrevGame(game);
            setGame(next);
            p2stack -= 2;
            setPrevStack(-2);
            toggleEX();
            return true;
          }
        }
      case 'r':
        if(game.turn() === 'w'){
          if(p1stack < 3 || !gameCopy.get(targetSquare)) return false;
          else{
            if(gameCopy.get(targetSquare).type !== 'k') return false
            let rook = gameCopy.remove(sourceSquare);
            let king = gameCopy.remove(targetSquare);
            gameCopy.put(rook, targetSquare);
            gameCopy.put(king, sourceSquare);
            let next = nextTurn(gameCopy, 'w');
            if(!next) return false;
            setPrevGame(game);
            setGame(next);
            p1stack -= 3;
            setPrevStack(-3);
            toggleEX();
            return true;
          }
        }
        else{
          if(p2stack < 3 || !gameCopy.get(targetSquare)) return false;
          else{
            if(gameCopy.get(targetSquare).type !== 'k') return false;
            let rook = gameCopy.remove(sourceSquare);
            let king = gameCopy.remove(targetSquare);
            gameCopy.put(rook, targetSquare);
            gameCopy.put(king, sourceSquare);
            let next = nextTurn(gameCopy, 'b');
            if(!next) return false;
            setPrevGame(game);
            setGame(next);
            p2stack -= 3;
            setPrevStack(-3);
            toggleEX();
            return true;
          }
        }
      case 'q':
        if(game.turn() === 'w'){
          if(p1stack < 4 || !gameCopy.get(targetSquare)) return false;
          else{
            if(gameCopy.get(targetSquare).color === 'w' || gameCopy.get(targetSquare).type === 'k' || gameCopy.get(targetSquare).type === 'q') return false;
            gameCopy.remove(targetSquare);
            let next = nextTurn(gameCopy, 'w');
            if(next === false) return false;
            setPrevGame(game);
            setGame(next); 
            p1stack -= 4;
            setPrevStack(-4);
            toggleEX();
            return true;
          }
        }
        else{
          if(p2stack < 4 || !gameCopy.get(targetSquare)) return false;
          else{
            if(gameCopy.get(targetSquare).color === 'b' || gameCopy.get(targetSquare).type === 'k' || gameCopy.get(targetSquare).type === 'q') return false;
            gameCopy.remove(targetSquare);
            let next = nextTurn(gameCopy, 'b');
            if(next === false) return false;
            setPrevGame(game);
            setGame(next); 
            p2stack -= 4;
            setPrevStack(-4);
            toggleEX();
            return true;
          }
        }
      case 'k':
        if(game.turn() === 'w'){
          if(p1stack < 3) return false;
          else{
            var targetPiece = gameCopy.get(targetSquare);
            if(targetPiece.color !== 'w'){
              if(targetSquare === 'a1'){
                gameCopy.remove(sourceSquare);
                if(gameCopy.get('a2') && gameCopy.get('b1') && gameCopy.get('b2')){
                  gameCopy.put({type: 'k', color: 'w'}, 'a1');
                  let next = nextTurn(gameCopy, 'w');
                  if(next === false) return false;
                  setPrevGame(game);
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
                setPrevStack(-3);
                toggleEX();
                return true;
              }
              else if(targetSquare === 'h1'){
                gameCopy.remove(sourceSquare);
                if(gameCopy.get('h2') && gameCopy.get('g1') && gameCopy.get('g2')){
                  gameCopy.put({type: 'k', color: 'w'}, 'h1');
                  let next = nextTurn(gameCopy, 'w');
                  if(next === false) return false;
                  setPrevGame(game);
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
                setPrevStack(-3);
                toggleEX();
                return true;
              }
            }
          }
        }
        else{
          if(p2stack < 3) return false;
          else{
            var targetPiece = gameCopy.get(targetSquare);
            if(targetPiece.color !== 'b'){
              if(targetSquare === 'a8'){
                gameCopy.remove(sourceSquare);
                if(gameCopy.get('a7') && gameCopy.get('b8') && gameCopy.get('b7')){
                  gameCopy.put({type: 'k', color: 'b'}, 'a8');
                  let next = nextTurn(gameCopy, 'b');
                  if(next === false) return false;
                  setPrevGame(game);
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
                setPrevMeter(-3);
                toggleEX();
                return true;
              }
              else if(targetSquare === 'h8'){
                gameCopy.remove(sourceSquare);
                if(gameCopy.get('h7') && gameCopy.get('g8') && gameCopy.get('g7')){
                  gameCopy.put({type: 'k', color: 'b'}, 'h8');
                  let next = nextTurn(gameCopy, 'b');
                  if(next === false) return false;
                  setPrevGame(game);
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
                setPrevMeter(-3);
                toggleEX();
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
      {game.isGameOver() || resign ? 
      (<GameOver/>
      ) :
      (
      <div className="gameboard">
            <h1 className="game-mode" id="ex">EX Chess</h1>
            <h1 className="turn-indicator">{game.turn() === 'b' ? "Black to Move" : "White to Move"}</h1>
            {boardO === "white" ?
              (<Chessboard id="chessboard" position={game.fen()} onPieceDrop={onDrop} boardOrientation="white"/>) :
              (<Chessboard id="chessboard" position={game.fen()} onPieceDrop={onDrop} boardOrientation="black"/>)
            }
            {Meter(p1meter, p2meter, p1stack, p2stack)}
            <label id="blacklabel">Black</label>
            <label id="whitelabel">White</label>
            <button id="flipbutton" onClick={flipBoard}>Flip Board</button>
            <button id="undobutton" onClick={undoMove}>Undo</button>
            <button id="resignbutton" onClick={toggleResign}>Resign</button>
            <button id="toggleEX" onClick={toggleEX}>{exToggle === false ? "Activate EX" : "Deactivate EX"}</button>
      </div>)}
    </div>
  );
}

export default EXChess;
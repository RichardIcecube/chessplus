import { useState } from "react";
import { Chess, WHITE } from "chess.js";
import { Chessboard } from "react-chessboard";
import GameOver from "./GameOver.js";
import "../css/Chessboard.css";

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

  function isCastle(from, to){
    if(from !== 'e1' && from !== 'e8') return 0;
    if(from === 'e1'){
      if(to === 'g1') return 1; //kingside white
      if(to === 'c1') return 2; //queenside white
    }
    else{
      if(to === 'g8') return 3; //kingside black
      if(to === 'c8') return 4; //queenside black
    }
    return 0;
  }

  function zombieTake(move, gameCopy){
    const sourcePiece = gameCopy.get(move.from);
    const targetPiece = gameCopy.get(move.to);
      let castle = isCastle(move.from, move.to);
      if(sourcePiece.type.charAt(0) === 'k' && castle !== 0){
        switch(castle){
          case 1: //kingside white
            let f1 = gameCopy.get('f1');
            let g1 = gameCopy.get('g1');
            if((f1.color === sourcePiece.color || !f1) && (g1.color === sourcePiece.color || !g1)){
              gameCopy.remove('f1');
              gameCopy.remove('g1');
              return gameCopy.move(move);
            }
            break;
          case 2: //queenside white
            let b1 = gameCopy.get('b1');
            let c1 = gameCopy.get('c1');
            let d1 = gameCopy.get('d1');
            if((b1.color === sourcePiece.color || !b1) && (c1.color === sourcePiece.color || !c1) && (d1.color === sourcePiece.color || !d1)){
              gameCopy.remove('b1');
              gameCopy.remove('c1');
              gameCopy.remove('d1');
              return gameCopy.move(move);
            }
            break;
          case 3: //kingside black
            let f8 = gameCopy.get('f8');
            let g8 = gameCopy.get('g8');
            if((f8.color === sourcePiece.color || !f8) && (g8.color === sourcePiece.color || !g8)){
              gameCopy.remove('f8');
              gameCopy.remove('g8');
              return gameCopy.move(move);
            }
            break;
          case 4: //queenside black
            let b8 = gameCopy.get('b8');
            let c8 = gameCopy.get('c8');
            let d8 = gameCopy.get('d8');
            if((b8.color === sourcePiece.color || !b8) && (c8.color === sourcePiece.color || !c8) && (d8.color === sourcePiece.color || !d8)){
              gameCopy.remove('b8');
              gameCopy.remove('c8');
              gameCopy.remove('d8');
              return gameCopy.move(move);
            }
            break;
          default:
            break;
        }
      }

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
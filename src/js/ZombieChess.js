import { useState } from "react";
import { Chess } from "chess.js";
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
    if(from !== 'e1' || from !== 'e8') return 0;
    if(from === 'e1'){
      if(to === 'g1') return 1; //kingside castle
      if(to === 'c1') return 2; //queenside castle
    }
    else{
      if(to === 'g8') return 1; //kingside castle
      if(to === 'c8') return 2; //queenside castle
    }
    return 0;
  }

  function zombieTake(move, gameCopy){
    const sourcePiece = gameCopy.get(move.from);
    const targetPiece = gameCopy.get(move.to);

    if(sourcePiece.type.charAt(0) === 'k' && (isCastle(move.from, move.to) === 1 || isCastle(move.from, move.to) === 2)){
      let castlingRights = gameCopy.getCastingRights(sourcePiece.color);//format is { 'k': true, 'q': false }
      if(isCastle(move.from, move.to) === 1){ //kingside castle
        //check for castling rights
        if(castlingRights['k'] === true){
          if(gameCopy.turn() === 'w'){
            //NOTE MAKE SURE THE PIECES YOU REMOVE ARE YOUR OWN
            gameCopy.remove('f1');
            gameCopy.remove('g1');
            return gameCopy.move(move);
          }
          else{
            gameCopy.remove('b1');
            gameCopy.remove('c1');
            gameCopy.remove('d1');
            return  gameCopy.move(move);
          }
        }
      }
      else{ //queenside castle
        if(castlingRights['q'] === true) {
          if(gameCopy.turn() === 'w'){
            gameCopy.remove('f8');
            gameCopy.remove('g8');
            return gameCopy.move(move);
          }
          else{
            gameCopy.remove('b8');
            gameCopy.remove('c8');
            gameCopy.remove('d8');
            return gameCopy.move(move);
          }
        }
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
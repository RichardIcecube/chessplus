import React, { useState } from "react";
import BaseChess from "./BaseChess.js";
import ZombieChess from "./ZombieChess.js";
import EXChess from "./EXChess.js";
import "../css/TitleScreen.css";

export default function TitleScreen() {
  const [selectedMode, setSelectedMode] = useState(null);

  function modeSelector(gameMode) {
    switch (gameMode) {
      case 1:
        return <BaseChess />;
      case 2:
        return <ZombieChess />;
      case 3:
        return <EXChess />;
      default:
        return null;
    }
  }

  function handleModeSelect(gameMode) { 
    setSelectedMode(modeSelector(gameMode));
  }

  return (
    <div>
      {selectedMode ? (
        selectedMode
      ) : (
        <div className="title-screen">
          <h1 id="title">Chess+</h1>
          <button onClick={() => handleModeSelect(1)}>Chess</button>
          <button onClick={() => handleModeSelect(2)}>Zombie Chess</button>
          <button onClick={() => handleModeSelect(3)}>EX Chess</button>
        </div>
      )}
    </div>
  );
}

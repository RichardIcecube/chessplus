import React, { useState } from "react";
import "../css/GameOver.css";
import TitleScreen from "./TitleScreen.js";

function GameOver(){
    const [titleScreen, setTitleScreen] = useState(false);

    function returnToTitle(){
        setTitleScreen(true);
    }

    return(
        <body class="gameover-background">
            <div>
                {titleScreen ? 
                (<TitleScreen />) : 
                (
                <div class="game-over">
                    <h1 class="checkmate">Checkmate!</h1>
                    <button onClick={() => returnToTitle()}>Return to Title</button>
                </div>
                )}
            </div>
        </body>
    );
}

export default GameOver;
import "../css/Meter.css";
import React, { useRef, useEffect } from 'react';
var p1meter = 99;
var p2meter = 279;
var p1stack = 0;
var p2stack = 0;
const pawn = 5;
const knight = 15;
const bishop = 15;
const rook = 20;
const queen = 25;
const king = 25;
export default function Meter(piece, turn) {   
    var builtMeter;
    const p1meterref = useRef(null);
    const p2meterref = useRef(null);
    switch(piece){
        case 'p':
            builtMeter = pawn;
            break;
        case 'k':
            builtMeter = knight;
            break;
        case 'b':
            builtMeter = bishop;
            break;
        case 'r':
            builtMeter = rook;
            break;
        case 'q':
            builtMeter = queen;
            break;
        case 'k':
            builtMeter = king;
            break;
        default:
            break;
    }
    if(turn == 'b'){
        p2meter += builtMeter;
    }
    else{
        p1meter += builtMeter;
    }
    while(p1meter >= 280){
        p1meter -= 280;
        p1stack += 1;
    }
    while(p2meter >= 280){
        p2meter -= 280;
        p2stack += 1;
    }
    useEffect(() => {
        if (p1meterref.current && p2meterref.current) {
          p1meterref.current.style.width = `${p1meter}px`;
          p2meterref.current.style.width = `${p2meter}px`;
        }
      }, [p1meter, p2meter]);
    return(
        <div>
            <div class="meter" id="p1-meter"/>
            <div class="meter" id="p2-meter"/>
            <div class="built-meter" id="p1-built-meter" ref={p1meterref}/>
            <div class="built-meter" id="p2-built-meter" ref={p2meterref}/>
            <h1 class="meter-stack" id="p1-meter-stack">0</h1>
            <h1 class="meter-stack" id="p2-meter-stack">0</h1>
        </div>
    )
}
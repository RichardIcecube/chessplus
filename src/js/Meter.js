import "../css/Meter.css";
import React, { useRef, useEffect } from 'react';
import { useState } from "react";

var p1stack = 0;
var p2stack = 0;

const PAWN_METER_GAIN = 5;
const KNIGHT_METER_GAIN = 15;
const BISHOP_METER_GAIN = 15;
const ROOK_METER_GAIN = 20;
const QUEEN_METER_GAIN = 25;
const KING_METER_GAIN = 25;

const MAX_METER = 280;
const METER_STACK = 1;
export default function Meter(piece, turn) {   
    var builtMeter;
    const p1 = useRef(0);
    const p2 = useRef(0);
    const [p1meter, setP1meter] = useState(p1);
    const [p2meter, setP2meter] = useState(p2);
    const p1meterref = useRef(null);
    const p2meterref = useRef(null);
    switch(piece){
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
    useEffect(() => {
        if(turn === 'b'){
            setP2meter(p2meter + builtMeter);
            p2.current = p2meter;
        }
        else{
            setP1meter(p1meter + builtMeter);
            p1.current = p1meter;
        }
        while(p1meter >= MAX_METER){
            setP1meter(p1meter - MAX_METER);
            p1.current = p1meter;
            p1stack += METER_STACK;
        }
        while(p2meter >= MAX_METER){
            setP2meter(p2meter - MAX_METER);
            p2.current = p2meter;
            p2stack += METER_STACK;
        }
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
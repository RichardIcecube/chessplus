import "../css/Meter.css";
import React, { useRef, useEffect } from 'react';

export default function Meter(p1meter, p2meter, p1stack, p2stack) {   
    return(
        <div>
            <div class="meter" id="p1-meter"/>
            <div class="meter" id="p2-meter"/>
            <div class="built-meter" id="p1-built-meter" style={{ width: `${p1meter}px` }}/>
            <div class="built-meter" id="p2-built-meter" style={{ width: `${p2meter}px` }}/>
            <h1 class="meter-stack" id="p1-meter-stack">0</h1>
            <h1 class="meter-stack" id="p2-meter-stack">0</h1>
        </div>
    )
}
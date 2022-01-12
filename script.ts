"use strict" 
import { Game } from "./classes/game.js"
import { Mass } from "./classes/mass.js";
import { Vector } from "./classes/vector.js";
(window as any ).game = new Game(window.innerWidth,window.innerHeight)
window.addEventListener("resize",()=> (window as any).game.resize(window.innerWidth,window.innerHeight))


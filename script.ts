"use strict" 
import { Game } from "./classes/game.js"
import { Mass } from "./classes/mass.js";
import { Vector } from "./classes/vector.js";
(window as any ).game = new Game(window.innerWidth,window.innerHeight)


// const canvas=<HTMLCanvasElement> document.getElementById("canvas")
// export const ctx = canvas.getContext("2d")

// let isActive = false
// let mouseDownPoint: Vector

// canvas.addEventListener("mousemove", mouseMove)

// function mouseMove(e:MouseEvent){
//  if(isActive == true){


//  console.log(e.clientX,e.clientY);
//  }

// }


// canvas.addEventListener("mousedown", mouseDown)

// function mouseDown(e:MouseEvent){
//  mouseDownPoint = new Vector(e.clientX,e.clientY)
//  isActive = true
//   let mass = new Mass(new Vector(e.clientX, e.clientY), new Vector(0,0), new Vector(0,0))
//   mass.draw()
// }



// canvas.addEventListener("mouseup", mouseUp)


// function mouseUp(e:MouseEvent){
//  isActive = false
//   let mass = new Mass(new Vector(e.clientX, e.clientY), new Vector(0,0), new Vector(0,0))
//   mass.draw()
//  ctx?.moveTo(mouseDownPoint.x,mouseDownPoint.y)
//  ctx!.lineTo(e.clientX,e.clientY)
//  ctx?.stroke()
 
// }
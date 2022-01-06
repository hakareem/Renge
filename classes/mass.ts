import { Vector } from "./vector.js";
import { ctx } from "../script.js";


export class Mass {
 position:Vector = new Vector(50,50)
 velocity:Vector = new Vector(0,0)
 target: Vector = new Vector(0,0)

constructor(position: Vector, velocity: Vector, target: Vector){
 this.position = position
 this.velocity = velocity
 this.target = target
}

draw(){
 ctx?.beginPath()
 ctx?.arc(this.position.x,this.position.y,20,0,2 * Math.PI)
 ctx!.fillStyle = "green"
 ctx?.fill()
 ctx?.closePath()
}


// drawLine(){

//  ctx.beginPath()
//  ctx.lineTo()


//  ctx.closePath()
// }



}
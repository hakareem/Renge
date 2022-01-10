import { Vector } from "./vector.js";
import { Game } from "./game.js";


export class Mass {
    position:Vector = new Vector(50,50)
    velocity:Vector = new Vector(0,0)
    target: Vector = new Vector(0,0)
    mass:number=1

    constructor(position: Vector, velocity: Vector, target: Vector){
        this.position = position
        this.velocity = velocity
        this.target = target
    }

    draw(game:Game){
        game.ctx?.beginPath()
        game.ctx?.arc(this.position.x,this.position.y,20,0,2 * Math.PI)
        game.ctx!.fillStyle = "green"
        game.ctx?.fill()
        game.ctx?.closePath()
    }

    move(){
        this.position=this.position.add(this.velocity)
    }


// drawLine(){

//  ctx.beginPath()
//  ctx.lineTo()


//  ctx.closePath()
// }



}
import { Vector } from "./vector.js";
import { Game } from "./game.js";


export class Mass {
 position:Vector = new Vector(50,50)
 velocity:Vector = new Vector(0,0)
 //target: Vector = new Vector(0,0)
 index:number

constructor(game:Game,position: Vector, velocity: Vector){ //target: Vector){
 this.position = position
 this.velocity = velocity
 this.index=game.masses.length
 //this.target = target
 game.masses.push(this)
}

highlight = new Array(
    Math.round(Math.random() * 255),
    Math.round(Math.random() * 255),
    Math.round(Math.random() * 255)
);
draw(game:Game){
    
    game.ctx?.beginPath()
    game.ctx?.arc(this.position.x,this.position.y,game.massRadius,0,2 * Math.PI)
    //  game.ctx!.fillStyle = "green"
    //  game.ctx?.fill()
    game.ctx.lineWidth = 5 ;
    game.ctx.strokeStyle ="blue"
    game.ctx.stroke();
    game.ctx?.closePath()
}


move(game:Game){
    if(this.position.y < game.ground){

    this.position=this.position.add(this.velocity)
    }
}

}
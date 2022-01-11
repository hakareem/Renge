import { Vector } from "./vector.js";
import { Mass } from "./mass.js";
import { Game } from "./game.js";



export class Spring{

    // m1:Mass 
    // m2:Mass 
    
    k:number=0.1
    restLength:number=0


    constructor(k:number,public a:Mass, public b:Mass){

        
        this.k=k
        this.restLength= this.a.position.distanceFrom(this.b.position)
    }

    
    updateLength(game:Game){
     
        let direction:Vector= this.a.position.subtract(this.b.position).normalise()
        let extension:number = this.a.position.distanceFrom(this.b.position)-this.restLength
        direction.multiplyIn(this.k*extension) //this changes direction itself
        if(this.b.position.y <= game.ground && this.a.position.y <= game.ground || this.b.position.x <= game.ground && this.a.position.x <= game.ground){
            this.b.position.addIn(direction)
            this.a.position.addIn(direction.multiply(-1))
        }
    }

    drawSpring(game:Game){
       game.ctx.beginPath()
       
    //    game.ctx?.moveTo(game.downMass!,game.upMass)
       game.ctx!.moveTo(this.a.position.x,this.a.position.y)
       game.ctx!.lineTo(this.b.position.x,this.b.position.y)
       game.ctx?.stroke()
    }

}
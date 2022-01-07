import { Vector } from "./vector.js";
import { Mass } from "./mass.js";
import { Game } from "./game.js";



export class Spring{

    // m1:Mass 
    // m2:Mass 
    
    k:number=0.1
    restLength:number=0


    constructor(k:number,restLength:number,public a:Mass, public b:Mass){

        
        this.k=k
        this.restLength=restLength
    }

    
    updateLength(){
     
        let direction:Vector= this.a.position.subtract(this.b.position).normalise()
        let extension:number = this.a.position.distanceFrom(this.b.position)-this.restLength
        direction.multiplyIn(this.k*extension) //this changes direction itself
        this.a.position.add(direction)
        this.b.position.add(direction)
        
    }

    drawSpring(game:Game){
       game.ctx.beginPath()
       
       game.ctx?.moveTo(game.mouseDownPoint.x,game.mouseDownPoint.y)
       game.ctx!.lineTo(game.mouseUpPoint.x,game.mouseUpPoint.y)
       game.ctx?.stroke()
    }

}
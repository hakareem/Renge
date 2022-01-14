import { Vector } from "./vector.js";
import { Mass } from "./mass.js";
import { Game } from "./game.js";



export class Spring{

    // m1:Mass 
    // m2:Mass 
    
    k:number=0.1
    restLength:number=0
    broken: boolean = false
    index:number = 0

    constructor(game:Game,k:number,public a:Mass, public b:Mass){

        
        this.k=k
        this.restLength= this.a.position.distanceFrom(this.b.position)
        // this.index = game.springs.length
    }

    
    stretch(game:Game){
        if(this.broken){
            return
        }
        let direction:Vector= this.a.position.subtract(this.b.position).normalise()
        let extension:number = this.a.position.distanceFrom(this.b.position)-this.restLength
        direction.multiplyIn(this.k*extension) //this changes direction itself
        // if(this.b.position.y <= game.ground && this.a.position.y <= game.ground || this.b.position.x <= game.ground && this.a.position.x <= game.ground){
        if (this.a.position.y<game.ground){

            this.a.velocity.addIn(direction.multiply(-1))
        }
        if (this.b.position.y<game.ground){
            this.b.velocity.addIn(direction)
        }
    }

    get length(){
    return this.a.position.distanceFrom(this.b.position)
    }

    draw(game:Game){
    if(this.broken){
        return
    }
    game.ctx.beginPath()
    game.ctx.lineWidth = 5
    game.ctx.lineCap  ="round"
    let tension = this.length / this.restLength
    if(tension > 1.23 || tension < 0.77){
        this.broken = true 
        // console.log("spring broken");
        
    } 
    let color = `rgb(${128 + Math.ceil(tension- 1) * 200},0,255)`
    // console.log(color);
    game.ctx.strokeStyle = color


    //    game.ctx?.moveTo(game.downMass!,game.upMass)
    game.ctx!.moveTo(this.a.position.x,this.a.position.y)
    game.ctx!.lineTo(this.b.position.x,this.b.position.y)
    game.ctx?.stroke()
}

    outsideBox(p:Vector){
        if(p.x > this.a.position.x && p.x > this.b.position.x){             
            return true// too far right
        } else if(p.x < this.a.position.x && p.x < this.b.position.x){
            return true// too far left
        } 
        if(p.y > this.a.position.y && p.y > this.b.position.y){
            return true // too far above
        } else if(p.y < this.a.position.y && p.y < this.b.position.y){
            return true // too far below
        } 
        return false // false === its inside the box
    }

    distanceFrom(p:Vector): number{
    
        let x1 = this.a.position.x 
        let y1 = this.a.position.y
        let x2 = this.b.position.x 
        let y2 = this.b.position.y 
    
        let closestPoint:Vector = new Vector(p.x,0)
        let gradient = (y2 - y1) / (x2 -x1) 

        closestPoint.y = (p.x - x1) * gradient + y1
        return p.distanceFrom(closestPoint)
    }

}
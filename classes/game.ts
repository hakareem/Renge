
import { Vector } from "./vector.js";
import { Mass } from "./mass.js";
import { Spring } from "./spring.js";


export class Game {
    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    isActive:boolean = false;
    mouseDownPoint:Vector = new Vector(0,0);
    mouseUpPoint:Vector=new Vector(0,0)
    gravity:Vector=new Vector(0,0.1)
    springs:Spring[]=[]
    masses:Mass[]=[]
    cursor:Vector = new Vector(0,0)
    downMass:Mass|null= null
    upMass:Mass|null= null 

    massRadius=12
    gravityOn:boolean=false
    // rect:CanvasRect;
    mouseX: number=50
    mouseY: number=50
    ground = 680

    constructor(width:number,height:number){
        this.canvas = document.createElement('canvas')
        this.canvas.classList.add("canvas")
        this.ctx = this.canvas.getContext('2d')!
        document.body.appendChild(this.canvas)
        this.canvas.width = width
        this.canvas.height = height

        // this.rect = this.canvas.getBoundingClientRect()
        this.canvas.addEventListener('mousedown',(e) => this.mouseDown(e))
        this.canvas.addEventListener('mouseup',(e) => this.mouseUp(e))
        this.canvas.addEventListener('mousemove',(e) => this.mouseMove(e))
        //requestAnimationFrame(this.cycle)
        this.cycle()

        let button= document.createElement("button")
        button.classList.add("btn")
        button.innerHTML ="Gravity"
        document.body.appendChild(button)
        button.addEventListener("click",()=> this.toggleGravity())

        let restart = document.createElement("button")
        restart.classList.add("restart")
        restart.innerHTML ="Reset Game"
        document.body.appendChild(restart)
        restart.addEventListener("click", ()=>this.reset() )
    }   

    toggleGravity(){
        this.gravityOn=!this.gravityOn;  //switches between off and on the = !
        
        console.log("gravity"+ this.gravityOn)
    }

    massAtPoint(p:Vector){
        for(let i=0;i<this.masses.length;i++){
            //if this mass overlaps the point p, return it
            if (p.distanceFrom(this.masses[i].position)<this.massRadius){
                return this.masses[i]
            }
        }
        return null
    }

    


    cycle(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.ctx.fillStyle = "red"
        this.ctx.fillRect(0,this.ground,this.canvas.width, this.canvas.height)
        this.ctx.beginPath()
        for (let i=0;i<this.masses.length;i++){
            this.masses[i].draw(this)
            this.masses[i].move(this)
            if(this.gravityOn){
                this.masses[i].velocity=this.masses[i].velocity.add(this.gravity)
            }
        }
    
        for (let i=0; i <this.springs.length;i++){
            this.springs[i].drawSpring(this)
            this.springs[i].updateLength(this)

        }
        this.ctx.stroke()

       requestAnimationFrame(()=> this.cycle()) 
    }

    mouseDown(e:MouseEvent){
        // this.mouseMove(e.clientX,e.clientY)
        this.mouseDownPoint = new Vector(e.clientX,e.clientY)
        this.isActive = true
        let map= this.massAtPoint(this.mouseDownPoint)
        if(map){
            this.downMass=map
        }
        else{
            this.downMass = new Mass(new Vector(e.clientX, e.clientY), new Vector(0,0), new Vector(0,0))
            this.masses.push(this.downMass)
        }
       // mass.draw(this)
       
    }
    mouseUp(e:MouseEvent){
        this.mouseUpPoint= new Vector(e.clientX,e.clientY)
        this.isActive = false
        let map= this.massAtPoint(this.mouseUpPoint)
        if (map){
            this.upMass=map
        }
        else{
            this.upMass = new Mass(new Vector(e.clientX, e.clientY), new Vector(0,0), new Vector(0,0))
            this.masses.push(this.upMass)
        }
            this.springs.push( new Spring(0.1,this.downMass!,this.upMass))
        

        //mass.draw(this)
        // this.ctx?.moveTo(this.mouseDownPoint.x,this.mouseDownPoint.y)
        // this.ctx!.lineTo(e.clientX,e.clientY)
        // this.ctx?.stroke()
    }
    // mouseMove(e:MouseEvent){
    //     if(this.isActive == true){
    //         console.log(e.clientX,e.clientY);
    //         }
    // }

//     findMouse(e:MouseEvent){
//     this.mouseX = e.clientX - rect.left
//     this.mouseY = e.clientY - rect.top
// }
    mouseMove(e:MouseEvent){
     for (let j = 0; j < this.springs.length; j++){
       let x1 = this.springs[j].a.position.x 
       let y1 = this.springs[j].a.position.y
       let x2 = this.springs[j].b.position.x 
       let y2 = this.springs[j].b.position.y 

      let gradient = (y2 - y1) / (x2 -x1) 
      this.cursor.x = this.mouseX 
      this.cursor.y = (this.mouseX - x1) * gradient + y1
      
     }
 }

 reset(){
    this.masses = []
    this.springs = []
}
 }
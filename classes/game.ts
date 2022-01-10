
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

    downMass:Mass|null= null
    upMass:Mass|null= null 

    massRadius=20


    constructor(width:number,height:number){
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')!
        document.body.appendChild(this.canvas)
        this.canvas.width = width
        this.canvas.height = height


        this.canvas.addEventListener('mousedown',(e) => this.mouseDown(e))
        this.canvas.addEventListener('mouseup',(e) => this.mouseUp(e))
        this.canvas.addEventListener('mousemove',(e) => this.mouseMove(e))
        //requestAnimationFrame(this.cycle)
        this.cycle()
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
        this.ctx.beginPath()
        for (let i=0;i<this.masses.length;i++){
            this.masses[i].draw(this)
            this.masses[i].move()
            // this.masses[i].velocity=this.masses[i].velocity.add(this.gravity)


        }
    
        for (let i=0; i <this.springs.length;i++){
            this.springs[i].drawSpring(this)
            this.springs[i].updateLength()

        }
        this.ctx.stroke()



       requestAnimationFrame(()=> this.cycle()) 
       //draw masses
       //draw springs
       //move masses
       //stretch the spings(update length)
        //clear the canvas
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
            this.springs.push( new Spring(0.1, 200,this.downMass!,this.upMass))
        

        //mass.draw(this)
        // this.ctx?.moveTo(this.mouseDownPoint.x,this.mouseDownPoint.y)
        // this.ctx!.lineTo(e.clientX,e.clientY)
        // this.ctx?.stroke()
    }
    mouseMove(e:MouseEvent){
        if(this.isActive == true){


            console.log(e.clientX,e.clientY);
            }
    }
 }
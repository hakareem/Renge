
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

    cycle(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.ctx.beginPath()
        for (let i=0;i<this.masses.length;i++){
            this.masses[i].draw(this)
            this.masses[i].move()
            this.masses[i].velocity=this.masses[i].velocity.add(this.gravity)

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
        this.masses.push( new Mass(new Vector(e.clientX, e.clientY), new Vector(0,0), new Vector(0,0)))
       // mass.draw(this)
    }
    mouseUp(e:MouseEvent){
        this.mouseUpPoint= new Vector(e.clientX,e.clientY)
        this.isActive = false
        this.masses.push( new Mass(new Vector(e.clientX, e.clientY), new Vector(0,0), new Vector(0,0)))
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
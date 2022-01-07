
import { Vector } from "./vector.js";
import { Mass } from "./mass.js";



export class Game {
    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    isActive:boolean = false;
    mouseDownPoint:Vector = new Vector(0,0);

    constructor(width:number,height:number){
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')!
        document.body.appendChild(this.canvas)
        this.canvas.width = width
        this.canvas.height = height


        this.canvas.addEventListener('mousedown',(e) => this.mouseDown(e))
        this.canvas.addEventListener('mouseup',(e) => this.mouseUp(e))
        this.canvas.addEventListener('mousemove',(e) => this.mouseMove(e))
        
    }   

    cycle(){
        
    }

    mouseDown(e:MouseEvent){
        // this.mouseMove(e.clientX,e.clientY)
        this.mouseDownPoint = new Vector(e.clientX,e.clientY)
        this.isActive = true
        let mass = new Mass(new Vector(e.clientX, e.clientY), new Vector(0,0), new Vector(0,0))
        mass.draw(this)
    }
    mouseUp(e:MouseEvent){
        this.isActive = false
        let mass = new Mass(new Vector(e.clientX, e.clientY), new Vector(0,0), new Vector(0,0))
        mass.draw(this)
        this.ctx?.moveTo(this.mouseDownPoint.x,this.mouseDownPoint.y)
        this.ctx!.lineTo(e.clientX,e.clientY)
        this.ctx?.stroke()
    }
    mouseMove(e:MouseEvent){
        if(this.isActive == true){


            console.log(e.clientX,e.clientY);
            }
    }
 }
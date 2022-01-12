
import { Vector } from "./vector.js";
import { Mass } from "./mass.js";
import { Spring } from "./spring.js";

//save branch
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

    massRadius=9
    gravityOn:boolean=false
    // rect:CanvasRect;
    ground = 900
    mouseCoords = new Vector(0, 0)
    selectedSpring: Spring | null = null 
    selectedMass: Mass | null = null 

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
        // this.canvas.addEventListener("dblclick",(e)=>this.removeSpring(e))
        //requestAnimationFrame(this.cycle)
        this.cycle()


        let container = document.createElement("div")
        document.body.appendChild(container)
        container.classList.add("container")

        let button= document.createElement("button")
        button.classList.add("btn")
        button.innerText = "Gravity Off"
        container.appendChild(button)
        button.addEventListener("click",()=> {this.toggleGravity();button.innerHTML = this.gravityOn?"Gravity On":"Gravity Off"})


        let undo = document.createElement("button")
        undo.classList.add("undo")
        undo.innerHTML = "Undo Last Move"
        container.appendChild(undo)
        // undo.addEventListener("click", ()=> this.undoLastMove())

        let restart = document.createElement("button")
        restart.classList.add("restart")
        restart.innerHTML ="Reset Game"
        container.appendChild(restart)
        restart.addEventListener("click", ()=>this.reset() )

        let saveButton = document.createElement("button")
        saveButton.classList.add("save")
        saveButton.innerHTML ="Save Level"
        container.appendChild(saveButton)
        saveButton.addEventListener("click", ()=>this.saveLevel() )

        let loadButton = document.createElement("button")
        loadButton.classList.add("load")
        loadButton.innerHTML ="Load Level"
        container.appendChild(loadButton)
        loadButton.addEventListener("click", ()=>this.loadLevel() )
    }   

    saveLevel(){
        //we have a bunch of masses and springs
        //we want to save them how they "look" on the screen
        //then clear the canvas and have the old level display


        //localStorage.setItem("masses",JSON.stringify(this.masses[0].position))
        localStorage.setItem("Game",JSON.stringify(this))
    }

    loadLevel(){
        
        let dataString:string|null=localStorage.getItem("Game")
        let loaded:Game= JSON.parse(dataString!) //you now need to remake springs and masses based on the loaded data
        this.masses=[]
        this.springs=[]
        for (let i=0;i<loaded.masses.length;i++){
            let m = loaded.masses[i]
            new Mass(this,Vector.create( m.position),Vector.create(m.velocity))

            
            
        }
     
        for (let i=0;i<loaded.springs.length;i++){
            console.log(loaded.springs[i])
            this.springs.push(new Spring(0.1,this.masses[loaded.springs[i].a.index],this.masses[loaded.springs[i].b.index]))
        }
    }

    toggleGravity(){

        this.gravityOn=!this.gravityOn //switches between off and on the = !
        
        
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
                this.masses[i].velocity.multiplyIn(0.97)
            }
        }
    
        for (let i=0; i <this.springs.length;i++){
            this.springs[i].drawSpring(this)
            this.springs[i].stretch(this)

        }
        if(this.selectedSpring){
            this.ctx.strokeStyle="cyan"
            this.ctx.beginPath()
            this.ctx.moveTo(this.selectedSpring?.a.position.x, this.selectedSpring?.a.position.y)
            this.ctx.lineTo(this.selectedSpring?.b.position.x, this.selectedSpring?.b.position.y)
            this.ctx.stroke()
        }

           if(this.selectedMass){
            this.ctx.strokeStyle="red"
            this.ctx.beginPath()
            this.ctx.moveTo(this.selectedMass?.position.x, this.selectedMass?.position.y)
            this.ctx.lineTo(this.selectedMass?.position.x, this.selectedMass?.position.y)
            this.ctx.stroke()
        }

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
            this.downMass = new Mass(this,new Vector(e.clientX, e.clientY), new Vector(0,0))//, new Vector(0,0))
            //this.masses.push(this.downMass)
            // this.springs.push(new Spring(0.1,this.downMass!,this.downMass))

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
            this.upMass = new Mass(this,new Vector(e.clientX, e.clientY), new Vector(0,0)) //new Vector(0,0))
            //this.masses.push(this.upMass)
        }
        if (this.downMass != this.upMass){
            this.springs.push( new Spring(0.1,this.downMass!,this.upMass))
        }

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

    // findMouse(e:MouseEvent){
    // this.mouseX = e.clientX - this.rect.left
    // this.mouseY = e.clientY - this.rect.top
    // }

 
    mouseMove(e:MouseEvent){
    this.mouseCoords = new Vector(e.clientX,e.clientY)
    for (let j = 0; j < this.springs.length; j++){
        let springer =this.springs[j]
        if(!this.springs[j].outsideBox(this.mouseCoords)){
            console.log("inside");
            console.log(this.springs[j].distanceFrom(this.mouseCoords))
            
            if(this.springs[j].distanceFrom(this.mouseCoords) < 10){ 
                this.selectedSpring = this.springs[j]
                // this.springs.splice(1)
                }
            }       
            
        
        
    }
}


reset(){
    this.masses = []
    this.springs = []
    }
}
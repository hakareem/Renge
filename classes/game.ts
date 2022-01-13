
import { Vector } from "./vector.js";
import { Mass } from "./mass.js";
import { Spring } from "./spring.js";
import { Sound } from "./sounds.js";

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
    mode: number=0
    massRadius=9
    gravityOn:boolean=false
    editMode:boolean = false
    // rect:CanvasRect;
    ground = 700
    mouseCoords = new Vector(0, 0)
    selectedSpring: Spring | null = null 
    hardLevels:string[]=["Tank", "Bridge", "Tower","Boat","Egg","Rocket","Building","Pyramid","Octagon","Fish"]
    easy:string[]=[]
    medium:string[]=[]
    
    
    massPics: string[] = [];


    constructor(width:number,height:number){
        this.canvas = document.createElement('canvas')
        this.canvas.classList.add("canvas")
        this.ctx = this.canvas.getContext('2d')!
        document.body.appendChild(this.canvas)
        
        this.resize(width, height)
        // this.rect = this.canvas.getBoundingClientRect()
        this.canvas.addEventListener('mousedown',(e) => this.mouseDown(e))
        this.canvas.addEventListener('mouseup',(e) => this.mouseUp(e))
        this.canvas.addEventListener('mousemove',(e) => this.mouseMove(e))
        window.addEventListener('keydown',(e)=> this.removeSelectedSpring(e))
        //requestAnimationFrame(this.cycle)
        Sound.setup(["remove", "wood1", "wood2", "switchMode", "removeSpring","gravityOn"]);

        this.setupMassPics();

        this.cycle()

        let container = document.createElement("div")
        document.body.appendChild(container)
        container.classList.add("container")

        let container2 = document.createElement("div")
        document.body.appendChild(container2)
        container2.classList.add("container2")

        // let showUi = document.createElement("button")
        // container2.appendChild(showUi)
        // showUi.innerHTML ="Edit Mode"
        // showUi.classList.add("uI")
        // showUi.addEventListener("click",()=>{this.toggleMode();showUi.innerHTML = this.editMode?"Game Mode":"Edit Mode"})

        let button= document.createElement("button")
        button.classList.add("btn")
        button.innerText = "Gravity Off"
        container.appendChild(button)
        Sound.play("gravityOn", 0.1);
        button.addEventListener("click",()=> {this.toggleGravity();button.innerHTML = this.gravityOn?"Gravity On":"Gravity Off"} )


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

        let saveInput= document.createElement("input")
        saveInput.id="saveInput"
        saveInput.placeholder="Save Level Name"
        container.appendChild(saveInput)

        let saveButton = document.createElement("button")
        saveButton.classList.add("save")
        saveButton.innerHTML ="Save Level"
        container.appendChild(saveButton)
        saveButton.addEventListener("click", ()=>this.saveLevel() )

        let loadInput = document.createElement("input")
        loadInput.id="loadInput"
        loadInput.placeholder="Load Level Name"
        container.appendChild(loadInput)


        // this.level=["pyramid","tank"]

        // for(let i=0;i<this.level.length;i++){
            
        // }

        let hard=document.createElement("select")
        hard.setAttribute("name","select")
        hard.setAttribute("id","hard")
        hard.setAttribute("size","1")
        container.appendChild(hard)

        this.hardLevels
        for(let i=0;i<this.hardLevels.length;i++){
            let option= document.createElement("option")
            option.setAttribute("value",this.hardLevels[i])
            option.setAttribute("selected","selected")
            option.innerHTML=this.hardLevels[i]
            hard.appendChild(option)
        }

        // let medium=document.createElement("select")
        // medium.setAttribute("name","select")
        // medium.setAttribute("id","medium")
        // medium.setAttribute("size","1")
        // container.appendChild(medium)


        // for(let type in this.levels){
        //     this.levels.options
        // }


        let loadButton = document.createElement("button")
        loadButton.classList.add("load")
        loadButton.innerHTML ="Load Level"
        container.appendChild(loadButton)
        loadButton.addEventListener("click", ()=>this.loadLevel() )

        // let removeButton = document.createElement("button")
        // removeButton.classList.add("remove-spring")
        // removeButton.innerHTML ="Remove Spring"
        // document.body.appendChild(removeButton)
        // removeButton.addEventListener("click", ()=>this.removeSelectedSpring() )
    
        let modes = document.createElement("button")
        modes.classList.add("modeBtn")
        modes.innerHTML = "Edit Mode"
        container2.appendChild(modes)
        modes.addEventListener("click",()=>{this.toggleMode(this);modes.innerHTML = this.editMode?"Game Mode":"Edit Mode"})

    }   

    setupMassPics() {
    this.massPics.push("pics/1.png");
    this.massPics.push("pics/2.png");
    this.massPics.push("pics/3.png");
    }



    removeSelectedSpring(e:KeyboardEvent){
        console.log(`key pressed: ${e.key}`)
        if(this.selectedSpring && e.key == "Delete"){
            console.log(`Deleted ${this.selectedSpring}`)

            let springsIndex = this.selectedSpring.index
            this.springs.splice(springsIndex,1)
            this.selectedSpring = null
            
            Sound.play("removeSpring", 0.1);
        }
    }

    resize(width:number, height:number){
        this.canvas.width = width
        this.canvas.height = height
        this.ground = 7/9 * height
    }

    saveLevel(){
        //we have a bunch of masses and springs
        //we want to save them how they "look" on the screen
        //then clear the canvas and have the old level display


        //localStorage.setItem("masses",JSON.stringify(this.masses[0].position))
        localStorage.setItem((<HTMLInputElement>document.getElementById("saveInput")).value,JSON.stringify(this))
    }

    async loadLevel(){
        
        // let dataString:string|null=localStorage.getItem((<HTMLInputElement>document.getElementById("loadInput")).value)
        // let loaded:Game= JSON.parse(dataString!) //you now need to remake springs and masses based on the loaded data
        
        let hardLevels=(<HTMLSelectElement>document.getElementById("hard")).value
        console.log(hardLevels)
        let loaded:Game=await this.fetchObject(`levels/${hardLevels}.json`)
        this.masses=[]
        this.springs=[]
        for (let i=0;i<loaded.masses.length;i++){
            let m = loaded.masses[i]
            new Mass(this,Vector.create( m.position),Vector.create(m.velocity))  
        }
     
        for (let i=0;i<loaded.springs.length;i++){
            console.log(loaded.springs[i])
            this.springs.push(new Spring(this,0.1,this.masses[loaded.springs[i].a.index],this.masses[loaded.springs[i].b.index]))
        }
    }

    


    async fetchObject(url: string) {
        const method = "GET"
        const headers = { 'Accept': 'text/html', 'Content-Type': 'application/json' }
        const response = await fetch(url, { method: method, headers: headers })
        //const response = await fetch(url, {method:method,headers:{'Accept':'text/html','Content-Type':'application/json'}})
        if (response.ok) {
            return await response.json()
        }
        else {
            console.log(`unexpected response status ${response.status} + ${response.statusText}`)
        }
    }
    
    toggleGravity(){

        this.gravityOn=!this.gravityOn //switches between off and on the = !
        
        
        console.log("gravity"+ this.gravityOn)
    }

     toggleMode(game:Game){
        this.editMode=!this.editMode
        const targetContainer = document.getElementsByTagName("div")[0]
        
        if(this.editMode == true){
            targetContainer.style.display = "none"
            console.log("true: Game Mode");
            this.gravityOn = true
            // game.drawGrid(1) 
            Sound.play("switchMode", 0.1);
    

        } else {    
            targetContainer.style.display = "flex"
            console.log("false: Edit Mode");
            this.gravityOn = false
            Sound.play("switchMode", 0.1);
        
        }
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
        if(this.editMode === false){
            this.drawGrid(this.ground / 5);
        }

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
        
    requestAnimationFrame(()=> this.cycle()) 
    }
     drawGrid(size:number) {
          
        this.ctx.strokeStyle = "rgba(0,0,255,0.2)" 
        for (let x=0;x<=this.canvas.width;x+=size) {
            //draw vertical lines
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
        }
        for (let y=0;y<=this.canvas.height;y+=size) {
            //draw horizontal lines
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);   
        };
         this.ctx.stroke();
         
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
            this.downMass = new Mass(this,new Vector(e.clientX, e.clientY), new Vector(0,0))
            Sound.play("wood1", 0.1);
            
            //, new Vector(0,0))
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
            this.upMass = new Mass(this,new Vector(e.clientX, e.clientY), new Vector(0,0)) 
            Sound.play("wood2", 0.1);
            
            //new Vector(0,0))
            //this.masses.push(this.upMass)
        }
        if (this.downMass != this.upMass){
            this.springs.push( new Spring(this,0.1,this.downMass!,this.upMass))
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
            // console.log("inside");
            // console.log(this.springs[j].distanceFrom(this.mouseCoords))
            
            if(this.springs[j].distanceFrom(this.mouseCoords) < 10){ 
                this.selectedSpring = this.springs[j]
                // this.springs.splice(1)
                }
            }

        
    }
}

// changeMode(){
//     this.mode = (this.mode + 1)%2
//     if (this.mode === 0){
//         (<HTMLInputElement>document.querySelector(".modeBtn")).value= "Edit Mode"
//     }
//     if (this.mode === 1){
//         (<HTMLInputElement>document.querySelector(".modeBtn")).value= "Play Mode"
//     }
// }

reset(){
    this.masses = []
    this.springs = []
    this.selectedSpring=null
    }
}




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
    gravity:Vector=new Vector(0,0.05)
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
    
    gameOver: boolean = false
    massPics: string[] = [];
    score: number = 0


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
        window.addEventListener('keydown',(e)=> this.undoLastMove(e))


        //requestAnimationFrame(this.cycle)
        Sound.setup(["remove", "wood1", "wood2", "switchMode", "removeSpring","gravityOn","lost"]);

        let audio = document.createElement("audio")
        audio.src="music/two.mp3"
        audio.play()
        audio.volume = 0.05

        this.setupMassPics();

        this.cycle()
        
        setInterval(()=>{
            for(let i=0 ; i< 5; i++){
                this.stretchSprings();
                this.moveMasses()
                this.applyDrag()
            }
            this.applyGravity()
           // this.applyDrag()
        }, 10)


        
        let intro = document.createElement("div")
        document.body.appendChild(intro)
        intro.classList.add("intro")

        let introBtn = document.createElement("button")
        introBtn.classList.add("introBtn")
        introBtn.innerHTML = "Start Game"
        intro.appendChild(introBtn)
        introBtn.addEventListener("click", ()=>this.displayGame())

        let text = document.createElement("p")
        text.classList.add("Text")
        text.innerHTML = "Welcome to Renge"
        intro.appendChild(text)

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

        // let saveInput= document.createElement("input")
        // saveInput.id="saveInput"
        // saveInput.placeholder="Save Level Name"
        // container.appendChild(saveInput)

        // let saveButton = document.createElement("button")
        // saveButton.classList.add("save")
        // saveButton.innerHTML ="Save Level"
        // container.appendChild(saveButton)
        // saveButton.addEventListener("click", ()=>this.saveLevel() )

        // let loadInput = document.createElement("input")
        // loadInput.id="loadInput"
        // loadInput.placeholder="Load Level Name"
        // container.appendChild(loadInput)


        // this.level=["pyramid","tank"]

        // for(let i=0;i<this.level.length;i++){
            
        // }
        let loadLabel= document.createElement("label")
        loadLabel.setAttribute("for","hard")
        loadLabel.innerHTML="Pick A Level:"
        loadLabel.setAttribute("class","loadLabel")
        container.appendChild(loadLabel)
        
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

        
        // let score = document.createElement("h1")
        // score.classList.add("score")
        // container2.appendChild(score)
        // score.innerHTML = "Score: "

        let loser = document.createElement("div")
        document.body.appendChild(loser)
        loser.classList.add("loser")
        loser.id = "loser"
 
        let loserBtn = document.createElement("button")
        loserBtn.classList.add("loserBtn")
        loserBtn.innerHTML = "Continue"
        loser.appendChild(loserBtn)
        loserBtn.addEventListener("click",()=>this.hideLoser())
 
        let write = document.createElement("p")
        write.classList.add("write")
        write.innerHTML = "You Lost"
        loser.appendChild(write)

    }   

    setupMassPics() {
    this.massPics.push("pics/1.png");
    this.massPics.push("pics/2.png");
    this.massPics.push("pics/3.png");
    }

    displayLoser(){
        const targetCon = document.getElementById("loser")
            targetCon!.style.display ="block"
    }
    hideLoser(){
        const targetCon = document.getElementById("loser")
        targetCon!.style.visibility = "hidden"
            Sound.play("lost", 0.1);

        // this.loadLevel()
    
    }

    drawScore(){
        this.ctx.font = "20px sans serif"
        // this.ctx.scale (50,100)
        this.ctx.fillStyle = "black"
        this.ctx.fillText("Score: " + this.score,20,100)
        this.ctx.stroke()
        console.log("score++");
        
    }
    removeSelectedSpring(e:KeyboardEvent){
        console.log(`key pressed: ${e.key} tension: ${this.selectedSpring!.tension}`)
        if(this.selectedSpring && e.key == "Delete"){
            console.log(`Deleted ${this.selectedSpring.index}`)
            
            console.log(`The spring array was: ${this.springs.length}`)

            let springsIndex = this.selectedSpring.index
            // this.springs.splice(springsIndex,1)
            this.selectedSpring.broken = true
            
            this.score = (this.score + Math.abs(this.selectedSpring.tension - 1) * 1000) + 150
            this.selectedSpring = null
            console.log(`The spring array is: ${this.springs.length}`)
            // this.score = (this.score + Math.abs(this.selectedSpring!.tension - 1) * 100) + 150
            Sound.play("removeSpring", 0.1);
        }
    }

    undoLastMove(e:KeyboardEvent){
        if(e.key == "Backspace"){
            this.springs.pop()
            this.selectedSpring = null
            
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
            this.springs.push(new Spring(this,this.masses[loaded.springs[i].a.index],this.masses[loaded.springs[i].b.index]))
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
    
    displayGame(){
        const targetContainer = document.getElementsByTagName("div")[0]
        if(targetContainer.style.display!=="none"){
            targetContainer.style.display = 'none'
        }
        
    }



    toggleGravity(){

        this.gravityOn=!this.gravityOn //switches between off and on the = !
        

        console.log("gravity"+ this.gravityOn)
    }

     toggleMode(game:Game){
        this.editMode=!this.editMode
        const targetContainer = document.getElementsByTagName("div")[1]
        
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

       loserLine(){
        // this.ctx.strokeStyle = "rgba(0,0,100,0.8)"
        this.ctx.strokeStyle = "purple"
        this.ctx.beginPath();
        this.ctx.moveTo(0, 650);
        this.ctx.lineTo(this.canvas.width, 650);
        this.ctx.stroke();
    
    };


    cycle(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.ctx.fillStyle = "orange"
        this.ctx.fillRect(0,this.ground,this.canvas.width, this.canvas.height)
        if(this.editMode == false){
        this.drawGrid(this.ground / 7);
        }
        this.loserLine()
        this.drawMasses()
        this.drawSprings()
        this.drawScore()
        // this.stretchSprings()
        // this.moveMasses() //this also does gravity and drag
        
        if(this.selectedSpring){
            this.ctx.strokeStyle="yellow"
            this.ctx.beginPath()
            this.ctx.moveTo(this.selectedSpring?.a.position.x, this.selectedSpring?.a.position.y)
            this.ctx.lineTo(this.selectedSpring?.b.position.x, this.selectedSpring?.b.position.y)
            this.ctx.stroke()
        }

        this.gameOver = true
        for (let i=0;i<this.masses.length;i++){
            this.masses[i].draw(this)
            // this.masses[i].move(this)
            // if(this.gravityOn){
            //     this.masses[i].velocity=this.masses[i].velocity.add(this.gravity)
            //     this.masses[i].velocity.multiplyIn(0.97)
            // }
            if(this.masses[i].position.y < 650){
            this.gameOver = false

            }
        }
        if(this.gameOver && this.gravityOn){

            this.displayLoser()

        }
        // for (let i=0; i <this.springs.length;i++){
        //     this.springs[i].drawSpring(this)
        //     this.springs[i].stretch(this)
 
        // }

        
    requestAnimationFrame(()=> this.cycle()) 
    }

    
     drawGrid(size:number) {
          
        this.ctx.strokeStyle = "rgba(0,0,255,0.2)" 
        this.ctx.lineWidth = 1
        this.ctx.beginPath()
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

    moveMasses(){
        for (let i=0;i<this.masses.length;i++){
            this.masses[i].move(this)
            if(this.gravityOn){
                this.masses[i].velocity=this.masses[i].velocity.add(this.gravity)
                this.masses[i].velocity.multiplyIn(0.97)
            }
        }
    }

    applyGravity(){
        for (let i=0;i<this.masses.length;i++){
            
            if(this.gravityOn){
                this.masses[i].velocity=this.masses[i].velocity.add(this.gravity)
                
            }
        }
    }

    applyDrag(){
        for (let i=0;i<this.masses.length;i++){
           
           
               
                this.masses[i].velocity.multiplyIn(0.99)
            // if(this.masses[i].velocity.length()<0.1){
            //     this.masses[i].velocity=new Vector(0,0)
            // }
        } 
    }
    drawMasses(){
        this.ctx.lineWidth = 1 ;
        
            this.ctx.beginPath()
        for (let i=0;i<this.masses.length;i++){
            this.masses[i].draw(this)
        }
        this.ctx.stroke()
    }

    drawSprings(){
        for (let i=0; i <this.springs.length;i++){
            this.springs[i].draw(this)
        }
    }

    stretchSprings(){
        for (let i=0; i <this.springs.length;i++){
            this.springs[i].stretch(this)
        }
    }
    
    mouseDown(e:MouseEvent){
        // this.mouseMove(e.clientX,e.clientY)
        if(this.editMode == false){

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

        }}
    
        
       // mass.draw(this)
    }
    mouseUp(e:MouseEvent){
    if(this.editMode == false){
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
        

            this.springs.push( new Spring(this,this.downMass!,this.upMass))
        }
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
            let s = this.springs[j]
            if(!s.broken){
                if(!s.outsideBox(this.mouseCoords)){
                // console.log("inside");
                // console.log(s.distanceFrom(this.mouseCoords))
                
                if(s.distanceFrom(this.mouseCoords) < 10){ 
                    this.selectedSpring = s
                    // this.springs.splice(1)
                }
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



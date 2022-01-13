"option strict;"

export module Sound{

    const audio:Record<string,AudioBuffer>={} //HTMLAudioElement[]=[]    
    const AudioContext = window.AudioContext // || window.webkitAudioContext;

    let dataArray:Uint8Array 
    let audioCtx:AudioContext 

    export function state(){return audioCtx.state}

    export async function setup(sounds:string[]){

        try{
            console.log ("Creating audio context")
            audioCtx = new AudioContext();
        }
        catch(e:any){
            console.log(e.message)
        }
        await Promise.all(
        sounds.map(async s=>{
            console.log("loadaudio " +s)      
            loadAudio(s)         
        })
        )
    }

    export async function resume(){
        await audioCtx.resume()
    }
    async function loadAudio(f:string){

        const response = await(fetch(`./sfx/${f}.mp3`))
        console.log ("fetched "+f)
        const arrayBuffer = await response.arrayBuffer();
        console.log ("got buffer "+f)

        audioCtx.decodeAudioData(arrayBuffer,audioBuffer=>{
            audio[f]=audioBuffer;
            console.log("decoded "+f)}
            ,e=>alert(e.message));    
    }
    export function play(sound:string,v:number){

        var gainNode = audioCtx.createGain();

        const source = audioCtx.createBufferSource()
        source.buffer = audio[sound]

        source.connect(gainNode);

        gainNode.gain.setValueAtTime(v, audioCtx.currentTime)

        gainNode.connect(audioCtx.destination);

        source.start()
    }
}  //end module
"option strict;";
export var Sound;
(function (Sound) {
    const audio = {}; //HTMLAudioElement[]=[]
    const AudioContext = window.AudioContext; // || window.webkitAudioContext ;
    let dataArray;
    let audioCtx;
    function state() {
        return audioCtx.state;
    }
    Sound.state = state;
    async function setup(sounds) {
        try {
            console.log("Creating audio context");
            audioCtx = new AudioContext();
        }
        catch (e) {
            console.log(e.message);
        }
        await Promise.all(sounds.map(async (s) => {
            console.log("loadaudio " + s);
            loadAudio(s);
        }));
    }
    Sound.setup = setup;
    async function resume() {
        await audioCtx.resume();
    }
    Sound.resume = resume;
    async function loadAudio(f) {
        const response = await fetch(`./sfx/${f}.mp3`);
        console.log("fetched " + f);
        const arrayBuffer = await response.arrayBuffer();
        console.log("got buffer " + f);
        audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
            audio[f] = audioBuffer;
            console.log("decoded " + f);
        }, (e) => alert(e.message));
    }
    function play(sound, v) {
        var gainNode = audioCtx.createGain();
        const source = audioCtx.createBufferSource();
        source.buffer = audio[sound];
        source.connect(gainNode);
        gainNode.gain.setValueAtTime(v, audioCtx.currentTime);
        gainNode.connect(audioCtx.destination);
        source.start();
    }
    Sound.play = play;
})(Sound || (Sound = {})); //end module
//# sourceMappingURL=sounds.js.map
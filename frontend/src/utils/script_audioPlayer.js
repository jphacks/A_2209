// CORSエラー回避: about:configからsecurity.fileuri.strict_origin_policyをfalseに
import NavigatorPanner from "./script_myPanner";


export default class AudioPlayer {
    constructor() {
        this.audioContext = new AudioContext();
        this.audioElement = document.getElementById("audio");
        this.audioElement.loop = true;
        this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
        this.panner = new NavigatorPanner(this.audioContext);

        this.audioSource.connect(this.panner);
        this.panner.connect(this.audioContext.destination);
    }
    setCurrentCoordinate(_latitude, _longitude) {
        this.panner.setCurrentCoordinate(_latitude, _longitude);
    }
    setDestinationCoordinate(_latitude, _longitude) {
        this.panner.setDestinationCoordinate(_latitude, _longitude);
    }
    setHeading(_heading) {
        this.panner.setHeading(_heading);
    }
    setAudioURL(fileUrl) {
        this.audioElement.src = "FileUrl";
        this.audioElement.type = "audio/mpeg"
        this.audioElement.crossOrigin = "anonymous";
    }
    play() {
        this.audioElement.volume = 0.1
        this.audioElement.play();
    }
    pause() {
        this.audioElement.pause();
        this.audioElement.volume = 0.0
    }
    stop() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
    }
}
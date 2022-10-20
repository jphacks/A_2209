class AudioPlayer{
    constructor () {
        this.audioObj = null;
        this.audioSource = null;
        this.context = new AudioContext();
        this.panner = this.context.createPanner();
        this.panner.positionX.value = 0;
        this.panner.positionY.value = 0;
        this.panner.positionZ.value = -1;
        this.panner.panningModel = "HRTF";
        this.context.listener.setPosition(0, 0, 0);
        this.context.listener.positionX = 0;
        this.context.listener.positionY = 0;
        this.context.listener.positionZ = 0;
        this.panner.connect(this.context.destination);

    }

    changeFile (_fileUrl) {
        if (this.audioObj !== null) {
            this.audioObj.pause();
            this.audioObj.src = _fileUrl;
        } else {
            this.audioObj = new Audio(_fileUrl);
            this.audioObj.loop = true;
            this.audioSource = this.context.createMediaElementSource(this.audioObj);
            this.audioSource.connect(this.panner);
        }
        this.audioObj.load();
        console.log(this.audioObj.src);
    }

    setPan (_deg) {
        // 左回り
        const rad = _deg*Math.PI/180;
        this.panner.positionZ.value = -Math.cos(rad);
        this.panner.positionX.value = -Math.sin(rad);
    }

    play () {
        if (this.audioObj === null) {
            return;
        }
        this.audioObj.play();
    }

    pause () {
        if (this.audioObj === null) {
            return;
        }
        this.audioObj.pause();
    }

    stop () {
        if (this.audioObj === null) {
            return;
        }
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
    }
}
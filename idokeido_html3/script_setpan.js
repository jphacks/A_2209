class SoundNavigator{
    constructor () {
        this.audioPlayer = new AudioPlayer();
        this.currentLatitude = 0;
        this.currentLongitude = 0;
        this.destinationLatitude = 0;
        this.destinationLongitude = 0;
        this.destinationDirection = 0;
        this.headingDirection = 0;
    }
    static calcAzimath(y1_deg, x1_deg, y2_deg, x2_deg) {
        // 西が90, 北が0, 東が-90
        const deg2rad = Math.PI/180;
        const x1 = x1_deg * deg2rad;
        const y1 = y1_deg * deg2rad;
        const x2 = x2_deg * deg2rad;
        const y2 = y2_deg * deg2rad;
        return -(Math.atan2(Math.sin(x2-x1), (Math.cos(y1)*Math.tan(y2)-Math.sin(y1)*Math.cos(x2-x1))) * 180 / Math.PI);
    }
    get soundDirection () {
        return this.destinationDirection - this.headingDirection;
    }
    setAudioPan (_deg) {
        this.audioPlayer.setPan(_deg);
    }
    setCurrentCoordinate (_latitude, _longitude) {
        this.currentLatitude = _latitude;
        this.currentLongitude = _longitude;
        this.destinationDirection = SoundNavigator.calcAzimath(this.currentLatitude, this.currentLongitude, this.destinationLatitude, this.destinationLongitude);
        this.setAudioPan(this.destinationDirection - this.headingDirection);
    }
    setDestinationCoordinate (_latitude, _longitude) {
        this.destinationLatitude = _latitude;
        this.destinationLongitude = _longitude;
        this.destinationDirection = SoundNavigator.calcAzimath(this.currentLatitude, this.currentLongitude, this.destinationLatitude, this.destinationLongitude);
        this.setAudioPan(this.destinationDirection - this.headingDirection);
    }
    setHeading (_heading) {
        this.headingDirection = _heading;
        this.setAudioPan(this.destinationDirection - this.headingDirection);
    }
    setSoundFile (_fileUrl) {
        this.audioPlayer.changeFile(_fileUrl);
    }
    soundPlay () {
        this.audioPlayer.play();
    }
    soundPause () {
        this.audioPlayer.pause();
    }
    soundStop () {
        this.audioPlayer.stop();
    }
}
const currentLatitudeInput = document.getElementById("currentLatitudeInput");
const currentLongitudeInput = document.getElementById("currentLongitudeInput");
const destinationLatitudeInput = document.getElementById("destinationLatitudeInput");
const destinationLongitudeInput = document.getElementById("destinationLongitudeInput");
const internalCurrentLatitudeDisp = document.getElementById("internalCurrentLatitudeDisp");
const internalCurrentLongitudeDisp = document.getElementById("internalCurrentLongitudeDisp");
const internalDestinationLatitudeDisp = document.getElementById("internalDestinationLatitudeDisp");
const internalDestinationLongitudeDisp = document.getElementById("internalDestinationLongitudeDisp");
const toggleWatchPositionButton = document.getElementById("toggleWatchPositionButton");
const geoSutDisp = document.getElementById("geoSutDisp");
const azimathDisp = document.getElementById("azimath");
const dispSoundAzimath = document.getElementById("dispSoundAzimath");
const dispHeadingAzimath = document.getElementById("dispHeadingAzimath");
const audioFileInput = document.getElementById("audioFileInput");
const audioElement = document.getElementById("audioElement");
const myslider = document.getElementById('myslider');

const audioPlayer = new AudioPlayer();
//https://maou.audio/bgm_neorock83/
audioPlayer.setAudioURL("maodamashii_neorock83.mp3");

dispSoundNavigatorParam();

let watchingPosition = false;
let watchPositionID;
function success(pos) {
    geoSutDisp.innerHTML = "現在地取得完了"

    const curLoc = pos.coords;

    audioPlayer.setCurrentCoordinate(curLoc.latitude, curLoc.longitude);
    currentLatitudeInput.value = curLoc.latitude;
    currentLongitudeInput.value = curLoc.longitude;
    dispSoundNavigatorParam();
}
function error(err) {
    geoSutDisp.innerHTML = "現在地取得失敗"
    console.warn('ERROR(' + err.code + '): ' + err.message);
}
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};
function toggleWatchPosition() {
    if (watchingPosition) {
        navigator.geolocation.clearWatch(watchPositionID);
        watchingPosition = false;
        toggleWatchPositionButton.innerHTML = "現在地自動更新をON";
    } else {
        watchPositionID = navigator.geolocation.watchPosition(success, error, options);
        watchingPosition = true;
        toggleWatchPositionButton.innerHTML = "現在地自動更新をOFF";
    }
}


function getCurPos() {
    geoSutDisp.innerHTML = "現在地取得中";
    navigator.geolocation.getCurrentPosition(success, error, options);
}

function dispSoundNavigatorParam() {
    // 北が0, 西が90
    azimathDisp.innerHTML = audioPlayer.panner.destinationDirection;
    dispSoundAzimath.innerHTML = audioPlayer.panner.soundDirection;
    dispHeadingAzimath.innerHTML = audioPlayer.panner.headingDirection;
    internalCurrentLatitudeDisp.innerHTML = audioPlayer.panner.currentLatitude;
    internalCurrentLongitudeDisp.innerHTML = audioPlayer.panner.currentLongitude;
    internalDestinationLatitudeDisp.innerHTML = audioPlayer.panner.destinationLatitude;
    internalDestinationLongitudeDisp.innerHTML = audioPlayer.panner.destinationLongitude;
}

function setCoordinatesFromInputs() {
    audioPlayer.setCurrentCoordinate(currentLatitudeInput.value, currentLongitudeInput.value);
    audioPlayer.setDestinationCoordinate(destinationLatitudeInput.value, destinationLongitudeInput.value)
    dispSoundNavigatorParam();
}

function updateSndAzimath() {
    // 現在地と目的地から東を向いてる前提で音の向き更新
    // 北が0, 西が90
    let nowDirec = 270;
    audioPlayer.setHeading(nowDirec);
    dispSoundNavigatorParam();
}

// deviceOrientationAbsoluteの代わり
function inputChange(){
    // 北が0, 西が90
    let nowDirec = myslider.value;
    audioPlayer.setHeading(nowDirec);
    dispSoundNavigatorParam();
}
myslider.addEventListener('input', inputChange);

function resetSndAzimath() {
    audioPlayer.panner.setPan(0);
    dispSoundNavigatorParam();
}

function play() {
    audioPlayer.play();
}
function pause() {
    audioPlayer.pause();
}
function stop() {
    audioPlayer.stop();
}

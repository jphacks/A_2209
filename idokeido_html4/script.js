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

const audioContext = new AudioContext();
const audioSource = audioContext.createMediaElementSource(audioElement);
const navigatorPanner = new NavigatorPanner(audioContext);
audioSource.connect(navigatorPanner);
navigatorPanner.connect(audioContext.destination);

dispSoundNavigatorParam();

let watchingPosition = false;
let watchPositionID;
function success(pos) {
    geoSutDisp.innerHTML = "現在地取得完了"

    const curLoc = pos.coords;

    navigatorPanner.setCurrentCoordinate(curLoc.latitude, curLoc.longitude);
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
    azimathDisp.innerHTML = navigatorPanner.destinationDirection;
    dispSoundAzimath.innerHTML = navigatorPanner.soundDirection;
    dispHeadingAzimath.innerHTML = navigatorPanner.headingDirection;
    internalCurrentLatitudeDisp.innerHTML = navigatorPanner.currentLatitude;
    internalCurrentLongitudeDisp.innerHTML = navigatorPanner.currentLongitude;
    internalDestinationLatitudeDisp.innerHTML = navigatorPanner.destinationLatitude;
    internalDestinationLongitudeDisp.innerHTML = navigatorPanner.destinationLongitude;
}

function setCoordinatesFromInputs() {
    navigatorPanner.setCurrentCoordinate(currentLatitudeInput.value, currentLongitudeInput.value);
    navigatorPanner.setDestinationCoordinate(destinationLatitudeInput.value, destinationLongitudeInput.value)
    dispSoundNavigatorParam();
}

function updateSndAzimath() {
    // 現在地と目的地から東を向いてる前提で音の向き更新
    // 北が0, 西が90
    let nowDirec = 270;
    navigatorPanner.setHeading(nowDirec);
    dispSoundNavigatorParam();
}

// deviceOrientationAbsoluteの代わり
function inputChange(){
    // 北が0, 西が90
    let nowDirec = myslider.value;
    navigatorPanner.setHeading(nowDirec);
    dispSoundNavigatorParam();
}
myslider.addEventListener('input', inputChange);

function resetSndAzimath() {
    navigatorPanner.setPan(0);
    dispSoundNavigatorParam();
}


function changeFile() {
    const musicFile = audioFileInput.files[0];
    const fileUrl = URL.createObjectURL(musicFile);
    audioElement.src = fileUrl;
}
audioFileInput.addEventListener("change", changeFile);

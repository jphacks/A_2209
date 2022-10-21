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
const myslider = document.getElementById('myslider');
const toggleWatchHeadingButton = document.getElementById("toggleWatchHeadingButton");

const audioPlayer = new AudioPlayer();

const OS = detectOSSimply();

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
    audioPlayer.setPan(0);
    dispSoundNavigatorParam();
}

function resumeAudioContext() {
    audioPlayer.audioContext.resume();
}

function changeFile() {
    const musicFile = audioFileInput.files[0];
    const fileUrl = URL.createObjectURL(musicFile);
    audioPlayer.setAudioURL(fileUrl);
}
audioFileInput.addEventListener("change", changeFile);

function play() {
    audioPlayer.play();
}
function pause() {
    audioPlayer.pause();
}
function stop() {
    audioPlayer.stop();
}

let watchingHeading = false;
function toggleWatchHeading() {
    if (watchingHeading) {
        if(OS == "iphone") {
            window.removeEventListener("deviceorientation", watchHeadingiPhone);
        }else if(OS == "android") {
            window.removeEventListener("deviceorientationabsolute", watchHeadingAndroid);
            //window.removeEventListener("deviceorientation", watchHeadingAndroid);
        }
        watchingHeading = false;
        toggleWatchHeadingButton.innerHTML = "自分が向いてる方向自動更新をON";
    } else {
        if(OS == "iphone") {
            // iPhone + Safariの場合はDeviceOrientation APIの使用許可をユーザに求める
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === "granted") {
                        window.addEventListener("deviceorientation", watchHeadingiPhone);
                        watchingHeading = true;
                        toggleWatchHeadingButton.innerHTML = "自分が向いてる方向自動更新をOFF";
                    }
                })
                .catch(err => {console.log(err)});
        }else if(OS == "android") {
            window.addEventListener("deviceorientationabsolute", watchHeadingAndroid);
            //window.addEventListener("deviceorientation", watchHeadingAndroid);
            watchingHeading = true;
            toggleWatchHeadingButton.innerHTML = "自分が向いてる方向自動更新をOFF";
        }else {
            alert("環境チェックで弾かれました");
        }
    }
}

function watchHeadingiPhone(event) {
    const degrees = 360 - event.webkitCompassHeading;
    audioPlayer.setHeading(degrees);
    dispSoundNavigatorParam();
}

function watchHeadingAndroid(event) {
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
    if (alpha === null) {
        window.removeEventListener("deviceorientationabsolute", watchHeadingAndroid);
        watchingHeading = false;
        toggleWatchHeadingButton.innerHTML = "自分が向いてる方向自動更新をON";
        alert("deviceorientationabsolute非対応");
        return;
    }
    const degrees = 360 - compassHeading(alpha, beta, gamma);
    audioPlayer.setHeading(degrees);
    dispSoundNavigatorParam();
}    

// 端末の傾き補正（Android用）
// https://www.w3.org/TR/orientation-event/
function compassHeading(alpha, beta, gamma) {
    var degtorad = Math.PI / 180; // Degree-to-Radian conversion

    var _x = beta ? beta * degtorad : 0; // beta value
    var _y = gamma ? gamma * degtorad : 0; // gamma value
    var _z = alpha ? alpha * degtorad : 0; // alpha value

    var cX = Math.cos(_x);
    var cY = Math.cos(_y);
    var cZ = Math.cos(_z);
    var sX = Math.sin(_x);
    var sY = Math.sin(_y);
    var sZ = Math.sin(_z);

    // Calculate Vx and Vy components
    var Vx = -cZ * sY - sZ * sX * cY;
    var Vy = -sZ * sY + cZ * sX * cY;

    // Calculate compass heading
    var compassHeading = Math.atan(Vx / Vy);

    // Convert compass heading to use whole unit circle
    if (Vy < 0) {
        compassHeading += Math.PI;
    } else if (Vx < 0) {
        compassHeading += 2 * Math.PI;
    }

    return compassHeading * (180 / Math.PI); // Compass Heading (in degrees)
}

// 簡易OS判定
// https://one-it-thing.com/6555/
function detectOSSimply() {
    let ret;
    if (
        navigator.userAgent.indexOf("iPhone") > 0 ||
        navigator.userAgent.indexOf("iPad") > 0 ||
        navigator.userAgent.indexOf("iPod") > 0
    ) {
        // iPad OS13のsafariはデフォルト「Macintosh」なので別途要対応
        ret = "iphone";
    } else if (navigator.userAgent.indexOf("Android") > 0) {
        ret = "android";
    } else {
        ret = "pc";
    }

    return ret;
}
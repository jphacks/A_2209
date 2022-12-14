import React, { useState, useCallback, useEffect, createContext, useContext, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader"
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';
import Alert from '@mui/material/Alert'
import {Button, IconButton, FormControlLabel} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AudioPlayer from "../utils/script_audioPlayer";
import { CSSTransition } from 'react-transition-group';

import { getAuth, signInWithEmailAndPassword, getRedirectResult, signInWithRedirect, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc } from "firebase/firestore";

import {Signin} from '../components/signin'
import {Signup} from '../components/signup'
import { UserUtils } from "../components/userUtils";
// import { useShadePressed, useLoginPressed, useSignupPressed } from "../hooks/hooks";
import { pressedType, Pressed } from '../contexts/contexts'
import firebaseConfig from "../apis";
import userInfoRegistration from '../components/userInfoRegistration';


import '../css/home.css'
import { borderRadius } from "@mui/system";

const provider = new GoogleAuthProvider();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const auth = getAuth(app);

const Home: React.FC = () => {

  return <Map />
}

type Props = {
  googleMap: google.maps.Map | null;
};

const GoogleMapsContext = createContext<Props>({
  googleMap: null
}
)

type markerInfo = {
  position: google.maps.LatLng; title: string
}



const Markers: React.FC = () => {
  const { googleMap } = useContext(GoogleMapsContext);

  let my_pos: markerInfo
  if (navigator.geolocation) {
    let pos: google.maps.LatLng
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        pos = new google.maps.LatLng({ lat: position.coords.latitude, lng: position.coords.longitude })
        my_pos = { position: pos, title: "yourplace" }
        googleMap?.setCenter(pos)
        make_marker()
      }, 
      (error: GeolocationPositionError) => {
        switch(error.code) {
          case 1:
            alert("???????????????????????????????????????????????????\n???????????????????????????????????????????????????????????????????????????");
            break;
          case 2:
            alert("?????????????????????????????????????????????");
            break;
          case 3:
            alert("????????????????????????????????????");
            break;
          default:
            alert("?????????????????????(?????????????????????"+error.code+")");
            break;
        }
      })
  }

  const infowindow = new google.maps.InfoWindow()

  const make_marker = () => {
    const marker = new google.maps.Marker({
      position: my_pos["position"],
      title: my_pos["title"],
      map: googleMap,
      icon: "me.png",
      animation: google.maps.Animation.DROP

    })
    marker.addListener("click", () => {
      infowindow.close();
      infowindow.setContent(marker.getTitle());
      infowindow.open(marker.getMap(), marker)
    })
  }//end of make_marker


  // console.log(marker.getPosition())
  // const handleClick = useCallback(async () => {
  //   const pos = marker.getPosition()
  //   console.log(pos)
  //   googleMap!.setCenter(new google.maps.LatLng(-34, 151, true));
  //   // googleMap!.setZoom(17);
  // }, [googleMap]);

  // marker.addListener("click",handleClick)
  return <></>
}

const GoogleMaps = (
  props: any
) => {
  const { children } = props
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [destiTitle, setDestiTitle] = useState<string>("");
  const [destiPosition, setDestionPosition] = useState<google.maps.LatLng>(new google.maps.LatLng({ lat: 0, lng: 0 }))
  const [destiMarker, setDestiMarker] = useState<google.maps.Marker>(new google.maps.Marker(null))
  const [showModal, setShowModal] = useState<boolean>(false)
  //audio????????????????????????0:start???????????? 1:??????????????? 2:?????????
  const[isPlaying,setIsPlaying] = useState<Number>(0)
  const [isAudioCreated,setIsAudioCreated] = useState<boolean>(false)
  const apRef = useRef<AudioPlayer>(null!)




  const initGoogleMaps = useCallback(() => {
    const map = new google.maps.Map(document.querySelector("#map")!, {
      center: { lat: -25.344, lng: 131.031 },
      zoom: 8,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: false,
      mapTypeControl: false,
    });
    setGoogleMap(map);
  }, [])

  let searchBox: google.maps.places.SearchBox;
  useEffect(() => {
    const input_tag = document.getElementById("search-box") as HTMLInputElement;
    searchBox = new google.maps.places.SearchBox(input_tag);
    // googleMap?.controls[google.maps.ControlPosition.TOP_CENTER].push(input_tag);

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places?.length != 1) {
        alert("2????????????????????????????????????????????????????????????")
        return;
      }
      const desti = places[0]
      setDestiTitle(desti.name!);
      setDestionPosition(desti.geometry?.location!);
      setShowModal(true);
      endAudio();

    })



  }, []);

  const stopAudio = ()=>{
    apRef.current?.pause()
    setIsPlaying(1)
  }

  const endAudio = ()=>{
    apRef.current?.pause()
    setIsPlaying(0)
  }

  const startAudio = ()=>{
    apRef.current?.play()
    setIsPlaying(2)
  }

  const setMyplaceCenter = ()=>{
    navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
      const pos = new google.maps.LatLng({lat:position.coords.latitude,lng:position.coords.longitude})
      googleMap?.setCenter(pos)
      googleMap?.setZoom(18)
    },(err:GeolocationPositionError)=>{
      console.log(err.message)
    })
  }

  const handleClick = ()=>{
    console.log("handleClick")
    if (!isAudioCreated) {
      apRef.current = new AudioPlayer();
      setIsAudioCreated(true)
    }
    function success(pos: any) {
      const curLoc = pos.coords;
      apRef.current.setCurrentCoordinate(curLoc.latitude, curLoc.longitude);
    }
    
    function error(err: any) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }
    function detectOSSimply() {
      let ret;
      if (
        navigator.userAgent.indexOf("iPhone") > 0 ||
        navigator.userAgent.indexOf("iPad") > 0 ||
        navigator.userAgent.indexOf("iPod") > 0
      ) {
        // iPad OS13???safari?????????????????????Macintosh???????????????????????????
        ret = "iphone";
      } else if (navigator.userAgent.indexOf("Android") > 0) {
        ret = "android";
      } else {
        ret = "pc";
      }

      return ret;
    }

    function compassHeading(alpha: any, beta: any, gamma: any) {
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

    function watchHeadingiPhone(event: any) {
      const degrees = 360 - event.webkitCompassHeading;
      apRef.current.setHeading(degrees);
    }

    function watchHeadingAndroid(event: any) {
      const alpha = event.alpha;
      const beta = event.beta;
      const gamma = event.gamma;
      if (alpha === null) {
        window.removeEventListener("deviceorientationabsolute", watchHeadingAndroid);
        alert("deviceorientationabsolute?????????");
        return;
      }
      const degrees = 360 - compassHeading(alpha, beta, gamma);
      apRef.current.setHeading(degrees);
    }


    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    apRef.current.setDestinationCoordinate(destiPosition.lat(),destiPosition.lng())
    console.log(destiPosition.lat())
    console.log(destiPosition.lng())
    // ap.setAudioURL("music.ogg")
    const watch_position_id = navigator.geolocation.watchPosition(success, error, options);
    const OS = detectOSSimply();

    if (OS == "iphone") {
      // iPhone + Safari????????????DeviceOrientation API???????????????????????????????????????
      (DeviceOrientationEvent as any).requestPermission()
        .then((response: any) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", watchHeadingiPhone);
          }
        })
        .catch((err: any) => { console.log(err) });
    } else if (OS == "android") {
      window.addEventListener("deviceorientationabsolute", watchHeadingAndroid);
      //window.addEventListener("deviceorientation", watchHeadingAndroid);
    } else {
      alert("?????????????????????????????????????????????????????????????????????????????????????????????");
    }
    startAudio()
  }

  function sendSignal(mode: string, initialLat: number, initialLng: number, initialBrg: number, offset: number){
    if(isPressed.user !== null){
      const data = {
        initialBearing: initialBrg,
        initialLatitude: initialLat,
        initialLongitude: initialLng,
        mode: mode,
        offset: offset,
        playing: true,
        routing: true
      }

      try {
        setDoc(doc(db, "users", isPressed.user.uid, "signal", "signal"), data);

        console.log("Document written successfully");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }

  useEffect(() => {
    destiMarker.setMap(null)
    setDestiMarker(
      new google.maps.Marker({
        map: googleMap,
        title: destiTitle,
        position: destiPosition,
        animation: google.maps.Animation.DROP
      }))
    let response = googleMap?.setCenter(destiPosition);
    console.log(response)
    googleMap?.setCenter(destiPosition)

  }, [destiTitle, destiPosition])


  useEffect(() => {
    initGoogleMaps();
  }, []);

  function redirect_home_signedin(user:any) {
    isPressed.setShade(false);
    isPressed.setSignin(false);
    isPressed.setSignup(false);
    isPressed.setIsSignedin(true);
    isPressed.setUser(user);
    isPressed.setAlert(true);
    isPressed.setAlertState('successful');
    // redirect("/");
    setTimeout(() => {isPressed.setAlert(false);}, 5000)
  };

  useEffect(() => {
    getRedirectResult(auth)
    .then((result:any) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential:any = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
      redirect_home_signedin(user)
      userInfoRegistration(user);
      console.log(result)
      isPressed.setCredential(result);
    }).catch((error) => {
      // Handle Errors here.
      console.log(error)
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  });

  const isPressed: pressedType = useContext(Pressed);

  console.log(isPressed.credential)

  return (

    <div style={{ height: window.innerHeight }}>

      <Box sx={{
        width: "100%",
        textAlign: "center",
        height: 80,
        backgroundColor: 'primary.dark',
        left: "50%",
      }}
        alignItems="center"
        justifyContent="center"
        position="absolute"
        zIndex={1000}
        className="header"
        left={0}
        top={0}
      >
        <input id="search-box" style={{
          backgroundColor: "#fff",
          fontFamily: "Roboto",
          fontSize: "25px",
          fontWeight: "300m",
          marginLeft: "12px",
          padding: " 0 11px 0 13px",
          textOverflow: "ellipsis",
          width:"60%",
          height:"80%",
          margin:"0%",
          marginTop:'4px',
          display:'inline'
        }}/>
        <IconButton
          className="loginButton utilButton"
          style={{
            display: isPressed.isSignedin ? "none" : "block",
          }}
          onClick={() => {
            isPressed.setShade(true);
            isPressed.setSignin(true);
            isPressed.setSignup(false);
          }}
        >
          <LoginIcon className="loginIcon utilIcon"></LoginIcon>
        </IconButton>

        <IconButton
          className="userButton utilButton"
          style={{
            display: isPressed.isSignedin ? "block" : "none",
          }}
          onClick={() => {
            isPressed.setShade(true);
            isPressed.setSignin(false);
            isPressed.setSignup(false);
            isPressed.setUserUtils(true);
          }}
        >
          <PersonIcon className="userIcon utilIcon"></PersonIcon>
        </IconButton>
      </Box>

      <div id='map' style={{ height: window.innerHeight }} />
      {
        isPlaying == 2 ? (
          <Button id="musicStopper" color='secondary' variant="contained" style={{ position: "absolute", bottom: "10px", left: '10px', width: '100px', height: '100px' }} onClick={stopAudio}>??????</Button>
        ) : null}
      {
        isPlaying == 1 ? (
          <Button id="musicStopper" color='primary' variant="contained" style={{ position: "absolute", bottom: "10px", left: '10px', width: '100px', height: '100px' }} onClick={startAudio}>??????</Button>
        ) : null}

      <IconButton
        onClick={setMyplaceCenter}
        style={{
        position: "absolute",
        zIndex: "1000",
        right: "5%",
        bottom: "10%",
        border:'solid 2px',
        borderRadius:'20%'
      }}
        >
        <MyLocationIcon style={{width:"3rem",height:"3rem"}}/>
      </IconButton>

      <Fade
        in={isPressed.shade}
        unmountOnExit
      >
        <div
          className="shade"
        // onClick={() => {
        //   isPressed.setShade(false);
        //   isPressed.setSignin(false);
        //   isPressed.setSignup(false);
        // }}
        >
          <Grow
            unmountOnExit
            in={isPressed.signin}
            className="signin signWrapper"
          >
            <div>
              <Signin />
            </div>
          </Grow>

          <Grow
            unmountOnExit
            in={isPressed.signup}
            className="signup  signWrapper"
          >
            <div>
              <Signup />
            </div>
          </Grow>

          <Slide
            mountOnEnter
            unmountOnExit
            in={isPressed.userUtils}
            direction="left"
            className="userUtils"
          >
            <div>
              <UserUtils />
            </div>
          </Slide>

        </div>
      </Fade>

      <Drawer
        anchor="bottom"
        open={showModal}
        onClose={() => { setShowModal(false) }}
        onClick={() => { setShowModal(false) }}
        style={{ textAlign: "center" }}
      >
        <Box style={{ margin: "10px" }}>
          <p>{destiTitle}</p>
          <Box>
            <Button variant="outlined" size='large' onClick={handleClick}>????????????</Button>
          </Box>
        </Box>
      </Drawer>


      <GoogleMapsContext.Provider value={{
        googleMap: googleMap
      }}>
        {children}
      </GoogleMapsContext.Provider>
    </div>
  )

}

const Map: React.FC = () => {
  const key = process.env["REACT_APP_MAP_API_KEY"]!
  const [googleMapsApiLoaded, setgoogleMapsApiLoaded] = useState<boolean>(false);

  const initGoogleMapsApi: any = useCallback(async () => {
    const loader = new Loader({
      apiKey: key,
      version: 'weekly',
      libraries: ["places"]

    });
    await loader.load();
    setgoogleMapsApiLoaded(true)

  }, [])

  initGoogleMapsApi()


  return (
    <>
      {googleMapsApiLoaded && (
        <div>
          <GoogleMaps>
            <Markers />
          </GoogleMaps>
        </div>
      )}
    </>
  );
}

export default Home;

import React, { useState,useCallback, useEffect,createContext, useContext } from "react";
import { Loader } from "@googlemaps/js-api-loader"
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {Button} from '@mui/material';
import AudioPlayer from "./utils/script_audioPlayer";

const App:React.FC = () =>{
  
  return <Map/>
}

type Props = {
  googleMap:google.maps.Map|null;
};

const GoogleMapsContext = createContext<Props>({
  googleMap:null
  }
)

type markerInfo = {
  position:google.maps.LatLng;title:string
}



const Markers:React.FC = ()=>{
  const {googleMap} = useContext(GoogleMapsContext);

  let markers:Array<markerInfo> = [];
  if(navigator.geolocation){
    let pos:google.maps.LatLng 
    navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
    pos = new google.maps.LatLng({lat:position.coords.latitude,lng:position.coords.longitude})
    markers.push({position:pos,title:"yourplace"})
    googleMap?.setCenter(pos)
    make_marker()
    })
  }

  const infowindow = new google.maps.InfoWindow()
  
  const make_marker = () =>{
    markers.forEach(({position,title}) => {
      const marker = new google.maps.Marker({
        position:position,
        title:title,
        map:googleMap,
        animation:google.maps.Animation.DROP
      })
      marker.addListener("click",()=>{
        infowindow.close();
        infowindow.setContent(marker.getTitle());
        infowindow.open(marker.getMap(),marker)
      })
    }

  );
  }//end of make_marker

  useEffect(make_marker,[])

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
  props:any 
) =>{
  const {children} = props
  const [googleMap,setGoogleMap] = useState<google.maps.Map|null>(null);
  const [destiTitle,setDestiTitle] = useState<string>("");
  const [destiPosition,setDestionPosition] = useState<google.maps.LatLng>(new google.maps.LatLng({lat:0,lng:0}))
  const [destiMarker,setDestiMarker] = useState<google.maps.Marker>(new google.maps.Marker)
  const [showModal,setShowModal] = useState<boolean>(false)
  
  let desti_marker:google.maps.Marker;



  const initGoogleMaps = useCallback(()=>{
    const map = new google.maps.Map(document.querySelector("#map")!,{
      center: { lat: -25.344, lng: 131.031 },
      zoom: 8
    });
    setGoogleMap(map);
  },[])
  
  let searchBox:google.maps.places.SearchBox ;
  useEffect(()=>{
    const input_tag = document.getElementById("search-box") as HTMLInputElement;
    searchBox = new google.maps.places.SearchBox(input_tag);
    // googleMap?.controls[google.maps.ControlPosition.TOP_CENTER].push(input_tag);
    
    searchBox.addListener("places_changed",()=>{
      const places = searchBox.getPlaces();
      if (places?.length != 1){
        alert("2つ以上の目的地を設定することはできません")
        return; 
      }
      const desti = places[0]
      setDestiTitle(desti.name!);
      setDestionPosition(desti.geometry?.location!);
      setShowModal(true);
      
    })
    
    
    
  },[]);
  
  const handleClick = ()=>{
    console.log("handleClick")
    const ap = new AudioPlayer();

    function success(pos:any) {
      const curLoc = pos.coords;
      ap.setCurrentCoordinate(curLoc.latitude, curLoc.longitude);
  }
    function error(err:any) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
  }
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

    function compassHeading(alpha:any, beta:any, gamma:any) {
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

  function watchHeadingiPhone(event:any) {
    const degrees = 360 - event.webkitCompassHeading;
    ap.setHeading(degrees);
  }

  function watchHeadingAndroid(event:any) {
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
    if (alpha === null) {
        window.removeEventListener("deviceorientationabsolute", watchHeadingAndroid);
        alert("deviceorientationabsolute非対応");
        return;
    }
    const degrees = 360 - compassHeading(alpha, beta, gamma);
    ap.setHeading(degrees);
}    


    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    ap.setDestinationCoordinate(destiPosition.lat(),destiPosition.lng())
    ap.setAudioURL("./music.ogg")
    const watch_position_id = navigator.geolocation.watchPosition(success,error,options);
    ap.setHeading(89)
    const OS = detectOSSimply();

    if(OS == "iphone") {
      // iPhone + Safariの場合はDeviceOrientation APIの使用許可をユーザに求める
      (DeviceOrientationEvent as any).requestPermission()
          .then((response:any) => {
              if (response === "granted") {
                  window.addEventListener("deviceorientation", watchHeadingiPhone);
              }
          })
          .catch((err:any) => {console.log(err)});
    }else if(OS == "android") {
        window.addEventListener("deviceorientationabsolute", watchHeadingAndroid);
        //window.addEventListener("deviceorientation", watchHeadingAndroid);
    }else {
        alert("環境チェックで弾かれました");
    }

    ap.play()
    return null;
  }

  
  useEffect(()=>{
    destiMarker.setMap(null)
    setDestiMarker(
      new google.maps.Marker({
        map:googleMap,
        title:destiTitle,
        position:destiPosition,
        animation:google.maps.Animation.DROP
      })) 
      let response = googleMap?.setCenter( destiPosition ) ;
      console.log(response)
      googleMap?.setCenter(destiPosition)

  },[destiTitle,destiPosition])

  
  useEffect(()=>{
    initGoogleMaps();
  },[]);


  const marker = new google.maps.Marker({
    map:googleMap,
    title:"hoge",
    position:new google.maps.LatLng({lat:20,lng:20}),
    animation:google.maps.Animation.DROP})

  return (
    <div style={{height:window.innerHeight}}>
      <Box sx={{
        width: window.innerWidth,
        textAlign:"center",
        height: 60,
        backgroundColor: 'primary.dark',
        '&:hover': {
          backgroundColor: 'primary.main',
          opacity: [0.9, 0.8, 0.7],
        },
      }}>
      <input id="search-box" style={{
        color:'red',
        backgroundColor:"#fff",
        fontFamily: "Roboto",
        fontSize: "25px",
        fontWeight: "300m",
        marginLeft: "12px",
        padding:" 0 11px 0 13px",
        textOverflow: "ellipsis",
        width: "400px",
        height:"80%",
        margin:"0%",
        marginTop:'4px'
}}/>
      </Box>
      <div id='map' style={{height:window.innerHeight}}/>
      <Drawer
      anchor="bottom"
      open={showModal}
      onClose={()=>{setShowModal(false)}}
      onClick={()=>{setShowModal(false)}} 
      style={{textAlign:"center"}}
      >
        <Box style={{margin:"10px"}}>
          <p>{destiTitle}</p>
          <Box>
            <Button variant="outlined" size='large' onClick={handleClick}>出発する</Button>
          </Box>
        </Box>
      </Drawer>


      <GoogleMapsContext.Provider value={{
        googleMap:googleMap
      }}>
        {children}
      </GoogleMapsContext.Provider>
    </div>
  )

}


const Map:React.FC = () =>{
  const [googleMapsApiLoaded,setgoogleMapsApiLoaded] = useState<boolean>(false);

  const initGoogleMapsApi:any = useCallback(async ()=>{
    const loader = new Loader({
      apiKey: "AIzaSyDf1aXCWkuVlHMoIlyiWUAjaFo4mPfLKm8",
      version:'weekly',
      libraries:["places"]

    });
    await loader.load();
    setgoogleMapsApiLoaded(true)

  },[])

  initGoogleMapsApi()

  
  return (
    <>
      {googleMapsApiLoaded && (
        <div>
        <GoogleMaps>
          <Markers/>
        </GoogleMaps>
        </div>
      )}
    </>
  );
} 

export default App 
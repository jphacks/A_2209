import React, { useState,useCallback, useEffect,createContext } from "react";
import { Loader } from "@googlemaps/js-api-loader"



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

const GoogleMaps = (
) =>{
  const [googleMap,setGoogleMap] = useState<google.maps.Map|null>(null);
  const initGoogleMaps = useCallback(()=>{
    const map = new google.maps.Map(document.querySelector("#map")!,{
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
    setGoogleMap(map);
  },[])
  
  useEffect(()=>{
    initGoogleMaps();
  },[]);

  return (
    <>
      <div id='map' style={{height:"1000px"}}/>

      <GoogleMapsContext.Provider value={{
        googleMap:googleMap
      }}>
      </GoogleMapsContext.Provider>
    </>
  )

}

const Map:React.FC = () =>{
  const [googleMapsApiLoaded,setgoogleMapsApiLoaded] = useState<boolean>(false);

  const initGoogleMapsApi:any = useCallback(async ()=>{
    const loader = new Loader({
      apiKey: "",
      version:'weekly'
    });
    console.log("now loading")
    await loader.load();
    console.log("load completeed")
    setgoogleMapsApiLoaded(true)

  },[])

  initGoogleMapsApi()

  
  return (
    <>
      {googleMapsApiLoaded && (
        <GoogleMaps/>
      )}
    </>
  );
} 

export default App 
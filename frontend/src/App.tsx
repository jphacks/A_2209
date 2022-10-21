import React, { useState,useCallback, useEffect,createContext, useContext } from "react";
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
  const [showModal,setShowModal] = useState<Boolean>(false)
  
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
    
    
    
  },[])
  
  useEffect(()=>{
    if (!showModal){return}
    const p = document.getElementById("ask-desti") as HTMLParagraphElement;
    p.innerText = destiTitle
  },[showModal])
  
  useEffect(()=>{
    destiMarker.setMap(null)
    setDestiMarker(
      new google.maps.Marker({
        map:googleMap,
        title:destiTitle,
        position:destiPosition,
        animation:google.maps.Animation.DROP
      })) 

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
    <>
      <input id="search-box" style={{
        color:'red',
        backgroundColor:"#fff",
        fontFamily: "Roboto",
        fontSize: "15px",
        fontWeight: "300m",
        marginLeft: "12px",
        padding:" 0 11px 0 13px",
        textOverflow: "ellipsis",
        width: "400px",
}}/>
      <div id='map' style={{height:"1000px"}}/>
      {
        (showModal &&
          <div onClick={()=>{setShowModal(false)}} style={{width:"1000px"}}><p id='ask-desti'></p></div>
          )

      }

      <GoogleMapsContext.Provider value={{
        googleMap:googleMap
      }}>
        {children}
      </GoogleMapsContext.Provider>
    </>
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
import {StyleSheet, View, Text, Alert, Button, Image, ScrollView} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import PropTypes from 'prop-types';
import axios from 'axios';
import { arrayToLatLngArray } from './route-drawer';
import {useSelector, useDispatch } from 'react-redux';
import {updateMarker, updateMarkerLat, updateMarkerLng, updateMarkerZone} from '../src/store/reducers/marker-reducer';
import {setActive} from '../src/store/reducers/edit-reducer'
import { DisplayPoly } from "./route-drawer";
import { setCurrentRoute, setStartPoint, addCP, setMarkerZone, setStartZone, setPreview } from "../src/store/slices/route.slice";

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    flex: 2,
  },
  map: {
    height: 400,

    // flex: 1,
    alignItems: "flex-start",
    justifyContent: 'center',
  },
});

const MapComponent = (props) => {
  // States du composant et constantes
  const _map = useRef(null);
  const {location, zoom, startDrawing, drawConfirmed} = props;
  const [currentRegion, setcurrentRegion] = useState({
    ...location,
    latitudeDelta: zoom,
    longitudeDelta: zoom,
  });

  const [pressedCoord, setpressedCoord] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [routeStart, setrouteStart] = useState([]);
  const [regionName, setRegionName] = useState('');
  const [snapshot, setSnapshot] = useState(null)

  // redux
  const storeMarker = useSelector((state) => state.marker)
  const dispatch = useDispatch()
  const editMode = useSelector((state) => state.editMode.isActive )
  const markerZone = useSelector((state) =>state.routes.zone)
  
  const currentRoute = useSelector((state)=>state.routes.current)

  const [ROUTE, setROUTE] = useState(currentRoute ?? null)
  // let cpCoordinates = [
    // {latitude: 50.85362,  longitude: 4.38651},
    // {latitude: 50.85364,  longitude: 4.38651},
    // {latitude: 50.85362,  longitude: 4.38651},
    // {latitude: 50.85364,  longitude: 4.38651},
    // {latitude: 50.85419,  longitude: 4.39928}
  
  // ]
  // ,{latitude:50.85419,longitude:4.39928},{latitude:xx,longitude:yy}
  useEffect(()=>{
    if(startDrawing) {drawRoute()} 
  },[startDrawing])

  //Rendu des marqueurs forcé par useEffect
  useEffect (() => {
    setROUTE(currentRoute?.slice()); 
    // console.log(currentRoute);
    // console.log("\n"+ROUTE);
  },[currentRoute])


  const displayRouteMarkers = () => {
    if (ROUTE !== null){ROUTE?.map(value => {
      let i = currentRoute.indexOf(value);
      let numero = "";
      let icoImg= ""; 
      if(i==0){numero = "Départ"} else if (i == coordinates.length-1 && i != 0) {numero= "Arrivée"} else {numero = i}
      const lat = value[0]
      const lng = value[1]
      console.log("map compo / draw route markers lat :"+ lat);
      console.log("map compo / draw route markers lat :"+ lng);
      return(<Marker 
        key={i}
        coordinate={{lat,lng}}
        icon={require('../src/img/ico-start.png')}
        title={numero.toString()} 
      />)
    })}
  }
  //Infos de localisation
  //Utilisation de reverse geocoding de geokeo via api
  const URL_BASE =
    'https://geokeo.com/geocode/v1/reverse.php?lat=__LAT__&lng=__LNG__&api=';
  const GEO_API = '2c1475515c9e85ecf586681457aa3f57';

  const getMarkerInfos = async () => {
    let quartier = ""
    let street = ""
    const url =
      URL_BASE.replace('__LAT__', pressedCoord.latitude).replace('__LNG__',pressedCoord.longitude,) + GEO_API;
    axios
      .get(url)
      .then(({data}) => {
        // setMarkerAddress({data});
        // console.log(JSON.stringify(data));
        if (data !== null) {
          const addressInfos = JSON.stringify(data.results[0].address_components);
          const markerLatLng = JSON.stringify(data.results[0].geometry.location)
          // console.log('Marqueur : ' + addressInfos);
          // console.log('Marqueur : ' + markerLatLng);
          quartier = data.results[0].address_components.name;
          street = data.results[1].address_components.street
            ? data.results[1].address_components.street
            : data.results[1].address_components.name;
          console.log(quartier + ' - ' + street);
          if(quartier !== street)
            {setRegionName(quartier + ' / ' + street)}
            else{setRegionName(quartier)};
        }
      })
      .catch(error => {
        console.log(error);
        // seterror(true);
      })
      .finally(() => {});
      
      return({
        latitude : pressedCoord.latitude,
        longitude : pressedCoord.longitude,
        zone : regionName  
      })
  }
  useEffect(() => {
    setRegionName(getMarkerInfos().zone)
    // dispatch(setMarkerZone(regionName))
    // dispatch(updateMarkerZone(regionName))
    setROUTE(currentRoute)
  }, [pressedCoord]);
  useEffect(() => {
    if(regionName !== null){
      dispatch(setMarkerZone(regionName))
      dispatch(updateMarkerZone(regionName))
    }
  }, [regionName])

  //gestion du zoom
  useEffect(() => {
    const posInfos = JSON.stringify(currentRegion);
    // console.log("Zoom: "+posInfos);
    _map.current.animateCamera({zoom: zoom});
    // console.log('changement du niveau de zoom');
  }, [zoom]);

  //mov vers position
  useEffect(() => {
    console.log('Déplacement vers la position');
    _map.current.animateToRegion({
      ...location,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    });
  }, [location]);


  //centrage sur le parcours
  const centerMap = () => { 
    const current = currentRoute?.slice()
    // console.log(current);   
    const tempArray = arrayToLatLngArray(current)
    _map.current.fitToCoordinates(tempArray)
    // console.log(tempArray);
    // console.log("centrage pour capture...");
    
    //capture de la miniature
    // _map.current.animateCamera({zoom: zoom*0.95}) pas de zoom adapté...
    
    setTimeout(()=>{
      const snapshot = _map.current.takeSnapshot({
        height: 100,     // optional, when omitted the view-height is used
        width: 100,      // optional, when omitted the view-width is used
        region: {latitude: currentRegion.latitude,
          longitude: currentRegion.longitude,
          latitudeDelta: currentRegion.latitudeDelta,
          longitudeDelta: currentRegion.longitudeDelta,},    // iOS only, optional region to render
        format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
        quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
        result: 'base64'   // result types: 'file', 'base64' (default: 'file')
      });
      snapshot.then((uri) => {
      // console.log("img ",uri);
      setSnapshot(uri);
      if (editMode) dispatch(setPreview(snapshot))
    });},1500)
    

  }
 useEffect(()=>{
  centerMap()
 },[drawConfirmed])


  useEffect(() => {
    //envoi du marker au store    
    // dispatch(setMarkerZone(regionName))
    // dispatch(updateMarkerZone(regionName))
    dispatch(updateMarkerLat(pressedCoord.latitude))
    dispatch(updateMarkerLng(pressedCoord.longitude))    
    // console.log("store marker à jour"+ " : " + JSON.stringify(storeMarker));
    // console.log("store marker à jour"+ " : " + regionName);  
  },[pressedCoord])


  const showCoord = async e => {
    const coord = e.nativeEvent.coordinate;
    setpressedCoord(coord);
    // console.log("=== map compo  :"+JSON.stringify(coord));
    // e => console.log(e.nativeEvent)
    // console.log(e.nativeEvent.coordinate);
    // //envoi du marker au store
    dispatch(updateMarker({
      latitude : pressedCoord.latitude,
      longitude : pressedCoord.longitude,
      zone : regionName
    }))
    const currentMarker = await getMarkerInfos().then(console.log("currentMarker : "+JSON.stringify(currentMarker)))
    

    // //envoi du marker au store    
    // dispatch(setMarkerZone(regionName))
    // dispatch(updateMarkerZone(regionName))
    // dispatch(updateMarkerLat(pressedCoord.latitude))
    // dispatch(updateMarkerLng(pressedCoord.longitude))    
    // console.log("store marker à jour"+ " : " + JSON.stringify(storeMarker));
    // console.log("store marker à jour"+ " : " + regionName);  
  };

  const routes = useSelector((state) => state.routes);
  
  


  const drawRoute = e => {
    console.log("new route");
    _map.current.animateToRegion({
      latitude: pressedCoord.latitude,
      longitude: pressedCoord.longitude,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    });
    showCoord(e);
    if (!editMode) {
      dispatch(setCurrentRoute(null));
      Alert.alert(
        '',
        'Voulez-vous tracer un nouveau parcours à partir de cette position ?',
        [
          {
            text: 'Non',
            style: 'cancel',
          },
          {
            text: 'Oui',
            onPress: () => {
              setrouteStart({latitude : pressedCoord.latitude, longitude : pressedCoord.longitude})
              // props.startDrawing = false;
              const newRoute = []
              // newRoute.name = regionName;
              // newRoute.region = regionName
              newRoute.push([pressedCoord.latitude,pressedCoord.longitude])
              // newRoute.length = 0
              dispatch(setCurrentRoute(newRoute))
              dispatch(setActive())
              dispatch(setStartZone(regionName))
              
              // dispatch(addCP([pressedCoord.latitude,pressedCoord.longitude]))
              // console.log("new route started : "+ JSON.stringify(currentRoute))
            },
            style: 'default',
          },
        ],
        {cancelable: true},
      );
    }
  };

  const normalMsg = "Astuces :\n°touchez la carte pour y placer un repère\n\n°appuyez sur le repère pour commencer à tracer un parcours."

      return (
    <View style={styles.container}>
      {/* <Text>Region : {regionName}</Text> */}
      <MapView
        ref={_map}
        onRegionChangeComplete={region => {
          setcurrentRegion(region);
          // console.log(region);
        }}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onPress={(e) => showCoord(e)}
        onPoiClick={e => showCoord(e)}
        drawConfirmed={()=>centerMap()}
        // onLongPress={e => drawRoute(e)}
        >
        {pressedCoord.latitude !== 0 && pressedCoord.longitude !== 0 ? (
          
            <Marker
              coordinate={{
                latitude: storeMarker.latitude,
                longitude: storeMarker.longitude,
              }}
              image={require('../src/img/ico-here.png')}
              title="Votre repère"
              onPress={e => drawRoute(e)}
            ></Marker>
          
        ) : null}
        {editMode? (          
          <Marker 
          coordinate={routeStart}
          image={require('../src/img/ico-start.png')}
          title="Départ"/>
          ) : null }
          {(editMode && currentRoute.length >1)? (          
          <Marker 
          coordinate={{latitude :currentRoute[currentRoute.length - 1][0],longitude :currentRoute[currentRoute.length - 1][1]}}
          image={require('../src/img/ico-start.png')}
          title="Arrivée"/>
          ) : null }
        {editMode? 
        // (<Polyline 
        //     coordinates={cpCoords}
        //     lineDashPattern={[1,10]}
        //     strokeWidth={6}/>)
        (<DisplayPoly />)
            :null}
            
      </MapView>

      {/* <View
        style={{
          flexDirection: 'row',
          flex:1
        }}>
      </View> */}
        <View style={{height:35}} />
      {/* <Image source={{ uri: `data:/png;base64,${snapshot}` }} style={{height:100, width:100, resizeMode:"center"}}/> */}
        {/* <Button title="Contenu du store" onPress={()=>{console.log("contenu du store : "+ JSON.stringify(entireStore))}} /> */}
        {/* <Button title="Centrage" onPress={()=>{console.log("centrage de map..."); centerMap() }} /> */}
        {/* <Text style={{marginTop:13,flex:1, fontSize:15, fontStyle:"italic"}}>{editMode? null : normalMsg}</Text> */}
        
    </View>
  );
};

export default MapComponent;

// Image source={{ uri: `data:/png;base64,${snapshot}`
// affichage d'une image enregistrée en base64
import {StyleSheet, View, PermissionsAndroid, Text, TextInput, TouchableOpacity, Image, Dimensions}from 'react-native'
import React, {useEffect, useState, useRef } from 'react'
import MapComponent from '../components/map-component'
import RouteDrawer from '../components/route-drawer';
import Geolocation from 'react-native-geolocation-service';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {useSelector, useDispatch } from 'react-redux';
import RoutesContainer from './routes-container';
import HintBoard from '../components/hint-board';
import { getHeaderTitle } from '@react-navigation/elements';
import { useRoute } from '@react-navigation/native';
import { setActive } from '../src/store/reducers/edit-reducer';

const SCREEN_HEIGHT = Dimensions.get("window").height
const MapContainer = () => {
    
    const [location, setLocation] = useState()
    const [zoom, setZoom] = useState(16)
    const [confirmDraw, setconfirmDraw] = useState(false)
    const [visibility, setvisibility] = useState(false)
    const editMode = useSelector(state => state.editMode)
    const [drawMode, setDrawMode] = useState(false)
    const currentMarker = useSelector(state => state.marker)
    // const titre = getHeaderTitle()

    // useEffect(()=>{
    //     if(editMode == true){setDrawMode(true)} else setDrawMode(false)
    //     // if(editMode){setDrawMode(false)}
    // },[editMode])        


    const moveToLocation = () => {
        requestLocationPermission();
        Geolocation.getCurrentPosition(
          position => {
            setZoom(17),
            // setTimeout(() => {
            //     console.log("arrivé !");
            // }, 1000);
            setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude})
            
            console.log(location);
          },
            error => {}
        );
    }
    
    //Ask location permission
    const requestLocationPermission = async () => {
        console.log("demande de permission");
        const authorization = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        if(authorization === "granted"){
            console.log("permission accordée");
        } else { console.log("permission refusée"); }
    }
    const toggleDrawing = () => {
        setvisibility(!visibility)
    }
        

    
    const centerToCurrentLocation = () => {
        moveToLocation();
      }
    
    //   centrage de la map sur le parcours
    const confirmDrawRoute = () => {
        setconfirmDraw(!confirmDraw)
    }

    
    const handleZoom = (name) => {
        switch(name){
            case "zoom-in" : {(zoom<15)? setZoom(zoom+2) : (zoom<19)?setZoom(zoom+1):null;
            console.log("zoom : "+zoom);}
            break;
            case "zoom-out" : {(zoom>11)? setZoom(zoom-1.5) : (zoom>3)?setZoom(zoom-2):null;
                console.log("zoom : "+zoom);}
            break;
            default : console.log("mauvaise manip");
        }
    } 

    return(
       
        <View style={styles.Conteneur}>
            <View style={styles.MapContainer}>
                <MapComponent location={location} zoom={zoom} 
                    startDrawing={drawMode}
                    drawConfirmed={confirmDraw}
                    />
                {editMode.isActive ?(<RouteDrawer confirmDraw={() => confirmDrawRoute()} />):(null)}
                <TouchableOpacity
                    style={styles.FloatingButtonDown}
                    onPress={() => {handleZoom("zoom-out")}}>
                        
                        <Image 
                        source={require("./../src/img/ico-zoom-out.png")}
                        style={styles.FloatingButtonImage}/> 
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.FloatingButtonUp}
                    onPress={() => {handleZoom("zoom-in")}}>
                        
                        <Image 
                        source={require("./../src/img/ico-zoom-in.png")}
                        style={styles.FloatingButtonImage}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.FloatingButtonBottom}
                    onPress={()=> centerToCurrentLocation()}>
                        
                        <Image 
                        source={require("./../src/img/ico-locate.png")}
                        style={styles.FloatingBigImage}/>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.FloatingBigLeftBtn}
                    onPress={()=> {
                    if(editMode) setDrawMode(!drawMode)
                    }}>                        
                        <Image 
                        source={require("./../src/img/ico-edit.png")}
                        style={styles.FloatingBigImage}/>
                </TouchableOpacity>
                 
            </View>
            <HintBoard />
        </View>
    
        
    )
}
export default MapContainer

const styles = StyleSheet.create({
    Conteneur: {
        height: SCREEN_HEIGHT
    },
    plainText :{
        flex:1,
        margin:10,
        justifyContent: "center",
        backgroundColor: "grey"
    },
    FloatingButtonUp: {
        position: 'absolute',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        right: 0,
        top: 0,
        backgroundColor:'#5AA',
        borderColor:'#FFF',
        borderTopRightRadius: 20, 
        borderTopLeftRadius: 50,
        elevation:15,
      },
      FloatingButtonDown: {
        position: 'absolute',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        right: 0,
        top: 40,
        backgroundColor:'#5AA',
        borderColor:'#FFF',
        // borderRadius: 100/2
        borderBottomRightRadius: 20, 
        borderBottomLeftRadius: 50,
        elevation: 14,
      },
      FloatingButtonBottom: {
        position: "absolute",
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 0,
        top: 340,
        backgroundColor:'#5AA',
        borderColor:'#FFF',
        // borderRadius: 100/2
        borderRadius:10,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 20,
        elevation:5,
      },
    MapContainer:{
        position: "relative",
        flex: 1,
    },
    FloatingButtonImage: { 
        width: 20,
        height: 20,
        resizeMode: "contain",
        tintColor:'#000',
        backgroundColor: "#5AA"
      },
      FloatingBigLeftBtn:{
        position: "absolute",
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        top: 340,
        backgroundColor:'#5AA',
        borderColor:'#FFF',
        // borderRadius: 100/2
        borderRadius:10,
        borderTopRightRadius: 60,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        elevation:0,
      },
      FloatingBigImage: { 
        width: 36,
        height: 36,
        resizeMode: "contain",
        tintColor:'#000',
        // backgroundColor: "#5AA",
        // borderTopLeftRadius: 5,
        // borderBottomLeftRadius: 20,
        // zIndex:5
      }
})
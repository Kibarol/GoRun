import {StyleSheet, Image, View, Dimensions, Text, Alert, TouchableOpacity, Modal, TextInput, Button, ToastAndroid, ScrollView }from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setInactive } from '../src/store/reducers/edit-reducer';
import {addCP, addRoute, removeRoute, updateRoute, Route, setCurrentRoute, setRouteName, setRouteRegion, setRunLength} from "../src/store/slices/route.slice";
import RouteInfos from './route-infos';
import { Marker, Polyline } from 'react-native-maps';
import { hideMarker } from '../src/store/reducers/marker-reducer';

const SCREEN_HEIGHT = Dimensions.get("window").height
export const arrayToLatLngArray = (array) => {
    const objArray = []
    if (array !== null){
        array?.map((value) => {
            objArray.push({latitude : value[0], longitude : value[1]})
        })}
    return objArray
}
// let cpCoordinates = []
export const DisplayPoly = () => {
    const editMode = useSelector((state) => state.editMode.isActive )
    const routes = useSelector((state) => state.routes);
    const marker = useSelector((state)=> state.marker.value)
    
    return( 
        //la polyline ne place pas ses arêtes aux bonnes coord...       
            <Polyline 
                coordinates={arrayToLatLngArray(routes.current)}
                lineDashPattern={[1,10]}
                strokeWidth={8}
                geodesic={true}
                strokeColor={"#55A"}
            />              
            );
                       
}

const RouteDrawer = (props) => {
    const marker = useSelector(state => state.marker)
    const confirmDraw = props
    const editMode = useSelector((state) => state.editMode.isActive )
    const dispatch = useDispatch()
    const routes = useSelector((state) => state.routes);
    const startPoint = [marker.latitude,marker.longitude]
    // console.log("routedrawer: "+JSON.stringify(routes));
    const route = routes.current;
    
    const [etapes, setEtapes] = useState(route)
    const [runName, setrunName] = useState("")
    const [runZone, setrunZone] = useState("")
    const [runLength, setrunLength] = useState("0 m")
    const [modalIsVisible, setmodalIsVisible] = useState(false)

    useEffect(() => {
        let zone;
        (marker !== null)? zone = marker.zone : zone = "Zone inconnue"
        setrunZone(zone);
        // setrunName(marker.value.zone) undefined
        setrunName(zone)
        // setEtapes([startPoint])
        // route.region = marker.value.zone;
        // route.name = marker.value.zone;
        // console.log("draw route / marqueur :"+JSON.stringify(marker))
        // console.log("draw-route/ new route: "+JSON.stringify(route));
    }, [editMode])

    const showToast = () => {
        ToastAndroid.showWithGravity("Parcours enregistré", ToastAndroid.SHORT, ToastAndroid.TOP);
      };
      //override du bouton retour

      
    //centrage de la map sur le parcours
    const centerOnRoute = () => {
        // console.log(etapes);
        
        // confirmer la sauvegarde
        if(runName !==""){
            Alert.alert(
                "Fin du tracé",
                `Voulez-vous enregistrer ce parcours ?\n\n${runName}\n\n`,
                [
                    {
                        text: "Non",
                        style: "cancel"
                    },
                    {
                        text: "Renommer",
                        onPress: () => {
                            editName();
                        },
                        style: "default"
                    },
                    {
                        text: "Oui",
                        onPress: () => {
                            // dispatch(setRouteName(runName))
                            // dispatch(setRouteRegion(runZone))
                            dispatch(setInactive());
                            dispatch(setRunLength(runLength))
                            dispatch(addRoute(etapes));
                            // pop up de confirmation
                            showToast()
                        },
                        style: "default"
                    },
                ],
                {cancelable: false})
        } else Alert.alert("Nom de course invalide","Veuillez entrer un nom de course valide", [
            {
                text: "OK",
                style: "default",
                onPress: () =>{setmodalIsVisible(true)}
            }
        ])
    }



    //calcul de distance avec coord gps 
    const totalLength = (array) => {
        let length = 0
        for(let i = 1; i <array.length; i++) { 

            const d = gpsDistance(array[i],array[i-1])
            // console.log("distance calculée : ",d);
            length += d
            
        }
        const roundedLength = (length <1000 ) ? (Math.floor(length*100)/100.0+ " m") : (Math.floor(length)/1000.0 + " km")
        return (roundedLength)
    }
    const gpsDistance = (p1, p2) => {
        const rayTerre = 6367445
        const toRad = (v) => {
            return(v * Math.PI/180.00)
        }
        const a = toRad(p1[0])
        const b = toRad(p2[0]) 
        const c = toRad(p1[1])
        const d = toRad(p2[1])
        const dist = rayTerre * Math.acos(Math.sin(a)*Math.sin(b) + Math.cos(a)*Math.cos(b)*Math.cos(c-d))
        // console.log("gpsdist :",dist);
        return(dist)
    } 
    const _floatBtn = useRef(null)
    _floatBtn.current?.animateButton()
    const actions = [
        {
            text: 'Ajouter une étape',
            icon: require("../src/img/ico-add-flag.png"),
            name: 'add-marker',
            position: 1,
        },
        {
            text: 'Supprimer la dernière étape',
            icon: require("../src/img/ico-del-flag.png"),
            name: 'del-marker',
            position: 2
        },
        {
            text: 'Terminer',
            icon: require("../src/img/ico-run.png"),
            name: 'complete',
            position: 3,
        },
    ]
    //actions associées aux boutons
    const handleAction = (name) => {
        // console.log(name);
        switch(name){
            case "endDraw" :{
                dispatch(hideMarker())
                props.confirmDraw(true)
                setTimeout(()=>centerOnRoute(),1600)
                
            } break;

            case "addCheckpoint" :{   
                const currentCoord = [marker.latitude,marker.longitude]
                // console.log("Étapes avant :"+etapes)
                // console.log("coord en cours: "+marker.latitude,marker.longitude);
                
                const temp = etapes.slice()
                
                if((temp[temp.length-1][0] != currentCoord[0]) && (temp[temp.length-1][1] != currentCoord[1]))
                    {temp.push(currentCoord)
                    setEtapes(temp)}
                    // console.log("temp array après : "+ temp);
                // console.log("Étapes ensuite :"+ etapes)

                //dispatch en fin de tracé
                
                dispatch(setCurrentRoute(temp))
                setrunLength(totalLength(temp))
                // console.log("marker added !");
                      
            } break;
            case "delCheckpoint" :{
                // console.log(route);
                Alert.alert(
                    "Confirmation",
                    "Voulez-vous vraiment supprimer le dernier checkpoint ?",
                    [
                        {
                            text: "Non",
                            style: "cancel"
                        },
                        {
                            text: "Oui",
                            onPress: () => {
                                const temp = etapes.slice()
                                temp.pop()
                                setEtapes(temp)
                                console.log("route en cours : "+ temp);
                                dispatch(setCurrentRoute(temp))
                                setrunLength(totalLength(temp))
                            },
                            style: "default"
                        },
                    ],
                    {cancelable: true})
                console.log("route en cours : " + etapes);
            } break;
            case "cancelDraw" : {
                
                Alert.alert(
                    "Fin du tracé",
                    "Voulez-vous annuler le tracé en cours ?",
                    [
                        {
                            text: "Non",
                            style: "cancel"
                        },
                        {
                            text: "Oui",
                            onPress: () => {
                                dispatch(setInactive());
                                dispatch(setCurrentRoute(null))                                
                                setEtapes(null)
                            },
                            style: "default"
                        },
                    ],
                    {cancelable: true})

            } break;
        }
    }
    const editName = (text) => {
        setmodalIsVisible(true)
        // Alert.alert("Choisissez un nom pour cette course")
    }
    
    return(

        <View style={floatstyle.DrawActions}>
            <Modal
                transparent={true}
                visible={modalIsVisible}
                animationType="none"
                >
                    <View style={floatstyle.centeredView}>
                        <Text>Choisissez un nom pour cette course : </Text>
                        <TextInput placeholder={"Nom de la course"} returnKeyType={"send"} value={runName} style={{borderBottomColor:"#355", borderBottomWidth:2, ...floatstyle.plainText}}
                        onChangeText={(text) => {
                            setrunName(text);
                            if(text !== ""){ text.trim()}}}/>
                        <View style={{height:30}}/>
                        <Button title={"Terminer"} onPress={()=>setmodalIsVisible(false)}>Terminer</Button>
                    </View>
            </Modal>
                <TouchableOpacity
                    style={[floatstyle.FloatingAction, floatstyle.TopButton]}
                    onPress={() => {handleAction("addCheckpoint")}}>

                    <Image
                        source={require("../src/img/ico-add-flag.png")}
                        style={[floatstyle.FloatingImg]}
                        />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[floatstyle.FloatingAction, floatstyle.MiddleButton]}
                    onPress={() => {handleAction("endDraw")}}>

                    <Image
                    source={require("../src/img/ico-run.png")}
                    style={[floatstyle.FloatingImg]}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[floatstyle.FloatingAction, floatstyle.BottomButton]}
                    onPress={()=> handleAction("delCheckpoint")}>
                    <Image
                        source={require("../src/img/ico-del-flag.png")}
                        style={[floatstyle.FloatingImg]}/>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[floatstyle.FloatingAction, floatstyle.CancelButton]}
                    onPress={()=> handleAction("cancelDraw")}>
                    <Image
                        source={require("../src/img/ico-cancel.png")}
                        style={[floatstyle.FloatingImg]}/>
                </TouchableOpacity>
                <View
                // style={floatstyle.conteneur}
                >
                {(editMode) ? (                   
                    <RouteInfos
                    runZone={runZone} runLength={runLength} runName={runName} editName={()=> editName()}
                    />
                ):(null)
                }
                </View>
                 

        </View>

    )
}
export default RouteDrawer


const floatstyle = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22,
        backgroundColor: "rgba(255, 255, 255, 0.9)"
      },
    conteneur: {
        position: "absolute",
        top:0,
        flex: 1,
        zIndex: 999,
        width:1,
        height:1
    },
    DrawActions: {
        zIndex:1,
        position: 'absolute',
        // width: 40,
        height: SCREEN_HEIGHT,
        alignItems: 'center',
        justifyContent: "flex-start",
        // right: 5,
        top: 0,
        // backgroundColor:'#5AA',
        borderColor:'#FFF',
        // borderTopRightRadius: 50,
        // borderTopLeftRadius: 50,
        flex: 1,
    },
    plainText :{
        // margin:10,
        justifyContent: "center",
        // backgroundColor: "grey",
        fontSize: 20,
    },
    FloatingAction: {
        // flexDirection:"column",

        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',

        borderColor:'#FFF',
        borderRadius: 60,
        elevation:5,
    },
    FloatingImg:{
        position: 'absolute',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    CancelButton:{
        left: 0,
        top: 160,
        backgroundColor:"firebrick",
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 20,
        elevation:5
    },
    TopButton :{
        backgroundColor:'#55F',
        alignContent: "space-around",
        // bottom: 5,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 20,
    },
    MiddleButton :{
        backgroundColor:'#3E3',
        alignContent:"center",
        // bottom: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 5,
    },
    BottomButton :{
        backgroundColor:'#A55',
        alignContent: "space-around",
        left: 0,
        bottom: 0,
        borderBottomLeftRadius: 5,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 5,

    },
})

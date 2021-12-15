import {StyleSheet, Image, View, Dimensions, Text, Alert, TouchableOpacity}from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import PropTypes from 'prop-types';
const SCREEN_WIDTH = Dimensions.get("window").width
const RouteInfos = (props) => {

    const {runZone,
        editName, 
        runLength, 
    //     // runPreview, 
        runName} = props
    const editRunName = () => {
        console.log("edit name");
        props.editName()
    }

    return(
        <View style={styles.conteneur}>
            <Text>Détails du parcours :</Text>
            <View style={{flexDirection:"row", flex:2}}>
                <TouchableOpacity 
                    style={styles.FloatingAction}
                    onPress={()=>{editRunName()}}>
                    <Image
                        source={require("../src/img/ico-edit.png")}
                        style={styles.FloatingIco}
                    /> 
                </TouchableOpacity>
                <View style={{width:5}}/>
                <Text style={styles.title}>Course : {runName}</Text>
            </View >
            <Text>Region : {runZone}</Text>
            <Text style={styles.length}>Longueur totale : {runLength}</Text>
            
        </View>
    )
}
export default RouteInfos

const styles = StyleSheet.create({
    conteneur:{
        position: "absolute",
        top : 160,
        left:-30,
        width:(SCREEN_WIDTH),
        padding:10,
        // backgroundColor: "#F2F3F4",        
        backgroundColor: "#3E3",        
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 20,
        flex:1,        
    },
    length:{
        fontSize :18,
        fontWeight: "bold",
        fontStyle:"italic",
        textAlign:"right"
    },
    title:{
        fontWeight: "bold",
        fontSize:18,
    },
    FloatingAction: {
        // flexDirection:"column",
        color: "#FFF",
        width: 25,
        height: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#2B2",
        borderColor:'#FFF',
        borderRadius: 5, 
    },
    FloatingIco:{
        // position: 'absolute',
        width: 15,
        height: 15,
        alignItems: "flex-end",
        justifyContent: 'center',
    },

})
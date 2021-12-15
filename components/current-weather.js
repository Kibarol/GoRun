import {StyleSheet, View, PermissionsAndroid, Text, TextInput, TouchableOpacity, Image, Dimensions}from 'react-native'
import React, {useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux';
const SCREEN_HEIGHT = Dimensions.get("screen").height
const CurrentWeather = () => {

    return(
        <TouchableOpacity
                        style={styles.FloatBtn}
                        onPress={()=> console.log("params")}>
            <View style={{flexDirection:'row', width:60}}>
                <Image source={require(".././src/img/ico-cloudy.png")} style={styles.ImgBtn}/>
                <Text style={{padding:5, textAlignVertical:"center"}}>26.7°C</Text>
            </View>
                        
        </TouchableOpacity> 
    )
}
export default CurrentWeather
const styles = StyleSheet.create({
    FloatBtn:{
      height: 30,
      width: 40,
      elevation:30,
      // backgroundColor:"#000",
    },
    ImgBtn:{
      height: 30,
      width: 30,
      zIndex:50,
    },
    mainContainer:{height:SCREEN_HEIGHT},
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
    container:{
      flex:1,
      // backgroundColor:"#999"
    }
  });
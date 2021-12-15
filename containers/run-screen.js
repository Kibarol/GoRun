import React from 'react'
import {
    StyleSheet,
    View,
    PermissionsAndroid,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    Modal,
  } from 'react-native';
import { useSelector } from 'react-redux';

const RunScreen = () => {
    const username = useSelector((state)=>state.appUser.username)


    return(
        <View>
            <Text> </Text>
            <Text style={styles.title}>Bienvenue, {username} !</Text>
        </View>
    )
}
export default RunScreen
const styles = StyleSheet.create({
    title: {
      fontSize: 25,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    IcoImg:{
      // backgroundColor:"#111",
      width: 30,
      height: 30,
      zIndex:25,
    },
      CenteredView: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          // marginTop: 22,
          backgroundColor: "rgba(255, 255, 255, 0.9)"
          },
  });
  
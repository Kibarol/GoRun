import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Dimensions,
    useColorScheme,
    View,
    Text,
    TouchableOpacity,
    Button,
    Image,
  } from 'react-native';
  import {NavigationContainer, useNavigation} from '@react-navigation/native';

const SettingsButton = () => {
    const nav = useNavigation()
  return (
    <TouchableOpacity
      style={styles.FloatBtn}
      onPress={() => {
        console.log('params');
        nav.navigate('Settings');
      }}>
      <Image
        source={require('.././src/img/ico-param.png')}
        style={styles.ImgBtn}
      />
    </TouchableOpacity>
  );
};
export default SettingsButton;
const styles = StyleSheet.create({
    FloatBtn: {
      height: 30,
      width: 40,
      elevation: 30,
      // backgroundColor:"#000",
    },
    ImgBtn: {
      height: 30,
      width: 30,
      zIndex: 50,
    }})
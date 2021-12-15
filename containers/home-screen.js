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
import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import CurrentWeather from '../components/current-weather';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MapContainer from './map-container';
import RoutesContainer from './routes-container';
import RunScreen from './run-screen';
import ProfileScreen from './profile-screen';
import { setCurrentScreen } from '../src/store/slices/user-slice';

const HomeScreen = () => {
  const Tab = createBottomTabNavigator();
  const username = useSelector(state => state.appUser.username);
  const dispatch = useDispatch()
  const [visibleModal, setVisibleModal] = useState(true)
    useEffect(() => {
        welcome()
        setTimeout(() => {
            setVisibleModal(false)
        }, 2000);
    }, [])
  const welcome = () => {
    return (
      <Modal 
        transparent={true}
        visible={visibleModal}
        animationType="none">
        <View style={styles.CenteredView}>
          <View>
            <Text style={styles.title}>Bienvenue, {username} !</Text>
          </View>
        </View>
      </Modal>
    );
  };
  return (
    <NavigationContainer 
        independent={true}>
      <Tab.Navigator
      initialRouteName="GoRun"
      backBehavior="initialRoute"
      screenOptions={
            ({route})=>({
                headerShown:false,
            tabBarIcon:({ focused, color, size }) => {
                switch(route.name){
                    case "GoRun": return <Image source={require("../src/img/ico-run.png")} style={styles.IcoImg} />;
                    break;
                    case "Routes": return <Image source={require("../src/img/ico-list.png")} style={styles.IcoImg} />;
                    break;
                    case "Carte": return <Image source={require("../src/img/ico-map.png")} style={styles.IcoImg} />;
                    break;
                    case "Profil": return <Image source={require("../src/img/ico-user.png")} style={styles.IcoImg} />;
                    break;
                    case "Routes": return <Image source={require("../src/img/ico-list.png")} style={styles.IcoImg} />;
                    break;
                }                
            }})}
        >
        <Tab.Screen name="Routes" component={RoutesContainer} options={{lazy:false}} listeners={{
            state: () => { dispatch(setCurrentScreen("Routes")) },
        }} />
        <Tab.Screen name="Carte" component={MapContainer} listeners={{
            state: () => { dispatch(setCurrentScreen("Carte")) },
        }} />
        <Tab.Screen name="GoRun" component={RunScreen} listeners={{
            state: () => { dispatch(setCurrentScreen("Go Run")) },
        }} />
        <Tab.Screen name="Profil" component={ProfileScreen} listeners={{
            state: () => { dispatch(setCurrentScreen("Profil")) },
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
export default HomeScreen;
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

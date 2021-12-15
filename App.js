import React, {useState} from 'react';
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
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import MapContainer from './containers/map-container';
import LoginForm from './components/login-form';
import {NavigationContainer } from '@react-navigation/native';
import store from './src/store/store';
import {Provider, useSelector} from 'react-redux';
import RoutesContainer from './containers/routes-container';
import AppParameters from './components/parameters';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getHeaderTitle} from '@react-navigation/elements';
import HomeScreen from './containers/home-screen';
import CurrentWeather from './components/current-weather';
import SettingsButton from './components/settings-button';
import {Switch, Route} from "react-router-dom";

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const App = ({navigation}) => {
  const isLogged = useSelector(state => state.appUser.isLogged);
  const screenTitle = useSelector(state => state.appUser.currentScreen) 
  const isDarkMode = useColorScheme() === 'dark';
  const Stack = createNativeStackNavigator();
  console.log('hi!');
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLogged ? HomeScreen : LoginForm}
          screenOptions={{
            // gestureEnabled:true,
            headerMode: 'float',
            headerStyle: {backgroundColor: '#5aa', height: 80},
            title: screenTitle,
          }}>
          {!isLogged ? (
            <Stack.Screen
              name="Connexion"
              component={LoginForm}
              options={{
                headerTitle: 'Connexion',
                headerRight: () => (
                  <SettingsButton />
                ),
                headerTitleAlign: 'center',
              }}
            />
          ) : (
            <Stack.Screen
              name="Accueil"
              component={HomeScreen}
              options={{
                headerTitle: 'Accueil',
                headerLeft: () => <CurrentWeather />,
                headerRight: () => (
                  <SettingsButton />

                ),
                headerTitleAlign: 'center',
              }}
            />
          )}
          <Stack.Screen
            name="Settings"
            component={AppParameters}
            options={{title: 'Paramètres'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: Colors.lighter,
  },
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
  },
  mainContainer: {height: SCREEN_HEIGHT},
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
  container: {
    flex: 1,
    // backgroundColor:"#999"
  },
});

export default App;

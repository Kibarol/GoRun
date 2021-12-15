/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import store from './src/store/store';
import {Provider} from 'react-redux';
import React from 'react';
import config from './config';

//firebase configuration
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { BrowserRouter } from "react-router-dom";
import { RootReducer } from './src/store/reducers/reducers';
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";


const firebaseConfig = {
  apiKey: config.REACT_APP_FIREBASE_API_KEY,
  authDomain: "gorun-35292.firebaseapp.com",
  projectId: "gorun-35292",
  storageBucket: "gorun-35292.appspot.com",
  messagingSenderId: "574278561651",
  appId: "1:574278561651:web:b14469af8deb3f66401f06"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();


const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
};
const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, //since we are using Firestore
};

const AppWithStore = () => (
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      {/* <BrowserRouter> */}
        <App />
      {/* </BrowserRouter> */}
    </ReactReduxFirebaseProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => AppWithStore);

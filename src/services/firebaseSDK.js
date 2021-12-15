import firebase from 'firebase';
import {initializeApp} from '@react-native-firebase/app'
import {getAuth} from 'firebase/auth'

export const FirebaseSDK = firebase.initializeApp({
  apiKey: process.env.REACT_API_FIREBASE_KEY,
  authDomain: "gorun-35292.firebaseapp.com",
  projectId: "gorun-35292",
  storageBucket: "gorun-35292.appspot.com",
  messagingSenderId: "574278561651",
  appId: "1:574278561651:web:b14469af8deb3f66401f06"
});

const login = async (user, success_callback, failed_callback) =>{
    await firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(success_callback,failed_callback)
}
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)


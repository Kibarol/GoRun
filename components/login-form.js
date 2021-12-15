import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
  Button,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import CheckBox from '@react-native-community/checkbox';
import {
  setUsername,
  setPwd,
  setMail,
  setIsRegistered,
  setIsLogged,
} from '../src/store/slices/user-slice';

//SignIn avec Google
import {useFirebase} from 'react-redux-firebase';
import {useHistory} from 'react-router-dom';
import {
  createAccount,
  checkIfUsernameAlreadyExists,
} from '../src/services/firebase-actions';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import config from '../config';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const LoginForm = () => {
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setpwd] = useState('');
  const [mainpwd, setmainpwd] = useState('');
  const [pwd2, setpwd2] = useState('');
  const [visible, setVisible] = useState(false);
  const [stayLogged, setStayLogged] = useState(false);
  const firebase = useFirebase();
  const history = useHistory();

  // GoogleSignin.configure();

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  const signInWithGoogle = () => {
    firebase
      .login({
        provider: 'google',
        type: 'popup',
      })
      .then(() => {
        history.push('/home-screen');
      });
  };

  //gestion des erreurs
  const [usernameError, setusernameError] = useState('');
  const [emailError, setemailError] = useState('');
  const [pwdError, setpwdError] = useState('');
  const [loginError, setLoginError] = useState('');

  //Références pour le formulaire
  const _fieldPwd = useRef();
  const _fieldPwd2 = useRef();
  const _fieldEmail = useRef();
  const _fieldUsername = useRef();

  const dispatch = useDispatch();

  //Récupération des données enregistrées
  const savedName = useSelector(state => state.appUser.username);
  const savedPwd = useSelector(state => state.appUser.pwd);
  const registered = useSelector(state => state.appUser.isRegistered == true);

  useEffect(() => {
    console.log(config.REACT_APP_FIREBASE_API_KEY);
    if (registered) {
      setname(savedName);
    }
  }, [registered]);

  //Validation du formulaire
  const regexValidPeople = /^([1-9][0-9]*)?$/;
  const regexValidEmail = /^[^@\s]+@[^@\s\.]+\.[^@\.\s]+$/;

  const verifyLogin = () => {
    setLoginError('');
    let error = false;
    console.log('logging in...');
    console.log(stayLogged);
    if (name == savedName && mainpwd == savedPwd) {
      if (!stayLogged) setmainpwd('');
      dispatch(setIsLogged(true));
      showToast('Connexion...');
    } else {
      error = true;
      showToast('Problème de connexion');
      if (name !== savedName) {
        setLoginError("Nom d'utilisateur inconnu");
      } else {
        setLoginError('Mot de passe incorrect');
      }
    }
  };
  const showToast = msg => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM);
  };
  const register = () => {
    console.log('registering...');
    setVisible(true);
  };

  const validateRegister = () => {
    let error = false;
    setemailError('');
    setusernameError('');
    setpwdError('');
    if (name.trim().length < 1) {
      error = true;
      setusernameError("Choisissez un nom d'utilisateur valide.");
      _fieldUsername.current.focus();
    }
    if (pwd.length < 8) {
      setpwdError("Le mot de passe choisi n'est pas assez long.");
      if (!error) {
        _fieldPwd.current.focus();
        error = true;
      }
    } else if (pwd !== pwd2) {
      setpwdError('Les mots de passe entrés ne correspondent pas.');
      if (!error) {
        _fieldPwd.current.focus();
        error = true;
      }
    }
    if (email.trim().length != 0 && !regexValidEmail.test(email)) {
      setemailError('Entrez une adresse email valide.');
      if (!error) {
        _fieldEmail.current.focus();
        error = true;
      }
    }

    const unavailableUsername = checkIfUsernameAlreadyExists(name);
    if (unavailableUsername) error = true;
    if (!error) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, pwd)
        .then(response => {
          const uid = response.user.uid;
          const data = {
            id: uid,
            email,
            name,
          };
          const usersRef = firebase.firestore().collection('users');
          usersRef
            .doc(uid)
            .set(data)
            .then(() => {
              console.log('nouvel utilisateur : ', data);
            })
            .catch(error => {
              alert(error);
            });
        });
      dispatch(setUsername(name));
      dispatch(setPwd(pwd));
      dispatch(setMail(email));
      dispatch(setIsRegistered(true));
      setVisible(false);
      showToast('Vous êtes bien enregistré(e)');
    }
  };

  const continueUnlogged = () => {
    setStayLogged(false);
    console.log('continuing...');
    dispatch(setIsLogged(true));
  };

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: 'white'}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <ScrollView>
              <Text style={{...styles.Field, ...styles.plainText}}>
                Choisissez un nom d'utilisateur :{' '}
              </Text>
              <TextInput
                placeholder={"Nom d'utilisateur"}
                returnKeyType={'next'}
                value={name}
                ref={_fieldUsername}
                style={{
                  borderBottomColor: '#355',
                  borderBottomWidth: 2,
                  ...styles.InputField,
                }}
                onChangeText={text => {
                  setname(text);
                  if (text !== '') {
                    text.trim();
                  }
                }}
                onSubmitEditing={() => _fieldPwd.current.focus()}
              />

              <Text style={styles.Erreur}>{usernameError}</Text>

              <Text style={{...styles.Field, ...styles.plainText}}>
                Choisissez un mot de passe :{' '}
              </Text>
              <TextInput
                returnKeyType={'next'}
                value={pwd}
                placeholder={'**********'}
                ref={_fieldPwd}
                style={{
                  borderBottomColor: '#355',
                  borderBottomWidth: 2,
                  ...styles.InputField,
                }}
                textContentType="newPassword"
                secureTextEntry={true}
                onChangeText={text => {
                  setpwd(text);
                  if (text !== '') {
                    text.trim();
                  }
                }}
                onSubmitEditing={() => _fieldPwd2.current.focus()}
              />
              <Text style={styles.Erreur}>{pwdError}</Text>

              <Text style={{...styles.Field, ...styles.plainText}}>
                Confirmez votre mot de passe :{' '}
              </Text>
              <TextInput
                returnKeyType={'next'}
                value={pwd2}
                placeholder={'**********'}
                ref={_fieldPwd2}
                style={{
                  borderBottomColor: '#355',
                  borderBottomWidth: 2,
                  ...styles.InputField,
                }}
                textContentType="newPassword"
                secureTextEntry={true}
                onChangeText={text => {
                  setpwd2(text);
                  if (text !== '') {
                    text.trim();
                  }
                }}
                onSubmitEditing={() => _fieldEmail.current.focus()}
              />

              <Text style={{...styles.Field, ...styles.plainText}}>
                Entrez votre adresse e-mail :{' '}
              </Text>
              <TextInput
                placeholder={''}
                returnKeyType={'send'}
                value={email}
                ref={_fieldEmail}
                style={{
                  borderBottomColor: '#355',
                  borderBottomWidth: 2,
                  ...styles.InputField,
                }}
                keyboardType="email-address"
                textContentType="emailAddress"
                onChangeText={text => {
                  setEmail(text);
                  if (text !== '') {
                    text.trim();
                  }
                }}
              />
              <Text style={styles.Erreur}>{emailError}</Text>
            </ScrollView>
          </View>
          <View style={styles.BtnContainer}>
            <TouchableOpacity
              style={styles.Btn}
              onPress={() => validateRegister()}>
              <Text style={styles.BtnText}>M'enregistrer</Text>
            </TouchableOpacity>
            <View style={{height: 15}} />
            <TouchableOpacity
              style={{...styles.Btn, backgroundColor: '#a01'}}
              onPress={() => setVisible(false)}>
              <Text style={styles.BtnText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <View style={{height: 15}} />
      <Text style={styles.Field}>Votre nom d'utilisateur : </Text>
      <TextInput
        style={styles.InputField}
        autoCompleteType="username"
        onChangeText={e => setname(e)}
        value={name}
      />
      <View style={{height: 15}} />
      <Text style={styles.Field}>Votre mot de passe : </Text>
      <TextInput
        style={styles.InputField}
        autoCompleteType="password"
        secureTextEntry={true}
        enablesReturnKeyAutomatically={true}
        onChangeText={e => setmainpwd(e)}
        value={mainpwd}
      />

      <View style={{flexDirection: 'row', paddingLeft: 10}}>
        <CheckBox
          // disabled={false}
          value={stayLogged}
          onChange={() => setStayLogged(!stayLogged)}
        />
        <TouchableOpacity
          style={{textAlignVertical: 'center', paddingTop: 5}}
          onPress={() => setStayLogged(!stayLogged)}>
          <Text style={{textAlignVertical: 'center'}}>Rester connecté</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.Erreur}>{loginError}</Text>
      <View style={styles.BtnContainer}>
        <TouchableOpacity style={styles.Btn} onPress={() => verifyLogin()}>
          <Text style={styles.BtnText}>Me connecter</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}} />
      <Text style={styles.Field}>Pas encore inscrit ?</Text>
      <View style={styles.BtnContainer}>
        <TouchableOpacity style={styles.Btn} onPress={() => register()}>
          <Text style={styles.BtnText}>M'inscrire</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={{flex:1}}/> */}
      <View style={styles.BtnContainer}>
        <TouchableOpacity
          style={{...styles.Btn, backgroundColor: '#5aa'}}
          onPress={() => continueUnlogged()}>
          <Text style={styles.BtnText}>Continuer sans inscription</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.BtnContainer}>
        {/* <TouchableOpacity
          style={{...styles.Btn, backgroundColor: '#a55'}}
          onPress={(event) => {event.preventDefault(); signInWithGoogle()}}>
          <Text style={styles.BtnText}>Me connecter avec mon compte Google</Text>
        </TouchableOpacity> */}
        {/* <GoogleSigninButton
          style={{width: 192, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn()}
          // disabled={state.isSigninInProgress}
        /> */}
      </View>
    </View>
  );
};
export default LoginForm;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    maxHeight: Math.round(SCREEN_HEIGHT),
  },
  InputField: {
    alignSelf: 'stretch',
    padding: 10,
    marginLeft: 20,
    borderBottomColor: '#000',
    marginRight: 20,
    borderBottomColor: '#000', // Add this to specify bottom border color
    borderBottomWidth: 2, // Add this to specify bottom border thickness
  },
  Field: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 20,
  },
  plainText: {
    justifyContent: 'flex-start',
    fontWeight: 'bold',
    fontSize: 18,
    paddingLeft: 20,
  },
  Erreur: {
    fontStyle: 'italic',
    fontSize: 15,
    paddingLeft: 20,
    // fontWeight: 'bold',
    color: 'darkred',
  },
  Btn: {
    borderBottomRightRadius: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: '#33A',
    width: SCREEN_WIDTH / 2,
    elevation: 10,
  },
  BtnText: {
    color: 'white',
    fontSize: 15,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
  },
  BtnContainer: {
    alignItems: 'center',
    margin: 10,
    padding: 5,
  },
  ModalView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: "center",
    padding: 10,
    paddingLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    // minHeight: Math.round(SCREEN_HEIGHT)
  },
});

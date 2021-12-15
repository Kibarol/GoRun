import React, {useState, useEffect} from 'react';
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
import {useSelector, useDispatch} from 'react-redux';
// import RadioGroup from 'react-native-radio-buttons-group';
import RadioButtonRN from 'radio-buttons-react-native';
import CheckBox from '@react-native-community/checkbox';
import { setIsLogged, setIsRegistered, setUserType } from '../src/store/slices/user-slice';
import LoginForm from '../components/login-form';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const ProfileScreen = () => {
  const userName = useSelector(state => state.appUser.username);
  const userType = useSelector(state => state.appUser.userType);
  const userMail = useSelector(state => state.appUser.mail);
  const birthDate = useSelector(state => state.appUser.birth);
  const registered = useSelector(state => state.appUser.isRegistered);
  const logged = useSelector(state => state.appUser.isLogged);

  const [avatarPath, setAvatarPath] = useState(require('../src/img/ico-profile-anon.png'))
  const [profilePublic, setProfilePublic] = useState(false);
  const [registerMe, setRegisterMe] = useState(false)
  const dispatch = useDispatch();
  //Radio boutons
  const radioButtonsData = [
    {
      label: 'H',
    },
    {
      label: 'F',
    },
    {
      label: '—',
    },
  ];
  //Selection avatar
  const slideAvatar = () => {
    switch (userType) {
      case "H": setAvatarPath(require('../src/img/ico-profile-man.png'));        
        break;
    case "F": setAvatarPath(require('../src/img/ico-profile-woman.png'));        
        break;
    case "—": setAvatarPath(require('../src/img/ico-profile-anon.png'));        
        break;    
      default:null
        break;
    }
  }
  useEffect(() => {
    slideAvatar()
  }, [userType])

  return (
    
      (registerMe && !logged)? (<LoginForm />)
      :
      (
          <View
            style={styles.Ctn}>

        
      <View
        style={{
          // flex: 1,
          flexDirection: 'row',
          // width: '100%',
          // backgroundColor: '#eee',
        }}>
        <View
          style={{
            flexDirection: 'column',
            padding: 8,
            width: '40%',

            // backgroundColor: '#eee',
          }}>
          <Text>Nom d'utilisateur :</Text>
          <Text>E-mail :</Text>
          <Text>Date de naissance :</Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            padding: 8,
            width: '30%',
            backgroundColor: '#eee',
          }}>
          <Text>{userName}</Text>
          <Text>{userMail}</Text>
          <Text>{birthDate}</Text>
        </View>
        <RadioButtonRN
          data={radioButtonsData}
          selectedBtn={e => {console.log(e, ' - ' + userName); dispatch(setUserType(e.label));}}
          animationType={['pulse', 'shake']}
          box={false}
          circleSize={10}
          style={{flexDirection: 'column', flex: 1, alignItem: 'flexEnd'}}
        />
        <Image
          source={avatarPath}
          style={styles.Avatar}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          // flex:1,
          // backgroundColor: '#eee',
        }}>
        <View
          style={{
            flexDirection: 'row',
            // flex:1,
            // backgroundColor: '#eee',
          }}>
          <CheckBox
            value={profilePublic}
            onChange={() => setProfilePublic(!profilePublic)}
          />
          <TouchableOpacity
            style={{textAlignVertical: 'center', paddingTop: 5}}
            onPress={() => setProfilePublic(!profilePublic)}>
            <Text style={{textAlignVertical: 'center'}}>
              Partager mon profil
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* boutons de connexion */}
      <View style={styles.BtnContainer}>
          {!registered? (
          <TouchableOpacity
            style={{...styles.Btn, backgroundColor: '#33a'}}
            onPress={() => {console.log('inscription'); setRegisterMe(true); dispatch(setIsLogged(false))}}>
            <Text style={styles.BtnText}>M'inscrire / Me connecter</Text>
          </TouchableOpacity>          
          ):null}
          {registered? (
          <View>
          <TouchableOpacity
            style={{...styles.Btn, backgroundColor: '#a55'}}
            onPress={() => console.log('édition')}>
            <Text style={styles.BtnText}>Éditer mon profil</Text>
          </TouchableOpacity> 
          <Text
          style={{
            flexDirection: 'row',
            flex: 1,
            // backgroundColor: '#eee',
          }}>
          Mes Co-Runners
        </Text></View>         
          ):null}
      </View>
      {/* <View style={{flex:1}}/> */}
      
    </View>
      )    
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  Avatar: {
    width: 100,
    height: 100,
    right: -10,
    position: 'absolute',
    marginRight: 5,
  },
  Ctn: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    backgroundColor: '#eee',
    fontSize:20,
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
  BtnContainer: {
    alignItems: 'center',
    margin: 10,
    padding: 5,
  },
  BtnText: {
    color: 'white',
    fontSize: 15,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
  },
});

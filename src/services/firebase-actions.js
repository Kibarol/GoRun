import firebase from 'firebase';
import { Alert } from 'react-native';

const createAccount = async user => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(user.email, user.password)
    .then(function () {
      console.log(
        'nouvel utilisateur: email :' + user.email + '|| nom :' + user.name,
      );
      var userf = firebase.auth().currentUser;
      userf.updateProfile({displayName: user.name}).then(function () {
        console.log('mise à jour du nom : ' + user.name);
        alert(
          'Vous êtes maintenant enregistré(e). Vous pouvez maintenant vous connecter.',
        ),
          function (error) {
            console.warn('Erreur dans la mise à jour du nom');
          };
      });
    });
};

const uploadImg = async uri => {
  console.log("upload d'une image : " + uri);
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref('Avatar').child(uuid.v4());
    const task = ref.put(blob);

    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        () => {},
        // reject () => resolve(task.snapshot.downloadURL)
      );
    });
  } catch (err) {
    console.log("probleme d'upload " + err.message);
  }
};

const updateAvatar = url => {
  let userf = firebase.auth().currentUser;
  if (userf != null) {
    userf.updateProfile({image: url}).then(
      function () {
        console.log('avatar mis à jour : ' + url);
        alert('Votre image de profil est enregistrée.');
      },
      function (error) {
        console.warn("Pb dans la mise à jour de l'avatar : " + error.message);
      },
    );
  } else {
    console.log(
      "utilisateur non enregistré ; sauvegarde de l'image imposssible",
    );
  }
};
const checkIfUsernameAlreadyExists = () => {
  //Check if any users exist
  firebase
    .database()
    .ref(`users`)
    .limitToFirst(1)
    .once('value', snapshot => {
      if (snapshot.exists()) {
        console.log('exists!');
        Alert.alert("Nom d'utilisateur déjà pris", "Ce nom d'utilisateur n'est pas disponible. Veuillez en choisir un autre.")
        return true;
      }

      console.log("nom d'utilisateur dispo !");
      return false
    });
};

const createRouteDB = () => {
    
};

export {createAccount, uploadImg, updateAvatar, checkIfUsernameAlreadyExists};

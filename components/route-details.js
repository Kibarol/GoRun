import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import { removeRoute } from '../src/store/slices/route.slice';
import { useDispatch } from 'react-redux';
const SCREEN_WIDTH = Dimensions.get('window').width;

const RouteDetails = props => {
  const {id, runZone, runLength, runPreview, runName} = props;
  const [actionVisible, setActionVisible] = useState(false);
  const dispatch= useDispatch()

  const hardCodedRoute = {
    id: '2021-11-07-daillyRun',
    runPreview:
      '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',
    runLength: '1.247 km',
    runZone: 'Daillyplein-Place Dailly',
  };

  const toggleActions = () => {
    setActionVisible(!actionVisible);
  };
  //Actions des cards
  const modifyRoute = () => {
    setActionVisible(false);
  };
  const deleteRoute = id => {
    setActionVisible(false);
    Alert.alert(
      'Suppression du parcours',
      "Voulez'vous vraiment supprimer ce parcours de votre liste ?\nCette action est irréversible.",
      [
        {
          text: 'Non',
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: () => {
            dispatch(removeRoute(id))
          },
          style: 'default',
        },
      ],
      {cancelable: false},
    );
  };
  const shareRoute = () => {
    setActionVisible(false);
  };
  const runRoute = () => {
    setActionVisible(false);
  };

  return (
    <View style={styles.conteneur}>
      <View style={styles.BckgdEffect}>
        {/* globale */}
        <TouchableOpacity onPress={() => toggleActions()}>
          <View style={{flexDirection: 'row', flex: 2}}>
            {/* infos du parcours */}

            <Image
              source={{uri: `data:/png;base64,${runPreview}`}}
              style={styles.Preview}
            />
            <View>
              {/* données */}

              <View style={{width: SCREEN_WIDTH - 120, paddingHorizontal: 10}}>
                {/* nom et date */}
                <View style={{flex: 1}}>
                  <Text style={styles.Date}>{id.slice(0, 10)}</Text>
                </View>
                <Text style={styles.RunTitle} numberOfLines={2}>{runName}</Text>
              </View>

              <View style={styles.RowInfos}>
                {/* zone et longueur */}
                <Text
                  style={{fontSize: 15, paddingLeft: 5, fontStyle: 'italic', flexShrink:1}} numberOfLines={1}>
                  {runZone}
                </Text>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      ...styles.Date,
                      fontSize: 15,
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                    }}>
                    {runLength}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {actionVisible ? (
          <View style={{...styles.RowInfos, ...styles.ActionBtnZone}}>
            {/* actions */}
            <TouchableOpacity
              style={{...styles.Btn, backgroundColor: '#a55'}}
              onPress={() => deleteRoute(id)}>
              <Text style={styles.BtnText}>Supprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{...styles.Btn, backgroundColor: '#bb0'}}
              onPress={() => modifyRoute(id)}>
              <Text style={styles.BtnText}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{...styles.Btn, backgroundColor: '#6b6'}}
              onPress={() => shareRoute(id)}>
              <Text style={styles.BtnText}>Partager</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{...styles.Btn, backgroundColor: '#33a'}}
              onPress={() => runRoute(id)}>
              <Text style={styles.BtnText}>Go Run</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
};
export default RouteDetails;
export const hardCodedRoute = hardCodedRoute;

const styles = StyleSheet.create({
  BckgdEffect: {
    backgroundColor: '#6bb',
    // borderRadius:600,
    // borderBottomRightRadius:280,
    // borderBottomLeftRadius:20,
    borderBottomEndRadius: 300,
  },
  Date: {
    textAlign: 'right',
    fontStyle: 'italic',
    fontSize: 13,
  },
  ActionBtnZone: {
    justifyContent: 'space-between',
    elevation: 50,
    // position:"absolute",
  },

  Preview: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
    backgroundColor: '#f00',
    zIndex: 20,
  },
  RowInfos: {
    flexDirection: 'row',
    flex: 1,
    // backgroundColor: '#ddd',
    alignContent: 'space-between',
    // paddingHorizontal:10,
  },
  RunTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'flex-start',
    flexShrink:1,
    flexWrap: "wrap"
  },
  RunDate: {
    fontStyle: 'italic',
    fontSize: 20,
    textAlign: 'right',
  },
  conteneur: {
    position: 'relative',
    width: SCREEN_WIDTH * 0.98,
    margin: 5,
    backgroundColor: '#F2F3F4',
    backgroundColor: '#5aa',
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 20,
    flex: 2,
    zIndex: 10,
    alignContent: 'space-between',
  },
  length: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  FloatingAction: {
    // flexDirection:"column",
    color: '#FFF',
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2B2',
    borderColor: '#FFF',
    borderRadius: 5,
  },
  FloatingIco: {
    // position: 'absolute',
    width: 15,
    height: 15,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  Btn: {
    borderBottomRightRadius: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: '#33A',
    width: SCREEN_WIDTH * 0.22,
    elevation: 10,
    height: 30,
    alignContent: 'center',
  },
  BtnText: {
    color: 'white',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
  },
});

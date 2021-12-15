import React from 'react'
import { useSelector } from "react-redux"
import {StyleSheet, Image, View, Dimensions, Text, Alert, TouchableOpacity, Modal, TextInput, Button, ToastAndroid, ScrollView }from 'react-native'
const SCREEN_WIDTH = Dimensions.get("window").width
const HintBoard = () => {
    const editMode = useSelector((state)=> state.editMode.isActive)
    const entireStore = useSelector((state)=>state)
    const normalMsg = "Astuces :\n°touchez la carte pour y placer un repère\n\n°appuyez sur le repère pour commencer à tracer un parcours."
    const editMsg = "Astuces : \n°pour ajouter un checkpoint au parcours, placez un repère sur la carte et cliquez sur le bouton bleu.\n\n°Pour plus de précision, vous pouvez augmenter le zoom."
    
    return(
        <View style={editMode? styles.Editage: styles.Conteneur}>
            <Text style={{marginTop:13,flex:1, fontSize:15, fontStyle:"italic", position:"absolute", bottom:0}}>{editMode? editMsg : normalMsg}</Text>
            {/* <Button title="Routes du store" onPress={()=>{console.log("état du store : "+ JSON.stringify(routes))}} /> */}
        </View>
    )
}

export default HintBoard

const styles = StyleSheet.create({
    Conteneur :{
        flex:1,
        position:"absolute",
        top:460,
        width:SCREEN_WIDTH,
        margin:25,
    },
    Editage:{
        top:620,
        left:10,
        flex:1,
        position:"absolute",
        width:SCREEN_WIDTH*0.9,
        // margin:15,
    }
})

    
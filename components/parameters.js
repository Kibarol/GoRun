import {StyleSheet, View, Text, TextInput} from 'react-native'
import React, { useState } from 'react'

const AppParameters = () => {
    const [name, setname] = useState("")
    const [pwd, setpwd] = useState("")

    return(
        <View>
            <Text>Langue : </Text>
            <TextInput autoCompleteType="username" onChangeText={e => setname(e)} value={name}/>
            <Text>Votre mot de passe : </Text> 
            <TextInput autoCompleteType="password" enablesReturnKeyAutomatically={true} onChangeText={e => setpwd(e)} value={pwd}/>
        </View>
    )
}
export default AppParameters;
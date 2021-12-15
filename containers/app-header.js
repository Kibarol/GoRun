import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { Header } from '@react-navigation/elements';
import { Button } from 'react-native';

const AppHeader = (props) => {
    const {title} = props

    return(
        <Header 
            title={title}
            headerLeft={back ? <Button title="Retour" onPress={navigation.goBack}/>: undefined}
            headerStyle={{height: 80}}
        />
    )
}
export default AppHeader

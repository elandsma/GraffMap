import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Linking} from 'react-native'
import {Button, Input, Image} from "react-native-elements";

const RandomImageScreen = ( {navigation })=>{
    return(
        <View style={styles.container}>

            <Text>Todo: Random Image Generator</Text>
  
        </View>
    )
}

export default RandomImageScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },


});


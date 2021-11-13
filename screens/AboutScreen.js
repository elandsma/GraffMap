import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View} from 'react-native'
import {Button, Input, Image} from "react-native-elements";

const AboutScreen = ( {navigation })=>{
    return(
        <View style={styles.container}>
            <Text>This is the about page</Text>
        </View>
    )
}

export default AboutScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    addImageButton:{
        paddingTop: 10,
        marginTop: 10,
        width: 200,
    }
});


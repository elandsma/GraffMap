import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Linking} from 'react-native'
import {Button, Input, Image} from "react-native-elements";

const LocationDetailScreen = ( {route, navigation })=>{
    const { lat, long } = route.params;

    console.log("Lat: ", lat);
    console.log("Long: ", long);
    return(
        <View style={styles.container}>
            <Text>{lat}, {long}</Text>
        </View>
    )
}

export default LocationDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    quote:{
        fontStyle: 'italic',
        textAlign: "center",
        fontSize: 12
    }
});


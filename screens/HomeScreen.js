import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Button, Input, Image} from "react-native-elements";

const HomeScreen = ( {navigation })=>{

    return(
        <>
        <View style={styles.container}>    
            <Text style={{fontSize: 25}}>Welcome to GraffMap{"\n"}</Text>
            <TouchableOpacity style={styles.homeNavButtonTouchable} onPress={()=> navigation.navigate('Map')} >
                <Text style={styles.homeNavButtonText}> Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeNavButtonTouchable} onPress={()=> navigation.navigate('Add Image')} >
                <Text style={styles.homeNavButtonText}> Add Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeNavButtonTouchable} onPress={()=> navigation.navigate('About')} >
                <Text style={styles.homeNavButtonText}> About</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeNavButtonTouchable} onPress={()=> navigation.navigate('Random')} >
                <Text style={styles.homeNavButtonText}> Random Graff</Text>
            </TouchableOpacity>
        </View>
        </>        
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    homeNavButtonTouchable:{
        width: 200,
        borderRadius: 10,
        backgroundColor: '#2C6BED',
        // #14274e
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        marginTop: 10,
        marginBottom: 10
    },
    homeNavButtonText:{
        color: '#fff',
        fontWeight: 'bold',
        textAlignVertical: 'center',
        fontSize: 18
    }
});


import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Button, Image} from "react-native-elements";

const HomeScreen = ( {navigation })=>{
    return(
        <>
        <View style={styles.container}>    
            <Image
                source={require('../assets/GraffMapBig.png')}
                style={{width: 300, alignSelf: 'center', aspectRatio: 1, resizeMode: 'contain'}}
            />
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
                <Text style={styles.homeNavButtonText}> Random Artwork</Text>
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
        backgroundColor: '#5d8aa6'
    },
    homeNavButtonTouchable:{
        width: 200,
        borderRadius: 25,
        backgroundColor: '#045a8f',
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


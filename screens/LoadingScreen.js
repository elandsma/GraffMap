import { StatusBar } from 'expo-status-bar';
import React , { useState} from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import {Button, Input, Image} from "react-native-elements";

const LoadingScreen = ( {navigation} ) =>{
    const [isLoaded, setIsLoaded] = useState(false);
    

    return(
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <StatusBar style="light"/>
            <Image 
                source={{
                    uri: "https://m.media-amazon.com/images/I/71icGOeK40L.jpg",
                }}
                style={{ width: 200, height: 200}}
            />
            
            <Text>Loading Screen</Text>
            <Button onPress={()=> navigation.replace('Home')}  containerStyle={styles.proceedButton} type="outline" title="Proceed"/>
            {/* navigation.navigate("Home")  will push onto navigation Stack, whereas .replace("home") simply puts us there with no back button. */}
        </KeyboardAvoidingView>
    )
}

export default LoadingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    proceedButton:{
        paddingTop: 10,
        marginTop: 10,
        width: 200,
    }
});
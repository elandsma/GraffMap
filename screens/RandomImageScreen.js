import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Linking, TouchableOpacity, ActivityIndicator } from 'react-native'
import {Button, Input, Image} from "react-native-elements";
import { supabase } from "./../supabase-service";
import { SUPABASE_URL } from "react-native-dotenv"
import { useIsFocused } from '@react-navigation/native';

const RandomImageScreen = ( {navigation })=>{
    const [randomLocation, setRandomLocation] = useState(null);
    const [dbError, setdbError] = useState(false);
    const isFocused = useIsFocused();



    useEffect(()=>{
        setRandomLocation(null);
        fetchLocations();
    }, [isFocused])

    /**
     * Fetch all locations from database. Select one randomly, assign to state
     */
    async function fetchLocations(){
        try{
            console.log("start fetchLocations()")
            let { data, error } = await supabase
                .from('artworkdata')
                .select('lat, long')
            if(error){
                console.log("DB Fetch Error");
                setdbError(true);
                throw new Error(error);
            }
            const randomLoc = data[Math.floor(Math.random() * data.length)];
            setRandomLocation(randomLoc);
            console.log("Random Found: ", randomLoc);
        }
        catch (e){
            console.log("Error: ", e);
            setdbError(true);
        }
    }
 
    if(dbError){
        return(
            <View style={styles.container}>
                <Text>Error accessing database.</Text>
            </View>
        )
    }

    return(
        <View style={styles.container}>
            {!randomLocation ? 
                <>
                    <Text style={{color: 'white'}}>
                        Randomizing Location....{"\n"}</Text>
                    <ActivityIndicator size="large" color="white" />
                </>
                :
                <>
                    <Text style={{color: 'white'}}>
                        Random Artwork Location Identified!{"\n"}{"\n"}
                    </Text>
                    <TouchableOpacity style={styles.navButtonTouchable} onPress={()=> navigation.navigate('Location Detail', {lat: randomLocation.lat, long: randomLocation.long})} >
                        <Text style={styles.navButtonText}> Click To View</Text>
                    </TouchableOpacity>
                </>
            }
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
        backgroundColor: '#5d8aa6',
    },
    navButtonTouchable: {
        width: 150,
        borderRadius: 25,
        backgroundColor: '#045a8f',
        // #14274e
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 48
    },
    navButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 18  
    }
});
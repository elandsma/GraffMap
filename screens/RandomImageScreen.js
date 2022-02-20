import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Linking, TouchableOpacity} from 'react-native'
import {Button, Input, Image} from "react-native-elements";
import { supabase } from "./../supabase-service";
import { SUPABASE_URL } from "react-native-dotenv"

const RandomImageScreen = ( {navigation })=>{
    const [randomLocation, setRandomLocation] = useState(null);
    const [loadingText, setLoadingText] = useState("Randomizing Location....");
    const [dbError, setdbError] = useState(false);

    useEffect(()=>{
        fetchLocations()
    }, [])

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
            console.log("Random Found");
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
                <Text>Randomizing Location....</Text>
                :
                <TouchableOpacity style={styles.homeNavButtonTouchable} onPress={()=> navigation.navigate('Location Detail', {lat: randomLocation.lat, long: randomLocation.long})} >
                    <Text style={styles.homeNavButtonText}> View Random Artwork Location</Text>
                </TouchableOpacity>
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
    },

});


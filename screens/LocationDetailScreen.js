import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Linking} from 'react-native'
import {Button, Input, Image} from "react-native-elements";
import { supabase } from "./../supabase-service";

const LocationDetailScreen = ( {route, navigation })=>{
    const { lat, long } = route.params;
    const [artworks, setArtworks] = useState(null);
    const [dbError, setdbError] = useState(false);

    useEffect(()=>{
        fetchArtwork()
    }, [])

    /**
     * Fetch all artwork from given location coordinates, assign to state
     */
     async function fetchArtwork(){
        try{
            console.log("start fetchArtwork()")
            let { data, error } = await supabase
                .from('artworkdata')
                .select('*')                
                .match({lat: lat, long: long})
                .order('timestamp', {descending: true})
            if(error){
                console.log("DB Fetch Error");
                setdbError(true);
                throw new Error(error);
            }
            setArtworks(data);
            console.log("data: ", data);
        }
        catch (e){
            console.log("Error: ", e);
            setdbError(true);
        }
    }

    console.log("Lat: ", lat);
    console.log("Long: ", long);
    
    //no params given to stack navigator
    //TODO: maybe type check these as well?
    if(!lat || !long){
        return(
            <View style={styles.container}>
                <Text>Error: No location params</Text>
            </View>    
        )
    }

    //database error
    if(dbError){
        return(
            <View style={styles.container}>
                <Text>Error accessing database.</Text>
            </View>
        )
    }

    return(
        <View style={styles.container}>
            {artworks?
            <>
                    <Text>{lat}, {long}</Text>
            </>
            :
            <>
                <Text>Fetching Artwork...</Text>
            </>
        }
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

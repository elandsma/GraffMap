import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Dimensions, FlatList, Image, TouchableOpacity, Linking} from 'react-native'
import {Button, Input } from "react-native-elements";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { supabase } from "./../supabase-service";
import { SUPABASE_URL } from "react-native-dotenv"



const {width } = Dimensions.get('window');
const SPACING = 10;
const THUMB_SIZE = 80;


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
            console.log("data: ", data);
            setArtworks(data);
        }
        catch (e){
            console.log("Error: ", e);
            setdbError(true);
        }
    }

    const ShowArt=(props)=>{
        let artworklist=props.artworks;
        const carouselArray=[]
        for (const artwork of artworklist){
            const thisUri = SUPABASE_URL +"/storage/v1/object/public/"+artwork.uri;
            carouselArray.push({ uri: thisUri, timestamp: artwork.timestamp})
        }
        console.log("carouselArray: ", carouselArray);
        return(
            <>
                <Text>{lat}, {long}</Text>
                <Image
                    source={{uri: SUPABASE_URL +"/storage/v1/object/public/"+artworks[0].uri}}
                    style={styles.artworkImage}
                        // resizeMode={'cover'}
                />
                <Text>Uploaded at: {artworks[0].timestamp}</Text>
                {/* {x=SUPABASE_URL +"/storage/v1/object/public/"+artworks[0].uri} */}

                <View style={{ flex: 1 / 2, marginTop: 20 }}>
                    <Carousel
                        layout='default'
                        data={carouselArray}
                        sliderWidth={width}
                        itemWidth={width}
                        renderItem={({ item, index }) => (
                            <Image
                                key={index}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode='contain'
                                source={item.uri}
                            />
                        )}
                    />
                    </View>




            </>
        )
    }
    
    //no params given to stack navigator
    //TODO: maybe type check these as well?
    if(!lat || !long){
        return(
            <View style={styles.container}>
                <Text>Error: No location params</Text>
            </View>    
        )
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
            {artworks?
                <ShowArt artworks={artworks}/>
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
    artworkImage:{
        width: 400,
        height: 300,
        // height: "100%",
        resizeMode: "cover",
    }
});

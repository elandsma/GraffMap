import React, {useState, useEffect, useRef} from 'react'
import { StyleSheet, ActivityIndicator, Text, View, Dimensions, FlatList, Image, ScrollView, TouchableOpacity, Linking} from 'react-native'
import {Button, Divider, Input } from "react-native-elements";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ImageViewer from 'react-native-image-zoom-viewer';
import { supabase } from "./../supabase-service";
import { SUPABASE_URL } from "react-native-dotenv"
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from 'react-native-web';

const {width, height } = Dimensions.get('window');
const SPACING = 10;
const THUMB_SIZE = 80;

const LocationDetailScreen = ( {route, navigation })=>{
    const { lat, long } = route.params;
    const [artworks, setArtworks] = useState(null);
    const [dbError, setdbError] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

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
                .order('timestamp', {ascending: true})
            if(error){
                console.log("DB Fetch Error");
                setdbError(true);
                throw new Error(error);
            }
            let cleanedData=[];
            let i=0;
            //clean raw data by adding indexing and parsing URL
            for(const art of data){
                console.log("ART: ,",art)
                const newArt={
                    index: i,
                    uri: SUPABASE_URL +"/storage/v1/object/public/"+art.uri,
                    lat: art.lat,
                    long: art.long,
                    timestamp: new Date(art.timestamp)
                }
                cleanedData.push(newArt);
                i++;
            }
            console.log(cleanedData);
            setArtworks(cleanedData);
        }
        catch (e){
            console.log("Error: ", e);
            setdbError(true);
        }
    }


    const renderItems = ({item})=>{
        return (
            <TouchableOpacity onPress = {()=> console.log('clicked')}>
                <Image 
                    source={{uri: item.uri}}
                    style={styles.artworkImage}
                />
                <View style={styles.imageFooter}>
                    <Text style={styles.imageFooterText}>
                        {item.timestamp.toLocaleString("en-US")}
                    </Text>
                    <Text onPress={()=> {navigation.navigate('Map', { showlat: lat, showlong: long})}} style={{color: 'blue'}}>View In Map</Text>

                </View>
            </TouchableOpacity>
        );
    };
    

    const ShowArt2=(props)=>{
        let artworklist=props.artworks;
        console.log("showArt render")
        return(
            <View style={styles.container}>
                <FlatList
                    data = {artworklist}
                    renderItem={renderItems}
                    keyExtractor = {(item)=> item.index}
                />
            </View>
        );
    }


    //check if no params were passed as props to stack navigator
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
        <>
            {artworks?
                <ShowArt2 artworks={artworks}/>
            :
            <>
                <View style={styles.container}>
                    <Text>Fetching Artwork...{"\n"}{"\n"}</Text>
                    <ActivityIndicator size="large" color="#00ff00"/>
                </View>
            </>
        }
        </>
    )
}

export default LocationDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
        // padding: 10,
        backgroundColor: '#F5FCFF'

    },
    artworkImage:{
        // width: 400,
        // height: 300,
        // // height: "100%",
        // resizeMode: "cover",
        width,
        height: 550,
        resizeMode: 'contain',
        marginVertical: 10,
    },
    imageFooter:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 20,
    },
    imageFooterText:{

    }

});

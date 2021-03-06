import React, {useState, useEffect, useRef} from 'react'
import { StyleSheet, ActivityIndicator, Text, View, Dimensions, FlatList, Image, ScrollView, TouchableOpacity, Linking} from 'react-native'
import {Button, Input } from "react-native-elements";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ImageViewer from 'react-native-image-zoom-viewer';
import { supabase } from "./../supabase-service";
import { SUPABASE_URL } from "react-native-dotenv"

const {width, height } = Dimensions.get('window');
const SPACING = 10;
const THUMB_SIZE = 80;

const LocationDetailScreen = ( {route, navigation })=>{
    const { lat, long } = route.params;
    const [artworks, setArtworks] = useState(null);
    const [dbError, setdbError] = useState(false);
    const [indexSelected, setIndexSelected] = useState(0);
    const [customIndexState, setCustomIndexState] = useState(0);

    useEffect(()=>{
        fetchArtwork()
    }, [])

    const onSelect = indexSelected => {
        setIndexSelected(indexSelected);
        console.log("New Index: ",indexSelected)
      };

    const carouselRef = useRef();
    const flatListRef = useRef();

    customIndex = useRef(0);

    const onTouchThumbnail = (touched) => {
        console.log("touched: ", touched)
        customIndex.current = touched
        setCustomIndexState(touched)
        if (touched === indexSelected) return;
        carouselRef?.current?.snapToItem(touched);
      };

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
                    timestamp: art.timestamp   //todo: convert to unix time here?
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


    const FlatlistView=(props)=>{
        artworklist=props.artworklist;
        return(
            <View style={{flex:1, justifyContent: 'flex-end', width: '100%', backgroundColor: 'black'}}>
            <FlatList
                // ref={flatListRef}
                horizontal={true}
                data={artworklist}
                style={{ position: 'absolute', bottom: 80 }}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: SPACING
                }}
                keyExtractor={item => item.index}
                renderItem={({ item, index }) => (
                    <TouchableOpacity 
                        activeOpacity={0.9}
                        onPress={() => onTouchThumbnail(index)}
                    >
                        {console.log("Render Item Index: ", index)}
                        {console.log("customIndex: ", customIndex)}
                        <Image
                            style={{
                            width: THUMB_SIZE,
                            height: THUMB_SIZE,
                            marginRight: SPACING,
                            borderRadius: 16,
                            borderWidth: index === customIndex.current ? 4 : 0.75,
                            borderColor: index === customIndex.current ? 'orange' : 'white'
                            }}
                            source={{ uri: item.uri}}
                        />
                            <Text style={{color:'white'}}>{customIndexState}</Text>

                    </TouchableOpacity>
                )}
            />
        </View>
        )


    }

    const ShowArt=(props)=>{
        let artworklist=props.artworks;
        console.log("showArt render")
        return(
            <>
                <View style={{ flex: 1}}>
                    <View style={{flex:11, justifyContent: 'flex-start', width: '100%', backgroundColor: 'black'}}>
                        <Carousel
                            layout='default'
                            data={artworklist}
                            sliderWidth={width}
                            itemWidth={width}
                            onSnapToItem={(index) => onSelect(index)}
                            ref={carouselRef}
                            renderItem={({ item, index }) => (
                                <>                           
                                    <ScrollView maximumZoomScale={5} scrollEnabled={true} minimumZoomScale={1} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                                        <Image
                                            key={item.index}
                                            style={{ width: '100%', height: undefined, aspectRatio:1, resizeMode: 'contain'}}
                                            source={{ uri: item.uri}}
                                        />
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <Text style={{color:'white'}}>Uploaded at: {item.timestamp}</Text>
                                            <Text onPress={()=> {navigation.navigate('Map', { showlat: lat, showlong: long})}} style={{color: 'white'}}>View In Map</Text>
                                            <Text style={{color:'white'}}>{indexSelected+1}/{artworklist.length}</Text>      
                                        </View>
                                        <View>
                                            <Pagination
                                                inactiveDotColor='gray'
                                                dotColor={'orange'}
                                                activeDotIndex={indexSelected}
                                                dotsLength={artworklist.length}
                                                animatedDuration={150}
                                                inactiveDotScale={1}
                                            />
                                        </View> 
                                    </ScrollView>          
                                </>
                            )}
                        />
                        {artworklist.length>1?
                        <FlatlistView artworklist={artworklist}/>
                        :
                        <></>}
                    </View>
                </View>
            </>
        )
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
                <ShowArt artworks={artworks}/>
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

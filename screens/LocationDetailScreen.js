import React, {useState, useEffect, useRef} from 'react'
import { StyleSheet, ActivityIndicator, Text, View, Dimensions, FlatList, Image, ScrollView, TouchableOpacity, Animated, Linking, Modal} from 'react-native'
import Lightbox from 'react-native-lightbox-v2';
import { supabase } from "./../supabase-service";
import { SUPABASE_URL } from "react-native-dotenv"

const {width, height } = Dimensions.get('window');
const SPACING = 10;
const THUMB_SIZE = 80;
const viewConfigRef = {viewAreaCoveragePercentThreshold: 95};

const LocationDetailScreen = ( {route, navigation })=>{
    const { lat, long } = route.params;
    const [artworks, setArtworks] = useState(null);
    const [dbError, setdbError] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const onViewRef = useRef(({changed})=>{
        if(changed[0].isViewable){
            setCurrentIndex(changed[0].index)
        }
    })

    const scrollToIndex = (index)=>{
        flatListRef.current?.scrollToIndex({animated: true, index: index})
    }
    let flatListRef = useRef();

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
                .order('timestamp', {ascending: false})
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
        let items = []
        items.push(item.uri)
        return (
            <>
            <View style={{justifyContent: 'space-between'}}>
                <View>
                <Lightbox
                    swipeToDismiss={true}
                    // activeProps={{ style:{objectFit: 'cover'} }}
                    renderContent={()=>{
                        return(
                            <ScrollView maximumZoomScale={5} 
                                scrollEnabled={true} minimumZoomScale={1} showsHorizontalScrollIndicator={false} 
                                showsVerticalScrollIndicator={false}
                            >
                                <Image 
                                    source={{uri: item.uri}}
                                    style={{
                                        maxWidth: width,
                                        height: height,
                                        marginTop: 10,
                                        aspectRatio: 1,
                                        resizeMode: 'contain',
                                        // marginVertical: 10,
                                        alignSelf: 'center'
                                    }}
                                /> 
                            </ScrollView>
                        )
                    }}
                >   
                    
                    <Image 
                        source={{uri: item.uri}}
                        style={styles.artworkImage}
                    />                    
                </Lightbox>
                </View>
                <View style={styles.imageFooter}>
                    <Text style={styles.imageFooterText}>
                        {item.timestamp.toLocaleString("en-US")}
                    </Text>
                    <Text style={{color: 'orange', fontSize: 15}}>{currentIndex+1}/{artworks.length}</Text>
                    <Text onPress={()=> {navigation.navigate('Map', { showlat: lat, showlong: long})}} style={{color: 'aqua', fontSize: 16}}>View In Map</Text>
                </View>
            </View>
            </>
        );
    };
    

    //check if no params were passed as props to stack navigator
    //TODO: consider maybe type check these as well?
    if(!lat || !long){
        return(
            <View style={styles.container}>
                <Text style={{color: 'white'}}>Error: No location params</Text>
            </View>    
        )
    }

    if(dbError){
        return(
            <View style={styles.container}>
                <Text style={{color: 'white'}}>Error accessing database.</Text>
            </View>
        )
    }

    return(
        <>
            {artworks?
            <View style={styles.container}>                
                <View style={{flex: 13}}>
                <FlatList
                    data = {artworks}
                    renderItem={renderItems}
                    keyExtractor = {(item)=> item.index}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    ref={(ref)=>{
                        flatListRef.current = ref;
                    }}
                    viewabilityConfig={viewConfigRef}
                    onViewableItemsChanged={onViewRef.current}
                    initialScrollIndex={currentIndex}  
                    onScrollToIndexFailed={info => {
                        const wait = new Promise(resolve => setTimeout(resolve, 500));
                        wait.then(() => {
                          flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                        })}}
                />
                </View>
                <View style={styles.pageDotView}>
                    {artworks.map(({}, index)=>(
                        <TouchableOpacity key={index.toString()}
                        style={[
                            styles.pageCircle,
                            { backgroundColor: index == currentIndex? 'white' : 'grey'},
                        ]}
                        onPress = {()=> scrollToIndex(index)}
                        />
                    ))} 
                </View>
            </View>                
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
        justifyContent: "space-between",
        // padding: 10,
        // backgroundColor: '#F5FCFF'
        backgroundColor: 'black',
        flexDirection: "column"

    },
    artworkImage:{
        // marginTop: 5,
        // width: 400,
        // height: 300,
        // // height: "100%",
        width,
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain',
        // marginVertical: 10,
        alignSelf: 'center',
    },
    imageFooter:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 20,
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 3,
        
    },
    imageFooterText:{
        color: 'white',
    },
    carousel:{
    },
    pageDotView:{
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 30,
        paddingTop: 5,
        // marginVertical: 20,
        flex: 2
    },
    pageCircle:{
        width: 10,
        height: 10,
        backgroundColor: 'grey',
        borderRadius: 50,
        marginHorizontal: 5
    }


});

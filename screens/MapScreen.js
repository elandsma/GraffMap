import React, {useState, useEffect}  from 'react'
import MapView, { Callout, CalloutSubview, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { Platform, Button, Image, Alert, StyleSheet, Text, View, TouchableOpacity, Dimensions, ActivityIndicator, SafeAreaView} from 'react-native';
import * as Location from 'expo-location'
import { supabase } from "../supabase-service";
import { SUPABASE_URL } from "react-native-dotenv"

const MapScreen = ( { navigation } )=>{
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [initialMapLocation, setInitialMapLocation] = useState(null);
    const [artworkdata, setArtworkdata] = useState([]);

    useEffect(()=>{
        fetchMarkers();
        getInitialLocation()
    }, [])

    /**
     * Fetch all artwork items from database.
     * TODO: get only unique locations 
     *    possible workflow: if there are duplicates, only use most recent, so we have the best/newest image for callout thumbnail
     *    because we don't need to have the other older artworks in the array used to map the markers.
     * 
     * TODO: Another potential workflow is to create a map of all artworks, with the coords as key and most recent URI as value
     */
    async function fetchMarkers(){
        console.log("fetchMarkers()")
        let { data, error } = await supabase
            .from('artworkdata')
            .select('*')
        if(data){
            console.log(data)
            setArtworkdata(data);
            return true;
        }
        if(error){
            console.log("DB Fetch Error")
            Alert.alert("Error connecting to database")
            return false;
        }
    }

    /**
     * Request location permissions: If given, set initial location of map to current. If not, use hard-coded default
     * Todo: instead of hard-coded default, perhaps use random artwork location from database if there is no geolocation permission    
     */
    async function getInitialLocation(){
            console.log("getInitialLocation()")
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setInitialMapLocation({
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421, 
                })
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setInitialMapLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421, 
            })
    }

    //this was used for debugging the initial location by displaying on screen, can probably delete.
    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }
    
    //fake data for testing
    var markersData=
        [
            {
                "uuid":"67453ghf5643",
                latlong:{ lat:35.57607713568235, lng:-82.56524179348632 },
                "uri": "this-is-a-url.com",
                "lat": 35.57607713568235,
                "long": -82.56524179348632,
                "timestamp": "4355245345",
                "description":"foundy st"
            },
            {
                "uuid":"9467dfsf453",
                latlong:{lat:35.590398,lng:-82.571690},
                "uri": "this-is-a-url.com",
                "lat": 35.590398,
                "long": -82.571690,
                "timestamp": "5676575",
                "description":"bowen bridge"
            }
        ]

    //TODO: Make this work on desktop perhaps. But for now it is broken
    if(Platform.OS != 'ios' && Platform.OS != 'android'){
        return(
            <Text>Currently, map view is only available on mobile devices. Your platform is {Platform.OS} </Text>
        )
    }

    if (initialMapLocation==null){
        return(
            <View style={styles.container}>
                <Text>Acquiring geolocation...{"\n"}{"\n"}</Text>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        )
    }

    return (
        <>        
        <View style={styles.container}>
            {/* <Text>{text}</Text> */}
            {/* <Text>INITIAL:{JSON.stringify(initialMapLocation)}</Text> */}
            {/* <Text>{JSON.stringify(markerLocations)}</Text> */}

            <MapView
                style={styles.map}
                initialRegion={initialMapLocation}
                // provider={PROVIDER_GOOGLE}
            >                
                {location!=null?
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        }}
                        pinColor="red"
                    >
                        <Callout><Text>You Are Here</Text></Callout>
                    </Marker>
                :
                <></> 
                }

                { artworkdata.map((marker)=>{
                    let imageurl = SUPABASE_URL +"/storage/v1/object/public/"+marker.uri
                    console.log(imageurl)
                    return(
                        <Marker
                            coordinate={{ latitude: Number(marker.lat), longitude: Number(marker.long)}}
                            key={marker.uuid}
                            pinColor="purple"
                        >
                        {/* // https://vyqmzznxlhwbcrguaepk.supabase.in/storage/v1/object/public/graffimages/test1.jpg  */}
                            <Callout tooltip>
                                <View>
                                    <View style={styles.bubble}>
                                        <Image
                                            style={styles.calloutThumbnail}
                                            source={{uri: imageurl}}
                                            // resizeMode={'cover'}
                                        />

                                    <Button title='View Detail' 
                                        onPress={()=> {navigation.navigate('Location Detail', { lat: marker.lat, long: marker.long})}}
                                    />
                                    </View>
                                </View>
                            </Callout>
                        </Marker>
                    )
                })} 
            </MapView>         
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    bubble:{
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 0,
        width: 150
    },
    calloutThumbnail:{
        width: '100%',
        height: undefined,
        aspectRatio: 3/2,
        flex: 1,
    },
    clickForDetailText:{
        color: '#2C6BED'
    }
});

export default MapScreen

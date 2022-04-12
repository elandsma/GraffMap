import React, {useState, useEffect}  from 'react'
import MapView, { Callout, CalloutSubview, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { Platform, Button, Image, Alert, StyleSheet, Text, View, TouchableOpacity, Dimensions, ActivityIndicator, SafeAreaView} from 'react-native';
import * as Location from 'expo-location'
import { supabase } from "../supabase-service";
import { SUPABASE_URL } from "react-native-dotenv"
import * as ImageManipulator from 'expo-image-manipulator';


const MapScreen = ( { route, navigation } )=>{
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [initialMapLocation, setInitialMapLocation] = useState(null);
    const [artworkdata, setArtworkdata] = useState([]);
    const [piecesPerLoc, setPiecesPerLoc] = useState(new Map());

    useEffect(()=>{
        const doStates = async() => {
            await fetchMarkers();
            await getInitialLocation();
        }
        doStates();
    }, [])

    /**
     * Fetch all artwork items from database.
     */
    async function fetchMarkers(){
        let { data, error } = await supabase
            .from('artworkdata')
            .select('*')
            .order('timestamp', {ascending: false})
        if(data){
            console.log("data fetch success. Total number of items: ", data.length);
            //use a map to only get items with unique lat/long combo. 
            //Items are already sorted when fetched from db, so we end up only the most recent item from each unique location.
            let uniques = [];
            let myMap = new Map();
            let piecesPerLocation = new Map();
            for ( const artwork of data ){

            //     //

            // //make thumbnail
            // let thumb = await ImageManipulator.manipulateAsync(
            //     SUPABASE_URL +"/storage/v1/object/public/"+artwork.uri,
            //     [{ resize: {width: 340} }],
            //     { compress: .4}
            //  );
            // //upload thumbnail with ".thumb.jpg" extension
            // var formData = new FormData();
            // let fileName = artwork.uri.slice(12);
            // let thumbFilename = fileName.concat(".thumb.jpg");
            // console.log(thumbFilename);
            // formData.append("files", {
            //     uri: thumb.uri,
            //     name: thumbFilename,
            //     type: 'image/${ext}',
            // })
            // //upload thumbnail to bucket
            // const thumbUploadResult = await supabase.storage
            //         .from("graffimages")
            //         .upload(thumbFilename, formData);
            //     if (thumbUploadResult.error) {
            //         console.log("thumbnail upload err");
            //         throw new Error(thumbUploadResult.error.message);  //if supabase error, throw new exception.
            //     }


            //     //

                if(!myMap.has(artwork.lat)){
                    const arr = [artwork.long];
                    myMap.set(artwork.lat, arr);
                    uniques.push(artwork);
                    let latlong = String(artwork.lat).concat(String(artwork.long))
                    piecesPerLocation.set(latlong, 1)
                }
                else{ 
                    const arr = myMap.get(artwork.lat);
                    if(!arr.includes(artwork.long)){
                        arr.push(artwork.long);
                        uniques.push(artwork);
                        let latlong = String(artwork.lat).concat(String(artwork.long))
                        piecesPerLocation.set(latlong, 1)
                    }
                    else{
                        let latlong = String(artwork.lat).concat(String(artwork.long))
                        let prev = piecesPerLocation.get(latlong);
                        piecesPerLocation.set(latlong, prev+1);
                    }
                }
            }
            setPiecesPerLoc(piecesPerLocation);
            setArtworkdata(uniques);
            console.log("Unique Locations: ", uniques.length)
            return true;
        }
        if(error){
            console.log("DB Fetch Error")
            Alert.alert("Error connecting to database")
            return false;
        }
    }

    /**
     * If lat & long are passed as params, use those as current location. 
     * Else, if given permissions, use current geolocation. 
     * Else, use a random artwork location from database.
     */
    async function getInitialLocation(){
            if(route.params){
                console.log("has route")
                    setInitialMapLocation({
                        latitude: Number(route.params.showlat),
                        longitude: Number(route.params.showlong),
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421, 
                    })
                return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');

                let randomLocation = artworkdata[Math.floor(Math.random()*items.length)];
                console.log(randomLocation)

                setInitialMapLocation({
                    latitude: randomLocation.lat,
                    longitude: randomLocation.long,
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
    
    //TODO: Make this work on desktop perhaps. Currently broken.
    if(Platform.OS != 'ios' && Platform.OS != 'android'){
        return(
            <Text>Currently, map view is only available on mobile devices. Your platform is {Platform.OS} </Text>
        )
    }

    if (initialMapLocation==null){
        return(
            <View style={styles.container}>
                <Text>Acquiring geolocation...{"\n"}{"\n"}</Text>
                <ActivityIndicator size="large" color="white" />
            </View>
        )
    }

    return (    
        <> 
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialMapLocation}
                // provider={PROVIDER_GOOGLE}
            >                
                { artworkdata.map((marker)=>{
                    let latlong = String(marker.lat).concat(String(marker.long))
                    // console.log("Placing marker at: ", latlong)
                    let prev = piecesPerLoc.get(latlong);
                    // console.log("Pieces here: ", prev);
                    let imageurl = SUPABASE_URL +"/storage/v1/object/public/"+marker.uri+".thumb.jpg"
                    // console.log(imageurl)
                    let msg = "View Detail ("
                    msg = msg.concat(prev).concat(')');
                    return(
                        <Marker
                            coordinate={{ latitude: Number(marker.lat), longitude: Number(marker.long)}}
                            key={marker.uuid}
                            pinColor="#03395b"
                        >
                            <Callout tooltip>
                                <View>
                                    <View style={styles.bubble}>
                                        <Image
                                            style={styles.calloutThumbnail}
                                            source={{uri: imageurl}}
                                            // resizeMode={'cover'}
                                        />                                        
                                    <Button title={msg}
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
        backgroundColor: '#5d8aa6',
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
        color: '#03395b'
    }
});

export default MapScreen

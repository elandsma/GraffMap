import React, {useState, useEffect}  from 'react'
import MapView, { Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { Platform, StyleSheet, Text, View, Dimensions, ActivityIndicator, SafeAreaView} from 'react-native';
import * as Location from 'expo-location'
// import { db } from '../firebase';

const MapScreen = ( { navigation } )=>{
    const [markerLocations, setMarkerLocations] = useState();
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [initialMapLocation, setInitialMapLocation] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setInitialMapLocation({
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421, 
                })
                // todo: make this random location that has data?
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
        })();
    }, []);

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
    
    
    // get locations from database, we will iterate through these locations to make markers from each.
    useEffect(() => {
        setMarkerLocations(markersData)
        // fetch('locations.json') //endpoint to be made
        // .then(res=>res.json())
        // .then(data=>{
        //     setMarkerLocations(data)
        // })
        // .catch(console.error)
    }, []);  
      //maybe pass the current area of map in as a dependency, so when the map changes so do the markers? 
      // as opposed to creating markers for every datapoint regardless of our current view

    //TODO: Make this work on desktop perhaps
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
                {markerLocations.map((marker)=>
                    <Marker
                        coordinate={{ latitude: marker.lat, longitude: marker.long}}
                        key={marker.uuid}
                        pinColor="black"
                    >
                        <Callout><Text>{marker.description}</Text></Callout>
                    </Marker>
                )}
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
});

export default MapScreen

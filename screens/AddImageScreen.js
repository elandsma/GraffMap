import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, KeyboardAvoidingView} from 'react-native'
import {Button, Input, Image} from "react-native-elements";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 
import * as Location from 'expo-location'

const AddImageScreen = ( { navigation } )=>{
    // function addToDb(imageuri, lat, long, timestamp){
    // // Add a new document with a generated id.
    //     try{    
    //     const docRef = await addDoc(collection(db, "stubbedData"), {
    //         image_uri: imageuri,
    //         timestamp: serverTimestamp(),
    //         latlong: new firebase.firestore.GeoPoint(lat, long)
    //     });
    //     console.log("Document written with ID: ", docRef.id);
    //     return docRef.id;
    //     }
    //     catch(e){
    //         console.error("Error adding document: ", e);
    //     }
    // }


    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied. Location access required to add image to database.');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }, []);
  
    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }

    return(
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <Text>Add Image Page</Text>                      
            {location==null?
            <Text>{text} </Text>        
            :            
            <>
                <Text>
                    <Button onPress={()=> navigation.navigate('Take Photo')} containerStyle={styles.TakePhotoButton} type="outline" title="Take Photo"/>
                </Text>
                <Text>
                    {text}
                </Text>
            </>
            }
            {/* Maybe instead of navigating, we call a funtion to take photo, this way we can return a URI in this page more easily */}

        {/* Todo: Test addToDb function here, either  with stubb, or build a form for testing*/}
        </KeyboardAvoidingView>
    )
}

export default AddImageScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    proceedButton:{
        paddingTop: 10,
        marginTop: 10,
        width: 200,
    },
    TakePhotoButton:{
        paddingTop: 10,
        marginTop: 10,
        width: 200,
    }
});
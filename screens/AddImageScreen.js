import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, Alert, ImageBackground} from 'react-native'
import {Button, Input, Image} from "react-native-elements";
import {StatusBar} from 'expo-status-bar'
import * as Location from 'expo-location'
import {Camera} from 'expo-camera'


let camera = Camera
const AddImageScreen = ( { navigation } )=>{
  const [startCamera, setStartCamera] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
  const [flashMode, setFlashMode] = useState('off')
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const __startCamera = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync()
    console.log(status)
    if (status === 'granted') {
      setStartCamera(true)
    } else {
      Alert.alert('Camera Permissions Denied')
    }
  }
  const __takePicture = async () => {
    const photo = await camera.takePictureAsync()
    console.log("photo taken:")
    console.log(photo)
    setPreviewVisible(true)
    //setStartCamera(false)
    setCapturedImage(photo)
  }
  const __savePhoto = () => {
    console.log("Debug: In savePhoto")
    console.log(capturedImage)   
  }

  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }

  const __handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('on')
    } else {
      setFlashMode('auto')
    }
  }

  const __switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front')
    } else {
      setCameraType('back')
    }
  }


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




    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied. Location access required.');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }, []);
  
    let text = 'Acquiring geolocation...';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }

    if(location==null){
      return(
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <Text>{text} </Text>        
          </KeyboardAvoidingView>
      )
    }

    return(
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          {startCamera ? (
          <View
            style={{
              flex: 1,
              width: '100%'
            }}
          >
            {previewVisible && capturedImage ? (
              <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
              ) : (
              <Camera
                type={cameraType}
                flashMode={flashMode}
                style={{flex: 1}}
                ref={(r) => {
                  camera = r
                }}
              >
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    backgroundColor: 'transparent',
                    flexDirection: 'row'
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      left: '2%',
                      top: '2%',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    
                    <TouchableOpacity
                      onPress={__handleFlashMode}
                      style={{
                        backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                        borderRadius: '50%',
                        height: 25,
                        width: 25
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20
                        }}
                      >
                        ⚡️
                     </Text>
                   </TouchableOpacity>
                   
                   {/* below code flips to front camera - removed. */}
                   {/*
                   <TouchableOpacity
                      onPress={__switchCamera}
                      style={{
                        marginTop: 20,
                        borderRadius: '50%',
                        height: 25,
                        width: 25
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20
                        }}
                      >
                       {cameraType === 'front' ? '🤳' : '📷'}
                      </Text>
                   </TouchableOpacity>
                      */}

                  </View>
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      flexDirection: 'row',
                      flex: 1,
                      width: '100%',
                      padding: 20,
                      justifyContent: 'space-between'
                    }}
                  >
                    <View
                      style={{
                        alignSelf: 'center',
                        flex: 1,
                        alignItems: 'center'
                      }}
                    >
                      <TouchableOpacity
                        onPress={__takePicture}
                        style={{
                          width: 70,
                          height: 70,
                          bottom: 0,
                          borderRadius: 50,
                          backgroundColor: '#fff'
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Camera>
            )}
          </View>
        ) : (
        <View
          style={{
            // flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={__startCamera}
            style={{
              width: 130,
              borderRadius: 10,
              backgroundColor: '#2C6BED',
              // #14274e
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 40
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Open Camera
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="auto" />

                {/* <Text>
                    <Button onPress={()=> navigation.navigate('Take Photo')} containerStyle={styles.TakePhotoButton} type="outline" title="Take Photo"/>
                </Text>
                <Text>
                    {text}
                </Text> */}
           
        </KeyboardAvoidingView>
    )
}


const CameraPreview = ({photo, retakePicture, savePhoto}) => {
  console.log('debug: previewing photo:', photo)
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      <ImageBackground
        source={{uri: photo && photo.uri}}
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 100,
                height: 40,
                alignItems: 'center',
                borderRadius: 20,
                backgroundColor: 'black',
                textAlignVertical: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  textAlignVertical: 'center'
                }}
              >
                Re-take
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 100,
                height: 40,
                alignItems: 'center',
                borderRadius: 20,
                backgroundColor: 'black',
                textAlignVertical: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  textAlignVertical: 'center'

                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}






export default AddImageScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        // padding: 10,
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
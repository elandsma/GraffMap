import React, {useState, useEffect} from 'react'
import { Platform, StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, Alert, ImageBackground, Image, ActivityIndicator} from 'react-native'
import {Button, Input } from "react-native-elements";
import  Modal  from "react-native-modal";
import {StatusBar} from 'expo-status-bar';
import * as Location from 'expo-location';
import {Camera} from 'expo-camera';
import { supabase } from "./../supabase-service";
import { SUPABASE_URL } from "react-native-dotenv"
import UploadingModal from '../components/UploadingModal';
import Tags from "react-native-tags";

let camera = Camera
const AddImageScreen = ( { navigation } )=>{
    const [startCamera, setStartCamera] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [flashMode, setFlashMode] = useState('off')
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [showUploadingModal, setShowUploadingModal] = useState(false);
    const [addAttributesModal, setAddAttributesModal] = useState(false);
    const [attemptingUpload, setAttemptingUpload] = useState(false);
    const [uploadWasSuccess, setUploadWasSuccess] = useState(null);
    const [addArtworkResultDisplay, setAddArtworkResultDisplay] = useState(null);
    const [dbInsertResult, setDbInsertResult] = useState(null); 

    // const [uploadedUuid, setUploadedUuid] = useState(null);

    const __startCamera = async () => {
        const {status} = await Camera.requestCameraPermissionsAsync()
        console.log("Camera Permissions Status: "+status)
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

    //erase this later, used for testing
    const uploadPhotoToBucket2 = async()=>{
        setAttemptingUpload(true);
        setShowUploadingModal(true);
        let results = await uploadPhotoToBucketHelper()
        .then((res)=>{
            console.log("DEBUG SUCCESS UPLOAD")
            setUploadWasSuccess(true)
            setAttemptingUpload(false);
            setUploadResults(res);
        })
        .catch((err)=>{ 
            console.log("DEBUG FAIL UPLOAD")
            setUploadWasSuccess(false)
            setAttemptingUpload(false);
            setUploadResults(err);
        })
    }

    // round 4 decimal places for numbers. Used strings instead.
    // function reduceCoordinatePrecision(originalCoord){
    //     return +(Math.round(originalCoord + "e+4")  + "e-4");
    // }

    /**
     * reduces precision of latitude or longitude by restricting to maximum 6 places past decimal
     * Rounding with numbers causes more variance - we want less, thus, using sliced strings. 
     * @param originalCoord raw latitude or longitude
     * @return the new coordinate
     */
    function reduceCoordinatePrecision(originalCoord){
        originalCoord = String(originalCoord);
        const portions = originalCoord.split('.');
        let decimals = portions[1];
        decimals = decimals.substring(0, 4);
        let newCoord = portions[0].concat(".").concat(decimals)
        return newCoord;
    }

    /**
     * Adds photo to bucket.
     * Then, inserts new row into database with: 
     *      UUID, 
     *      lat & long (from location state), 
     *      timestamp (server side Date.now() upon insert),
     *      URI (returned from bucket upload)
     * @returns photo (which is 'capturedImage' state), imageData (which is the returned result of the database insert)
     */
    const uploadPhotoToBucket = async() => {
        setAttemptingUpload(true);
        setShowUploadingModal(true);
        try {
            if (!capturedImage) {
                throw new Error("!capturedImage");
            }
            let photo = capturedImage;
            //get extension for uploading
            const ext = photo.uri.substring(photo.uri.lastIndexOf(".") + 1);
            //get filename for uploading
            const fileName = photo.uri.replace(/^.*[\\\/]/,"");
            //create object for uploading
            var formData = new FormData();
            formData.append("files", {
                uri: photo.uri,
                name: fileName,
                type: photo.type ? 'image/${ext}' : 'video/${ext}',
            })

            //upload photo to bucket
            const uploadResult = await supabase.storage
                .from("graffimages")
                .upload(fileName, formData);
            if (uploadResult.error) {
                throw new Error(uploadResult.error.message);  //if supabase error, throw new exception.
            }
            //return original photo, and supabase image data
            console.log("Image Upload Successful: ")
            console.log(uploadResult.data)

            //reduce precision in lat and long to 5 decimal points
            const latReduced = reduceCoordinatePrecision(location.coords.latitude);
            const longReduced = reduceCoordinatePrecision(location.coords.longitude);
            
            //gathering data for inserting to database
            let rowData={
                uri: uploadResult.data.Key, 
                lat: latReduced, 
                long: longReduced
            }
            
            //insert to database
            const insertResult = await supabase
                .from('artworkdata')
                .insert([
                    { 
                        uri: rowData.uri, 
                        lat: rowData.lat, 
                        long: rowData.long,
                        timestamp: new Date().toLocaleString()
                    },
                ])
            console.log(insertResult);
            if(insertResult.error){
                throw new Error(insertResult.error.message);
            }
            setDbInsertResult(insertResult.data[0]);

            //if we reach this point, there no errors in the image upload or the db row insert, so we can reflect that in our state
            setUploadWasSuccess(true)
            setAttemptingUpload(false);
            setAddArtworkResultDisplay(JSON.stringify(insertResult.data));
 
            return {...photo, imageData: insertResult.data};
        }
        catch(e){
            console.log("Image upload or insert error: "+e);
            setUploadWasSuccess(false)
            setAttemptingUpload(false);
            setAddArtworkResultDisplay("Upload or Insert Error: "+e);
        }
    }

    /**
     * This is inside addtobucket, decided not to make it's own function, but subject to change.
     **/
    // const addRowToDb = async(rowData)=>{
    //     // try{
    //         const { data, error } = await supabase
    //         .from('artworkdata')
    //         .insert([
    //         { 
    //             uri: rowData.uri, 
    //             lat: rowData.lat, 
    //             long: rowData.long,
    //         },
    //         ])
    //         return {data, error}        
    // } 
    
    /**
     *  Ask permission for geolocation upon render. If granted, assign to state. Location state is null by default.
     *  Later on, there is a null check for location state, which presents a the 'errorMsg' state assigned here if permission is not granted.
     */
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
  
    if(Platform.OS != 'ios' && Platform.OS != 'android'){
        return(
            <KeyboardAvoidingView behavior='padding' style={styles.container}> 
                <Text>Currently, this functionality is only available on mobile devices. Your platform is {Platform.OS} </Text>
                {/* TODO: change this to "iOS devices only" since android compatibiltiy is currently questionable? */}
            </KeyboardAvoidingView>
        )
    }

    let displayMessage = 'Acquiring geolocation...';
    if (errorMsg) {
        displayMessage = errorMsg;
    } else if (location) {
        displayMessage = JSON.stringify(location);
    }

    if(location==null){
        return(
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
                <Text>{displayMessage}{"\n"}{"\n"} </Text> 
                <ActivityIndicator size="large" color="white" />       
            </KeyboardAvoidingView>
        )
    }

    return(
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            {startCamera ? 
                (
                    <View
                        style={{
                            flex: 1,
                            width: '100%'
                        }}
                    >
                        {previewVisible && capturedImage ? 
                            (
                                <CameraPreview photo={capturedImage} savePhoto={uploadPhotoToBucket} retakePicture={__retakePicture} />
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
                        
                                            {/* below code flips to front camera - removed because probably not useful for this. */}
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
                            )
                        }
                    </View>
                ) : (

                    <View
                        style={{
                            // flex: 1,
                            // backgroundColor: '#fff',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#5d8aa6'
                        }}
                    >
                        <TouchableOpacity
                            onPress={__startCamera}
                            style={{
                                width: 150,
                                borderRadius: 25,
                                backgroundColor: '#045a8f',
                                // #14274e
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 48
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    fontSize: 18
                                }}
                            >
                                Open Camera
                            </Text>
                        </TouchableOpacity>
                        {/* <Text>{'\n'}{'\u2022'} Note: geolocation access is required to add photos.</Text> */}
                    </View>
                )
            }
            {/* <StatusBar style="auto" /> */}
        
            {/* Potential TODO: Maybe make this modal an imported component */}
            <Modal
                animationIn="fadeIn"
                backdropOpacity={0.6}
                hasBackdrop={true}
                backdropColor="black"
                isVisible={showUploadingModal}
                onRequestClose={()=>{
                    setShowUploadingModal(false);
                }}    
            >
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        {attemptingUpload?
                        <>
                            <Text style={modalStyles.modalText}>Saving photo...</Text>
                            {/* <Text>{capturedImage.uri}</Text> */}
                            <ActivityIndicator size="large" color="white" />
                        </>
                        :
                        <>
                            {uploadWasSuccess?
                            <>
                                {addAttributesModal?
                                    <>
                                        <Text>Type attributes in the box below.</Text>

                                    <Tags
                                        initialText=""
                                        textInputProps={{
                                            placeholder: "attributes, artist, medium, etc"
                                        }}
                                        onChangeTags={tags=>console.log(tags)}
                                        onTagPress={(index, tagLabel, event, deleted) =>
                                            console.log(index, tagLabel, event, deleted ? "deleted" : "not deleted")
                                          }
                                          containerStyle={{ justifyContent: "center" }}
                                          inputStyle={{ backgroundColor: "#DCDCDC" }}
                                          tagContainerStyle= {{ backgroundColor: "Green"}}
                                          renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                                            <TouchableOpacity key={`${tag}-${index}`} onPress={onPress}>
                                              <Text> {tag} </Text>
                                            </TouchableOpacity>
                                          )}

                                    />

                                     
                                        {console.log(dbInsertResult)}
                                        <Text>{dbInsertResult.uuid}</Text>
                                       {/* {let uri = SUPABASE_URL +"/storage/v1/object/public/"+dbInsertResult.uri } */}

                                        <View style={{flexDirection:"row"}}>
                                            <TouchableOpacity
                                                style={[modalStyles.button, modalStyles.buttonClose]}
                                                onPress={() => setAddAttributesModal(false)}
                                            >
                                                <Text style={modalStyles.textStyle}>Submit</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[modalStyles.button, modalStyles.buttonClose]}
                                                onPress={() => setAddAttributesModal(false)}
                                            >
                                                <Text style={modalStyles.textStyle}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                    :
                                    <>
                                        <Text>
                                            Success!{"\n"}
                                        {/* {addArtworkResultDisplay} */}
                                        </Text>
                                        <TouchableOpacity
                                            style={[modalStyles.button, modalStyles.buttonClose]}
                                            onPress={() => navigation.navigate('Home')}
                                        >
                                            <Text style={modalStyles.textStyle}>Home</Text>
                                            {/* Todo: Go to display of this photo on map or in display view? As opposed to just going home*/}
                                            {/* Also potentially add multiple options here. */}
                                        </TouchableOpacity>
                                        
                                        

                                        {/* 
                                        <Text>{"\n"}</Text>
                                        <TouchableOpacity
                                            style={[modalStyles.button, modalStyles.buttonClose]}
                                            onPress={() => setAddAttributesModal(true)}
                                        >
                                            <Text style={modalStyles.textStyle}>Add Attribute Tags</Text>
                                        </TouchableOpacity> */}


                                    </>
                                }
                            </>
                            :
                            <>
                                <Text>{addArtworkResultDisplay}{"\n"} </Text>
                                <TouchableOpacity
                                    style={[modalStyles.button, modalStyles.buttonClose]}
                                    onPress={() => setShowUploadingModal(false)}
                                >
                                    <Text style={modalStyles.textStyle}>Return</Text>
                                </TouchableOpacity>
                            </>
                            }                            
                        </>
                        }                        
                    </View>
                </View>
            </Modal> 
        </KeyboardAvoidingView>
    )
}

const CameraPreview = ({photo, retakePicture, savePhoto}) => {
    return (
        <View
            style={{
                backgroundColor: '#F5FCFF',
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
        backgroundColor: '#5d8aa6'

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

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: '#66afdd',
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: '#045a8f',
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: '#5d8aa6'
    },
});
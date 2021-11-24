// import React, { useState, useEffect, useRef } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
// import { Camera } from 'expo-camera';

// export default function TakePhotoScreen() {
//   const [hasCameraPermission, setHasCameraPermission] = useState(null);
//   const [type, setType] = useState(Camera.Constants.Type.back);
//   const cameraRef = useRef(null)
//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasCameraPermission(status === 'granted');
//     })();
//   }, []);

//   if (hasCameraPermission === null) {
//     return <View />;
//   }
//   if (hasCameraPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   const takePhoto = async()=>{
//     if(cameraRef){
//       console.log('debug: inside takePhoto()');
//       try {
//         let photo = await cameraRef.current.takePictureAsync({
//           allowsEditing: true,
//           aspect: [4,3],
//           quality: 1
//         });
//         return photo;
//       } catch(e){
//         console.log("error taking photo: "+e);
//       }
//     }
//   }






//   return (
//     <View style={styles.container}>
//       <Camera style={styles.camera} type={type} ref={cameraRef}>
//         <View style={styles.buttonContainer}>
//           {/* <TouchableOpacity
//             style={styles.button}
//             onPress={() => {
//               setType(
//                 type === Camera.Constants.Type.back
//                   ? Camera.Constants.Type.front
//                   : Camera.Constants.Type.back
//               );
//             }}>
//             <Text style={styles.text}> Flip </Text>
//           </TouchableOpacity> */}
//           <TouchableOpacity 
//             style={styles.button}
//             onPress={async ()=> {
//                 const r = await takePhoto();
//                 // Alert.alert("Debug photo", JSON.stringify(r))
//                 console.log(JSON.stringify(r))
//               }
//             }
//           >
//             <Text style={{ color: "white"}}>Take Photo</Text>
//           </TouchableOpacity>
//         </View>
//       </Camera>
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   camera:{
//     flex:1
//   },
//   text:{
//     fontSize: 18,    
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     minWidth: '100%',
//     flex: 1,
//     paddingBottom: 20,

//   },
//   button: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 40,
//     margin: 8,
//     backgroundColor: 'grey',
//     borderRadius: 50,
//     alignSelf: 'flex-end',
    
//   },
// })




















// import {StatusBar} from 'expo-status-bar'
// import React, {useState} from 'react'
// import {StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, Image} from 'react-native'
// import {Camera} from 'expo-camera'
// // import { supabase } from '../supabaseClient'

// let camera = Camera
// export default function TakePhotoScreen() {
//   const [startCamera, setStartCamera] = useState(false)
//   const [previewVisible, setPreviewVisible] = useState(false)
//   const [capturedImage, setCapturedImage] = useState(null)
//   const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
//   const [flashMode, setFlashMode] = useState('off')

//   const __startCamera = async () => {
//     const {status} = await Camera.requestCameraPermissionsAsync()
//     console.log(status)
//     if (status === 'granted') {
//       setStartCamera(true)
//     } else {
//       Alert.alert('Access denied')
//     }
//   }
//   const __takePicture = async () => {
//     const photo = await camera.takePictureAsync()
//     console.log(photo)
//     setPreviewVisible(true)
//     //setStartCamera(false)
//     setCapturedImage(photo)
//   }
//   const __savePhoto = () => {
//     console.log("Debug: In savePhoto")
//     console.log(photo)   
//   }


//   const __retakePicture = () => {
//     setCapturedImage(null)
//     setPreviewVisible(false)
//     __startCamera()
//   }
  
//   const __handleFlashMode = () => {
//     if (flashMode === 'on') {
//       setFlashMode('off')
//     } else if (flashMode === 'off') {
//       setFlashMode('on')
//     } else {
//       setFlashMode('auto')
//     }
//   }
//   const __switchCamera = () => {
//     if (cameraType === 'back') {
//       setCameraType('front')
//     } else {
//       setCameraType('back')
//     }
//   }
//   return (
//     <View style={styles.container}>
//       {startCamera ? (
//         <View
//           style={{
//             flex: 1,
//             width: '100%'
//           }}
//         >
//           {previewVisible && capturedImage ? (
//             <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
//           ) : (
//             <Camera
//               type={cameraType}
//               flashMode={flashMode}
//               style={{flex: 1}}
//               ref={(r) => {
//                 camera = r
//               }}
//             >
//               <View
//                 style={{
//                   flex: 1,
//                   width: '100%',
//                   backgroundColor: 'transparent',
//                   flexDirection: 'row'
//                 }}
//               >
//                 <View
//                   style={{
//                     position: 'absolute',
//                     left: '5%',
//                     top: '10%',
//                     flexDirection: 'column',
//                     justifyContent: 'space-between'
//                   }}
//                 >
//                   <TouchableOpacity
//                     onPress={__handleFlashMode}
//                     style={{
//                       backgroundColor: flashMode === 'off' ? '#000' : '#fff',
//                       borderRadius: '50%',
//                       height: 25,
//                       width: 25
//                     }}
//                   >
//                     <Text
//                       style={{
//                         fontSize: 20
//                       }}
//                     >
//                       ⚡️
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={__switchCamera}
//                     style={{
//                       marginTop: 20,
//                       borderRadius: '50%',
//                       height: 25,
//                       width: 25
//                     }}
//                   >
//                     <Text
//                       style={{
//                         fontSize: 20
//                       }}
//                     >
//                       {cameraType === 'front' ? '🤳' : '📷'}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//                 <View
//                   style={{
//                     position: 'absolute',
//                     bottom: 0,
//                     flexDirection: 'row',
//                     flex: 1,
//                     width: '100%',
//                     padding: 20,
//                     justifyContent: 'space-between'
//                   }}
//                 >
//                   <View
//                     style={{
//                       alignSelf: 'center',
//                       flex: 1,
//                       alignItems: 'center'
//                     }}
//                   >
//                     <TouchableOpacity
//                       onPress={__takePicture}
//                       style={{
//                         width: 70,
//                         height: 70,
//                         bottom: 0,
//                         borderRadius: 50,
//                         backgroundColor: '#fff'
//                       }}
//                     />
//                   </View>
//                 </View>
//               </View>
//             </Camera>
//           )}
//         </View>
//       ) : (
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: '#fff',
//             justifyContent: 'center',
//             alignItems: 'center'
//           }}
//         >
//           <TouchableOpacity
//             onPress={__startCamera}
//             style={{
//               width: 130,
//               borderRadius: 4,
//               backgroundColor: '#14274e',
//               flexDirection: 'row',
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: 40
//             }}
//           >
//             <Text
//               style={{
//                 color: '#fff',
//                 fontWeight: 'bold',
//                 textAlign: 'center'
//               }}
//             >
//               Take picture
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <StatusBar style="auto" />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center'
//   }
// })

// const CameraPreview = ({photo, retakePicture, savePhoto}) => {
//   console.log('sdsfds', photo)
//   return (
//     <View
//       style={{
//         backgroundColor: 'transparent',
//         flex: 1,
//         width: '100%',
//         height: '100%'
//       }}
//     >
//       <ImageBackground
//         source={{uri: photo && photo.uri}}
//         style={{
//           flex: 1
//         }}
//       >
//         <View
//           style={{
//             flex: 1,
//             flexDirection: 'column',
//             padding: 15,
//             justifyContent: 'flex-end'
//           }}
//         >
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between'
//             }}
//           >
//             <TouchableOpacity
//               onPress={retakePicture}
//               style={{
//                 width: 130,
//                 height: 40,

//                 alignItems: 'center',
//                 borderRadius: 4
//               }}
//             >
//               <Text
//                 style={{
//                   color: '#fff',
//                   fontSize: 20
//                 }}
//               >
//                 Re-take
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={savePhoto}
//               style={{
//                 width: 130,
//                 height: 40,

//                 alignItems: 'center',
//                 borderRadius: 4
//               }}
//             >
//               <Text
//                 style={{
//                   color: '#fff',
//                   fontSize: 20
//                 }}
//               >
//                 save photo
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ImageBackground>
//     </View>
//   )
// }










































// // import React, {useState, useEffect}  from 'react'
// // import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity} from 'react-native'
// // import {Camera} from 'expo-camera'
// // const TakePhotoScreen = ( { navigation } )=>{
// //     const [hasPermission, setHasPermission] = useState(null);
// //     const [type, setType] = useState(Camera.Constants.Type.back);
    
// //     useEffect(() => {
// //         (async () => {
// //           const { status } = await Camera.requestPermissionsAsync();
// //           setHasPermission(status === 'granted');
// //         })();
// //       }, []);
// //       if (hasPermission === null) {
// //         return <View />;
// //       }
// //       if (hasPermission === false) {
// //         return <Text>No access to camera</Text>;
// //       }
    
// //     return(
// //       <View style={styles.container}>
// //       <Camera style={styles.camera} type={type}>
// //         <View style={styles.buttonContainer}>
// //           <TouchableOpacity
// //             style={styles.button}
// //             onPress={() => {
// //               setType(
// //                 type === Camera.Constants.Type.back
// //                   ? Camera.Constants.Type.front
// //                   : Camera.Constants.Type.back
// //               );
// //             }}>
// //             <Text style={styles.text}> Flip </Text>
// //           </TouchableOpacity>
// //         </View>
// //       </Camera>
// //     </View>





// //         // <KeyboardAvoidingView behavior='padding' style={styles.container}>
// //         //     <Text>Take Image Page</Text>



// //         // </KeyboardAvoidingView>
// //     )
// // }


// // export default TakePhotoScreen



// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   camera: {
// //     flex: 1,
// //   },
// //   buttonContainer: {
// //     flex: 1,
// //     backgroundColor: 'transparent',
// //     flexDirection: 'row',
// //     margin: 20,
// //   },
// //   button: {
// //     flex: 0.1,
// //     alignSelf: 'flex-end',
// //     alignItems: 'center',
// //   },
// //   text: {
// //     fontSize: 18,
// //     color: 'white',
// //   },
// // });



// // // const styles = StyleSheet.create({
// // //     container: {
// // //         flex: 1,
// // //         alignItems: "center",
// // //         justifyContent: "center",
// // //         padding: 10,
// // //     },
// // //     proceedButton:{
// // //         paddingTop: 10,
// // //         marginTop: 10,
// // //         width: 200,
// // //     }
// // // });
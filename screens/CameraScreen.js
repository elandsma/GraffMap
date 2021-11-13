import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'

export default function CameraScreen(){
    return(
        <View style={StyleSheet.container}>

        </View>
    )
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    }
  })







// import {Camera} from 'expo-camera'
// import * as Permissions from 'expo-permissions'
// import {Text, TouchableOpacity, View} from 'react-native'

// const CameraScreen=()=>{
//     const [allowedCamera, setAllowedCamera] = useState(false)

//     const allowPermission = async()=>{
//         try{
//             const Camera = await Permissions.askAsync(Permissions.Camera)
//             if(!Camera.granted){
//                 return Permissions.askAsync(Permissions.Camera)
//             }

//             setAllowedCamera(true)
//         } catch(error){
//             console.log("Error loading the camera: " +error)
//         }

//     }

//     if(!allowedCamera){
//         return(
//             <View style={styles.notAllowed}> 
//                 <TouchableOpacity style={styles.btn} onPress={allowPermission}>
//                     <Text style={styles.btnText}>Allow Camera Permission </Text>
//                 </TouchableOpacity>
//             </View>
//         )
        
//     }
//     return(
//         <View>
//             <Text>Camera Screen</Text>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     notAllowed:{
//         flex:1,
//         justifyContent:"center",
//         alignitems:"center",
//     },
//     btn:{
//         padding: 20,
//         backgroundColor: "#000",
//         justifyContent: "center",
//         alignItems:"center",
//         borderRadius: 10

//     },
//     btnText:{
//         color:"#eee",
//         fontSize:18,
//         fontWeight: "bold"

//     }
// })
// export default CameraScreen


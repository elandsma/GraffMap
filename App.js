import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddImageScreen from './screens/AddImageScreen';
import TakePhotoScreen from './screens/TakePhotoScreen';
import MapScreen from './screens/MapScreen';
import AboutScreen from './screens/AboutScreen';
import RandomImageScreen from './screens/RandomImageScreen';
import { supabase } from "./supabase-service";
import 'react-native-url-polyfill/auto'
import { Header } from './components/Header';

// import firebase from "firebase";

const Stack = createNativeStackNavigator();

const globalScreenOptions ={
    headerStyle: { backgroundColor: "#2C6BED"},   //header bgcolor
    headerTitleStyle: {color: "white"},           //header text color
    headerTintColor: "white",                     //header icon color 
}

function LogoTitle(){
    return(
        <View style={headerStyles.container}>
            <TouchableOpacity>
                <Image 
                    style={headerStyles.logo} 
                    source={require('./assets/logo.png')}
                />
            </TouchableOpacity>
            <Text style={{color: 'white', flexDirection: 'row'}}>text</Text>
            <View style={headerStyles.iconsContainer}>
                <TouchableOpacity>
                    <Image
                        source={{
                            uri: 'https://img.icons8.com/fluency/48/ffffff/map-marker.png'
                        }}
                        style={headerStyles.icon}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        source={{
                            uri: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/plus-2-math.png'
                        }}
                        style={headerStyles.icon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function App() {
    return (
        <>
        <NavigationContainer style={styles.container}>
            <Stack.Navigator screenOptions={globalScreenOptions} >
                <Stack.Screen name="Home" component={HomeScreen}
                    options={{ headerTitle: (props) => <LogoTitle {...props}/>}} />
                <Stack.Screen name="About" component={AboutScreen}/>
                <Stack.Screen name="Add Image" component={AddImageScreen}/>
                <Stack.Screen name="Map" component={MapScreen}/>
                <Stack.Screen name="Random" component={RandomImageScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
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
});

const headerStyles = StyleSheet.create({
    container:{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 20,
        // paddingTop: 15,
    },
    iconsContainer:{
        flexDirection: 'row',
    },
    icon:{
        width: 30,
        height: 30,
        marginLeft: 10,
        resizeMode: 'contain',
    },
    logo:{
        width: 50,
        height: 50,
        resizeMode: 'contain'
    }
})

{/* <View style={styles.container}>
<Text>graffmap</Text>
<StatusBar style="auto" />   
{/* "auto" for phone's default light/dark mode settings. "light" for always white */}
// </View> */}

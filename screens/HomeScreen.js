import React from 'react'
import { StyleSheet, Text, View} from 'react-native'
import {Button, Input, Image} from "react-native-elements";

const HomeScreen = ( {navigation })=>{

    return(
        <>
        <View style={styles.container}>    
            <Text>Welcome to GraffMap</Text>
            <Button onPress={()=> navigation.navigate('Map')} containerStyle={styles.linkButton} type="outline" title="Map"/>
            <Button onPress={()=> navigation.navigate('Add Image')} containerStyle={styles.linkButton} type="outline" title="Add Image"/>
            <Button onPress={()=> navigation.navigate('About')} containerStyle={styles.linkButton} type="outline" title="About"/>
            <Button onPress={()=> navigation.navigate('Random')} containerStyle={styles.linkButton} type="outline" title="Random Graff"/>

        </View>
        </>        
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    linkButton:{
        paddingTop: 10,
        marginTop: 10,
        width: 200,
    }
});


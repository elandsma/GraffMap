import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Linking} from 'react-native'
import {Button, Input, Image} from "react-native-elements";

const AboutScreen = ( {navigation })=>{
    return(
        <View style={styles.container}>

            <Text>GraffMap</Text>
            <Text>{"\n"}Current Version: 11/12/21 10:42pm. Beta.</Text>
            <Text>{"\n"}For inquiries, contact <Text style={{color: 'blue'}} onPress={()=>Linking.openURL('mailto:info@graffmap.net?subject=graffmap&body=')}>info@graffmap.net</Text></Text>
            {/* <Text>{"\n"}Inquiries:</Text>
            <Button onPress={() => Linking.openURL('mailto:support@example.com') }
                title="support@example.com" /> */}
            <Text style={styles.quote}>{"\n"}{"\n"}
                "Imagine... a city where everybody could draw whatever they liked. Where every street was awash with a million colours and little phrases.
                Where standing at a bus stop was never boring. A city that felt like a party where everyone was invited, not just the estate agents
                and barons of big business. Imagine a city like that and stop leaning against the wall - it's wet." {"\n"}-Banksy
            </Text>
        </View>
    )
}

export default AboutScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    quote:{
        fontStyle: 'italic',
        textAlign: "center",
        fontSize: 12
    }
});


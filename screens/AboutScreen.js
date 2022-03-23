import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Linking, ScrollView, TouchableOpacity, SafeAreaView} from 'react-native'
import {Button, Input, Image} from "react-native-elements";


//import for the animation of Collapse and Expand
import * as Animatable from 'react-native-animatable';
//import for the collapsible/Expandable view
import Collapsible from 'react-native-collapsible';
//import for the Accordion view
import Accordion from 'react-native-collapsible/Accordion';


const CONTENT = [
    {
        title: 'Motivation',
        content: 
            'Motivation for development'
    },
    {
        title: 'Tech',
        content:
            'Tech stuff, frameworks, github repo, licensing'
    },
    {
        title: 'Terms & Conditions',
        content:
            'fancy stuff'
    },
    {
        title: 'Contact',
        content:
            <>
            <Text>For inquiries: {"\n"}</Text>
            <Text style={{color: 'blue'}} onPress={()=>Linking.openURL('mailto:info@graffmap.net?subject=graffmap&body=')}>info@graffmap.net</Text>
            </>
    },
]


const AboutScreen = ( { navigation } )=>{
    const [activeSections, setActiveSections] = useState([]);
    const [collapsed, setCollapsed] = useState(true);
    const setSections = (sections) => {
        //setting up a active section state
        setActiveSections(sections.includes(undefined) ? [] : sections);
      };
    

      const renderHeader = (section, _, isActive) => {
        //Accordion Header view
        return (
          <Animatable.View
            duration={400}
            style={[styles.header, isActive ? styles.active : styles.inactive]}
            transition="backgroundColor">
            <Text style={styles.headerText}>{section.title}</Text>
          </Animatable.View>
        );
      };

      const renderContent = (section, _, isActive) => {
        //Accordion Content view
        return (
          <Animatable.View
            duration={250}
            style={[styles.content, isActive ? styles.active : styles.inactive]}
            transition="backgroundColor">
            <Animatable.Text
              animation={isActive ? 'bounceIn' : undefined}
              style={{ textAlign: 'center' }}>
              {section.content}
            </Animatable.Text>
          </Animatable.View>
        );
      };
    
      

    return(
        <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <ScrollView style={{paddingTop: 40}}>
                <View style={{justifyContent: 'spaceBetween'}}>
                <Accordion
                    activeSections={activeSections}
                    //for any default active section
                    sections={CONTENT}
                    //title and content of accordion
                    touchableComponent={TouchableOpacity}
                    //which type of touchable component you want
                    //It can be the following Touchables
                    //TouchableHighlight, TouchableNativeFeedback
                    //TouchableOpacity , TouchableWithoutFeedback
                    //expandMultiple={False}
                    //Do you want to expand mutiple at a time or single at a time
                    renderHeader={renderHeader}
                    //Header Component(View) to render
                    renderContent={renderContent}
                    //Content Component(View) to render
                    duration={200}
                    //Duration for Collapse and expand
                    onChange={setSections}
                    //setting the state of active sections
                />
                </View>
                
            </ScrollView>
            <View>
                <Text style={{textAlign: "center",}}>Current Version: 3/22/22 5pm Beta</Text>

                <Text style={styles.quote}>{"\n"}
                    "Imagine... a city where everybody could draw whatever they liked. Where every street was awash with a million colours and little phrases.
                    Where standing at a bus stop was never boring. A city that felt like a party where everyone was invited, not just the estate agents
                    and barons of big business. Imagine a city like that and stop leaning against the wall - it's wet." {"\n"}-Banksy
                </Text>   
            </View>
        </View>
        </SafeAreaView>
    )
}

export default AboutScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: '#F5FCFF'
    },
    quote:{
        fontStyle: 'italic',
        textAlign: "center",
        fontSize: 12,
    },

    header: {
        backgroundColor: '#F5FCFF',
        padding: 10,
    },
    header: {
        backgroundColor: '#F5FCFF',
        padding: 10,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
      },
    content: {
        padding: 20,
        backgroundColor: '#fff',
    },
    active: {
        backgroundColor: 'rgba(255,255,255,1)',
    },
    inactive: {
        backgroundColor: 'rgba(245,252,255,1)',
    },

});


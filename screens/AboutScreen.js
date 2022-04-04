import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Linking, ScrollView, TouchableOpacity, SafeAreaView} from 'react-native'
import {Button, Input, Image} from "react-native-elements";

//import for the animation of Collapse and Expand
import * as Animatable from 'react-native-animatable';
//import for the collapsible/Expandable view
import Collapsible from 'react-native-collapsible';
//import for the Accordion view
import Accordion from 'react-native-collapsible/Accordion';


const AboutScreen = ( { navigation } )=>{
    const CONTENT = [
        {
            title: 'Motivation',
            content:
                <> 
                <Text>GraffMap was inspired by rich graffiti culture here in North Carolina and the ever-changing landscape of various locations. {'\n'}GraffMap is intended to enable users to preserve chronological snapshots in time of artwork that is otherwise ephemeral by nature.</Text>
                <Text>{"\n"}{"\n"}Logo by 
                    <Text style={{color: 'blue'}} onPress={()=>Linking.openURL('instagram://user?username=lord.melto.ftk')}> @lord.melto.ftk</Text>
                </Text>
                </> 
            },
        {
            title: 'Tech',
            content:
            <>
                <Text>Built with React Native on the ExpoGo SDK. Hosted by Supabase, an open-source BaaS provider. The code for this application is open-source and may be viewed at {"\n"}<Text style={{color: 'blue'}} onPress={()=>Linking.openURL('https://github.com/elandsma/GraffMap')}>https://github.com/elandsma/GraffMap</Text></Text>
            </>
        },
        {
            title: 'Legal',
            content:
                <>
                    <Text style={{color: 'blue'}} onPress={()=> {navigation.navigate('Privacy Policy')}} >Privacy Policy</Text>
                    <Text>{"\n"}{"\n"}</Text>
                    <Text style={{color: 'blue'}} onPress={()=> {navigation.navigate('Terms and Conditions')}} >Terms & Conditions</Text>
                    <Text>{"\n"}</Text>
                    <Text>{"\n"}{"\n"}tldr: be excellent to each other</Text>
                </>
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
            style={[styles.header, isActive ? styles.activeHeader : styles.inactive]}
            transition="backgroundColor">
            <Text style={[styles.headerText, isActive? styles.activeHeaderText: styles.headerText]}>{section.title}</Text>
          </Animatable.View>
        );
      };

      const renderContent = (section, _, isActive) => {
        //Accordion Content view
        return (
          <Animatable.View
            duration={120}
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
        <SafeAreaView style={{flexGrow:1, backgroundColor: '#5d8aa6', justifyContent: 'space-between'}}>
        {/* <View style={styles.container}> */}
            <ScrollView style={{paddingTop: 20}}>
                <View style={{paddingBottom: 20, alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                            source={require('../assets/gmLittle.png')}
                            style={{width: 200, alignSelf: 'center', aspectRatio: 1, resizeMode: 'contain'}}
                            // resizeMode={'cover'}
                        />
                </View>
                <View style={{justifyContent: 'spaceBetween', marginBottom: 20}}>
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
                <View>
                    <Text style={{textAlign: "center", marginTop: 5}}>Version: Pre-release Beta 1.0. April 4, 2022. </Text>
                    <Text style={styles.quote}>{"\n"}
                        "Imagine... a city where everybody could draw whatever they liked. Where every street was awash with a million colours and little phrases.
                        Where standing at a bus stop was never boring. A city that felt like a party where everyone was invited, not just the estate agents
                        and barons of big business. Imagine a city like that and stop leaning against the wall - it's wet." {"\n"}-Banksy
                    </Text>   
                </View>
            </ScrollView>
        {/* </View> */}
        </SafeAreaView>
    )
}

export default AboutScreen

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        // backgroundColor: '#F5FCFF'
        backgroundColor: '#5d8aa6'
    },
    quote:{
        fontStyle: 'italic',
        textAlign: "center",
        fontSize: 12,
    },
    header: {
        backgroundColor: '#5d8aa6',
        padding: 10,
    },
    activeHeader: {
        backgroundColor: '#5d8aa6',
        padding: 10,
        fontWeight: 'bold',
        textDecorationLine: 'underline line-through'
    },
    activeHeaderText: {
        // backgroundColor: '#F5FCFF',
        // textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    headerText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '500',
      },
    content: {
        padding: 20,
        backgroundColor: '#F5FCFF',
        borderRadius: 35,
        overflow: 'hidden',
    },
    active: {
        backgroundColor: '#F5FCFF',
    },
    inactive: {
        backgroundColor: '#5d8aa6',
    },

});


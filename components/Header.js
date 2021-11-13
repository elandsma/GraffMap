import React from 'react'
import { SafeAreaView, View, Text, Image , StyleSheet, TouchableOpacity} from 'react-native'

const Header = () => {
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Image 
                    style={styles.logo} 
                    source={require('../assets/logo.png')}
                />
            </TouchableOpacity>
            <Text style={{color: 'white', flexDirection: 'row'}}>text</Text>
            <View style={styles.iconsContainer}>
                <TouchableOpacity>
                    <Image
                        source={{
                            uri: 'https://img.icons8.com/fluency/48/ffffff/map-marker.png'
                        }}
                        style={styles.icon}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        source={{
                            uri: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/plus-2-math.png'
                        }}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 20,
        paddingTop: 15,
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

export default Header

import React, {useState, useEffect} from 'react'
import { Modal, Platform, StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, Alert, ImageBackground, ActivityIndicator} from 'react-native'


const UploadingModal = props =>{
    const showUploadingModal = props.showUploadingModal;
    const setShowUploadingModal = props.setShowUploadingModall
    const location = props.location;
    const capturedImage = props.capturedImage;

    return(
        <Modal
        animationType="slide"
        backdropOpacity={0.7}
        visible={showUploadingModal}
        onRequestClose={()=>{
            setShowUploadingModal(false);
        }}    
        >
        <View style={modalStyles.centeredView}>

            <View style={modalStyles.modalView}>
                <Text style={modalStyles.modalText}>hello</Text>
                
                <TouchableOpacity
                    style={[modalStyles.button, modalStyles.buttonClose]}
                    onPress={() => setShowUploadingModal(false)}
                >
                    <Text style={modalStyles.textStyle}>Hide Modal</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
    );
}

export default UploadingModal;


const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
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
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
});
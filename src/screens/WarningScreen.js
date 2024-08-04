import * as React from "react";
import { Image, StyleSheet, View, Text, Dimensions, TouchableOpacity } from "react-native";
import { Color, FontFamily, Border } from "../../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import Background from '../components/Background'
import { getData } from "../helpers/storage";
import firestore from '@react-native-firebase/firestore';
import { stopSound } from "../utils/PushNotifications";
const { width, height } = Dimensions.get("window");
const WarningScreen = () => {
  const navigation = useNavigation();
  const CancelNotification=async()=>{
    let userId = await getData('userId')
    await firestore().collection('users').doc(userId).update({
      notification_token: null
    });
    stopSound()
    navigation.navigate('LoginScreen')
  }
  return (
    <Background>
    <View style={styles.connecedDevice}>
    
      <View style={{flex:1,justifyContent:'center'}}>

      <View style={styles.card}>
        <View style={styles.header}>
          <Image
            source={require("../assets/general-warning-sign1.png")} // Replace with your image source
            style={styles.headerImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.body}>
          <Text style={styles.warningText}>Warning!</Text>
          
          <TouchableOpacity 
            onPress={CancelNotification} 
            style={styles.button}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>

    </View>
    </Background>
  );
};

const styles = StyleSheet.create({

  encephai14Icon: {
    alignSelf: 'flex-end',
    left: 10
  },

  connecedDevice: {
    borderRadius: Border.br_11xl,
    top: 10,
    flex: 1,
    width: width,
    height: height,
    overflow: "hidden",
  },
  card: {
    width: '80%',
    height:'50%',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: 'center',
bottom:50
  },
  header: {
    backgroundColor: Color.colorBrown,
    justifyContent: 'center',
    alignItems: 'center',
    height: '25%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  headerImage: {
    width: 70,
    height: 70,
    alignSelf: 'center',
  },
  body: {
    flex:1,
    alignItems: 'center',
    justifyContent:'center'
  },
  warningText: {
    fontSize: 38,
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    color: Color.colorBrown,
  },
  button: {
    marginTop:30,
    backgroundColor: Color.colorBrown,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius:20
  },
  buttonText: {
    fontSize: 20,
letterSpacing: 0.6,
fontWeight: "700",
fontFamily: FontFamily.interBold,
color: Color.colorWhite,
    textAlign: 'center',
  },

});

export default WarningScreen;

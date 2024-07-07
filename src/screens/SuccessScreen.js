import * as React from "react";
import { Image, StyleSheet, View, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Border, Color } from "../../GlobalStyles";

const SuccessScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.connecedDevice}>
      <Image
        style={styles.checkmarkIcon}
        resizeMode="cover"
        source={require("../assets/checkmark.png")}
      />
      <Pressable
        style={styles.connecedDeviceChild}
        
        onPress={() =>{navigation.navigate('LoginScreen')}}
      />
      <Text style={[styles.successfullyConnected, styles.okTypo]}>
        Successfully Connected !
      </Text>
      <Text style={[styles.ok, styles.okTypo]}>OK</Text>
     
    </View>
  );
};

const styles = StyleSheet.create({
  okTypo: {
    textAlign: "left",
    fontFamily: FontFamily.interSemiBold,
    fontWeight: "600",
    position: "absolute",
  },
  checkmarkIcon: {
    top: 213,
    left: 104,
    borderRadius: 78,
    width: 167,
    height: 167,
    position: "absolute",
  },
  connecedDeviceChild: {
    top: 582,
    left: 26,
    borderRadius: Border.br_2xs,
    backgroundColor: Color.colorBlueviolet,
    width: 324,
    height: 58,
    position: "absolute",
  },
  successfullyConnected: {
    top: 380,
    left: 62,
    fontSize: 25,
    color: Color.colorBlueviolet,
    width: 318,
  },
  ok: {
    top: 601,
    left: 175,
    fontSize: 17,
    color: Color.colorWhite,
  },
  encephai13Icon: {
    top: 19,
    left: 247,
    width: 136,
    height: 91,
    position: "absolute",
  },
  connecedDevice: {
    borderRadius: Border.br_11xl,
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    height: 812,
    overflow: "hidden",
  },
});

export default SuccessScreen;

import * as React from "react";
import { Image, StyleSheet, View, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Border, Color } from "../../GlobalStyles";

const SuccessScreen = () => {
  const navigation = useNavigation();
  React.useEffect(() => {
    setTimeout(() => {
      navigation.navigate('NotificationScreen');
    },2000)
    }, []);
  return (
    <View style={styles.connecedDevice}>
       <Image
        style={styles.checkmarkIcon}
        resizeMode="cover"
        source={require("../assets/checkmark.png")}
      />
      <Text style={[styles.successfullyConnected, styles.okTypo]}>
        Successfully Connected !
      </Text>
      <Pressable
      style={styles.connecedDeviceChild}
      onPress={() => navigation.navigate('NotificationScreen')}
    >
      <Text style={styles.ok}>OK</Text>
    </Pressable>     
    </View>
  );
};

const styles = StyleSheet.create({
  connecedDevice: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    width: "100%",
  },
  checkmarkIcon: {
    top: '-15%'
  },
  successfullyConnected: {
    top:'-13%',
    fontSize: 25,
    color: Color.colorBlueviolet,
  },
  okTypo: {
    fontFamily: FontFamily.interSemiBold,
    fontWeight: "600",
  },
  connecedDeviceChild: {
   top:'25%',
    borderRadius: Border.br_2xs,
    backgroundColor: Color.colorBlueviolet,
    width: '90%',
    height: '8%',
    justifyContent:'center',
    alignItems:'center'
  },
  ok: {
    fontSize: 17,
    color: Color.colorWhite,
  },
  
});

export default SuccessScreen;

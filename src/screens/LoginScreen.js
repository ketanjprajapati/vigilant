import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { codeValidator } from '../helpers/deviceCodeValidator'
import { FontFamily, Border, Color } from "../../GlobalStyles";
import { sendNotification } from '../helpers/sendNotification'
import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
// import DeviceInfo from 'react-native-device-info';
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [device_code, setDeviceCode] = useState({ value: '', error: '' })
  const [loading, setLoading] = useState(false)
  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const deviceCodeError = codeValidator(device_code.value);
    if (emailError || passwordError || deviceCodeError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setDeviceCode({ ...device_code, error: deviceCodeError });
      return;
    }

    try {
      setLoading(true)
      const userQuerySnapshot = await firestore().collection('users').where('user_email', '==', email.value).where('user_password', '==', password.value).get();
      if (userQuerySnapshot.empty) {
        Alert.alert("Error Message:", "Account not exist.!")
        setLoading(false)
        return;
      }
      const userCredential = await auth().signInWithEmailAndPassword(email.value, password.value);
      console.log("userCredential:", userCredential)
      const user = userCredential.user;
      const token = await messaging().getToken();

      const userDoc = await firestore().collection('users').doc(user.uid).get();
      const currentMacAddresses = userDoc.data().mac_address || [];

      // Add the new mac_address only if it doesn't already exist
      if (!currentMacAddresses.includes(device_code.value)) {
        await firestore().collection('users').doc(user.uid).update({
          notification_token: token,
          mac_address: firestore.FieldValue.arrayUnion(device_code.value),
        });
      } else {
        console.log("Mac address already exists, not adding.");
      }

      await AsyncStorage.setItem('fcmToken', token);
      await AsyncStorage.setItem('userId', user.uid);

      // sendNotification(email.value, 'Vigilant', 'Welcome back to vigilant');
      setLoading(false)
      navigation.reset({
        index: 0,
        routes: [{ name: 'SuccessScreen' }],
      });
    } catch (error) {
      setLoading(false)
      console.error('Login failed:', error);
      // Handle error (e.g., show a message to the user)
    }
  };

  return (
    <Background>
      {/* <BackButton goBack={navigation.goBack} /> */}
      <Logo />
      {/* <Header>Welcome back.</Header> */}
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Mac Address"
        returnKeyType="next"
        value={device_code.value}
        onChangeText={(text) => setDeviceCode({ value: text, error: '' })}
        error={!!device_code.error}
        errorText={device_code.error}
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
      />
      {/* <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View> */}
      <Button mode="contained" style={{ backgroundColor: Color.colorBlueviolet }} onPress={!loading ? onLoginPressed : null}>
        {loading ? 'Logging' : "Login"}
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: Color.colorBlueviolet,
    // color: theme.colors.primary,
  },
})

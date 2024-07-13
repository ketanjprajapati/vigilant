import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import { FontFamily, Border, Color } from "../../GlobalStyles";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { sendNotification } from '../helpers/sendNotification'

const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];
export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: 'ketan', error: '' })
  const [email, setEmail] = useState({ value: 'ketanjdbmp33164@gmail.com', error: '' })
  const [password, setPassword] = useState({ value: '123456', error: '' })
  
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      // console.log('Message handled in the background!', remoteMessage);
    });
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      console.log(remoteMessage)
    });
    return unsubscribe;
  }, []);
  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    try {
      // Create user in Firebase Authentication
      const userQuerySnapshot = await firestore().collection('users').where('email', '==', email.value).get();
    //   userQuerySnapshot.forEach(doc => {
    //     const userData = doc.data(); // This contains all fields in the document
    //     const name = userData.name;
    //     const token = userData.fcmToken;
        
    //     // Pass name and token to a function
    //     sendRegistrationSuccessNotification(token,name);
    // });
    // return;
      if (!userQuerySnapshot.empty) {
       Alert.alert("Error Message:","Account already exist.!")
       return;
      }
      const userCredential = await auth().createUserWithEmailAndPassword(email.value, password.value);
      const user = userCredential.user;
      const Token = await messaging().getToken();
      await firestore().collection('users').doc(user.uid).set({
        user_name:name.value,
        user_email:email.value,
        device_token:Token,
        user_password:password.value,
        room_id:123456,
        mobile_no:7096848834
      });
      // sendNotification(email.value, 'Vigilant', 'Welcome to vigilant');
      const url = 'https://39be-103-251-59-120.ngrok-free.app/signup';

      // Configuration for the fetch request
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Add any other headers as needed
        },
        body: JSON.stringify({
          user_name:name.value,
          user_email:email.value,
          device_token:Token,
          user_password:password.value,
          room_id:123456,
          mobile_no:7096848834
        })
      };
      
      // Making the POST request
      fetch(url, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Assuming the server returns JSON
        })
        .then(data => {
          console.log('Success:', data);
          // Handle the response data as needed
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle errors
        });
  
      // Navigate to success screen or perform any additional actions
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'LoginScreen' }],
      // });
    } catch (error) {
      console.error('Error registering user: ', error);
      // Handle error (e.g., display error message)
    }
  };   
  return (
    <Background>
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
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
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24,backgroundColor: Color.colorBlueviolet  }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})

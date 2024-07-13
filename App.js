import React, { useEffect, useRef } from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {getData} from './src/helpers/storage'
import {
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard, WarningScreen, SuccessScreen
} from './src/screens'
const Stack = createStackNavigator()
import { NotificationServices, requestUserPermission } from './src/utils/PushNotifications'

export default function App() {
  const navigationRef = useRef(null);

  useEffect(() => {
    requestUserPermission()
    NotificationServices(navigationRef);
    // if (navigationRef.current) {
    // }
    checkLogin()
  }, [])
  const checkLogin=async()=>{
    if(await getData('fcmToken')){
        navigationRef.current.navigate('SuccessScreen')
      }else{
      navigationRef.current.navigate('LoginScreen')
    }
  }
  
  return (
    <Provider theme={theme}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* <Stack.Screen name="StartScreen" component={StartScreen} /> */}
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Warning" component={WarningScreen} />
          <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

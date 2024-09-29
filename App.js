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
   WarningScreen, SuccessScreen
} from './src/screens'
import { MenuProvider } from 'react-native-popup-menu';
const Stack = createStackNavigator()
import { NotificationServices, requestUserPermission } from './src/utils/PushNotifications'
import NotificationScreen from './src/screens/NotificationScreen'
import ManageDeviceScreen from './src/screens/ManageDeviceScreen'

export default function App() {
  const navigationRef = useRef(null);

  useEffect(() => {
    NotificationServices(navigationRef);
    // if (navigationRef.current) {
    // }
    checkLogin()
  }, [])
  const checkLogin=async()=>{
    if(await getData('userId')){
        navigationRef.current.navigate('SuccessScreen')
      }else{
      navigationRef.current.navigate('LoginScreen')
    }
  }
  
  return (
    <Provider theme={theme}>
      <MenuProvider>
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
          <Stack.Screen name="Warning" component={WarningScreen} />
          <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
          <Stack.Screen name="ManageDeviceScreen" component={ManageDeviceScreen} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </MenuProvider>
    </Provider>
  )
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import Sound from 'react-native-sound';
let soundInstance = null;
const playSound = () => {
  soundInstance= new Sound('ringtone.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load the sound', error);
      return;
    }
    soundInstance.play((success) => {
      if (success) {
        console.log('Successfully played the sound');
      } else {
        console.log('Playback failed due to audio decoding errors');
      }
    });
  });
};

export const stopSound = () => {
  if (soundInstance) {
    soundInstance.stop(() => {
      console.log('Sound stopped');
    });
  }
};

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFCMToken()
  }
}

const getFCMToken =async()=>{
    let fcmToken=await AsyncStorage.getItem('fcmToken')
    console.log("old FCMToken: ",fcmToken)
    if(!fcmToken){
        try {
            fcmToken = await messaging().getToken()
            console.log("New FCMTOKEN: ",fcmToken)
            await AsyncStorage.setItem('fcmToken',fcmToken)
            
        } catch (error) {
            
        }
    }
}

export const NotificationServices=(navigationRef)=>{
    messaging().onNotificationOpenedApp(remoteMessage=>
      {
        console.log("Notification in background: ",remoteMessage)
        if (remoteMessage.data?.screen === 'Warning') {
          navigationRef.current.navigate(remoteMessage.data?.screen);
        } else {
        }
      }
    )
    
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log(' background!', navigationRef.current.navigate('Warning'));
      if (remoteMessage.data?.screen === 'Warning') {
        navigationRef.current.navigate(remoteMessage.data?.screen);
      } else {
      }
      // Handle the background message data here if necessary
    });

    messaging().getInitialNotification().then(remoteMessage=>{
        if(remoteMessage){
            console.log("Notification quite state: ",remoteMessage)
            if (remoteMessage.data?.screen === 'Warning') {
              navigationRef.current.navigate(remoteMessage.data?.screen);
            } else {
            }
        }
    })
    // messaging().onMessage(async remoteMessage => {
    //     console.log('ForeGround: ', remoteMessage);
    //     if (remoteMessage.data?.screen === 'Warning') {
    //       navigationRef.current.navigate(remoteMessage.data?.screen);
    //       playSound();
    //     } else {
    //     }
    //   });
}
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Switch, Platform, PermissionsAndroid } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/FontAwesome';
import Logo from './Logo';
import { Color } from '../../GlobalStyles';
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from '../helpers/storage';
import { requestUserPermission } from '../utils/PushNotifications';
import { useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
const Divider = () => <View style={styles.divider} />;
const Header = () => {
  const navigation = useNavigation();
  const [isNotificationsEnabled, setNotificationsEnabled] = useState(false); // Toggle state
  const isFocused = useIsFocused();
  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message:
              'Vigilant needs access to receive notification ',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('permission granted');
          fcmToken = await messaging().getToken()
          let userId = await getData('userId')
          await firestore().collection('users').doc(userId).update({
            notification_token: fcmToken
          });
          await AsyncStorage.setItem('fcmToken', fcmToken)
        } else {
          console.log('permission denied');
        }
      }

    } catch (err) {
      console.warn(err);
    }
  };
  const checkNotification = async () => {
    const isGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    const userId = await getData('userId')
    const userDoc = await firestore().collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      const fcmToken = userData.notification_token;
      if (isGranted && fcmToken) {
        setNotificationsEnabled(true);
      } else {
        setNotificationsEnabled(false);
      }
    }
  }
  React.useEffect(() => {
    checkNotification()
  }, [isFocused])

  const Logout = () => {
    AsyncStorage.clear();
    navigation.navigate('LoginScreen')
  }
  const toggleNotifications = async () => {
    const userId = await getData('userId')
    const userDoc = await firestore().collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      const fcmToken = userData.notification_token;
      const isGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (fcmToken && isGranted) {
        await AsyncStorage.removeItem('fcmToken');
        let userId = await getData('userId')
        await firestore().collection('users').doc(userId).update({
          notification_token: null
        });
        Alert.alert('Notifications Disabled', 'You will no longer receive notifications.');
      } else {
        await requestNotificationPermission()

        Alert.alert('Notifications Enabled', 'You will receive notifications.');
      }
    }
    checkNotification()
  }

  return (
    <View style={styles.headerContainer}>
      <Logo style={styles.logo} />

      <Menu>
        <MenuTrigger>
          <View style={styles.touchableArea}>
            <Icon name="ellipsis-v" size={24} color="black" style={styles.menuIcon} />
          </View >
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => navigation.navigate('NotificationScreen')}>
            <Text style={styles.menuOptionText}>Notifications</Text>
          </MenuOption>
          <Divider />
          <MenuOption>
            <View style={styles.notificationsToggleContainer}>
              <Text style={styles.menuOptionText}>Toggle Notification</Text>
              <Switch
                value={isNotificationsEnabled}
                onValueChange={toggleNotifications}
              />
            </View>
          </MenuOption>
          <Divider />
          <MenuOption onSelect={() => navigation.navigate('ManageDeviceScreen')}>
            <Text style={styles.menuOptionText}>Manage devices</Text>
          </MenuOption>
          <Divider />
          <MenuOption onSelect={() => Logout()}>
            <Text style={styles.menuOptionText}>Logout</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 20, // Adjust padding as needed
  },
  touchableArea: {
    padding: 10, // Increase this value to increase the touch area
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 0,
  },
  menuIcon: {
    fontSize: 20,
    color: 'black',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#7F8487",
  },
  menuOptionText: {
    fontSize: 16,
    color: 'black', // Ensure text is visible
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: 'black'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: Color.colorBlueviolet,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: '50%'
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: '40%'
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  notificationsToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Header;

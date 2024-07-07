import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to store data
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Failed to save the data to the storage', e);
  }
};

// Function to retrieve data
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? value : null;
  } catch (e) {
    console.error('Failed to fetch the data from storage', e);
  }
};

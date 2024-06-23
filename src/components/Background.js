import React from 'react'
import { ImageBackground, StyleSheet, KeyboardAvoidingView, View } from 'react-native'
import { Color } from '../../GlobalStyles'
import { theme } from '../core/theme'

export default function Background({ children }) {
  return (
    // <ImageBackground
    //   source={require('../assets/background_dot.png')}
    //   resizeMode="repeat"
    //   style={styles.background}
    // >
    <View style={{backgroundColor:Color.colorWhite,width:'100%',height:'100%'}}>

      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </View>
    // </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Card = ({ title, imageUrl, description,mac_address }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.mac_address}>{mac_address}</Text>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9, // 90% of screen width
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    padding: 15,
  },
  image: {
    width: '100%',
    height: 150, // Set a fixed height for the image
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#555',
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  mac_address: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom:10
  },
});

export default Card;

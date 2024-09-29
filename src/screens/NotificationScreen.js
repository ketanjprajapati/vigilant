import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import Card from '../components/Card'
import { StyleSheet,ActivityIndicator, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Header from '../components/Header';
import { getData } from '../helpers/storage';
import { useIsFocused } from '@react-navigation/native';
import { Color } from '../../GlobalStyles';

export default function NotificationScreen({ navigation }) {
    const [cardsData, setCardsData] = useState([]);
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true); 
    useEffect(() => {

        const fetchNotifications = async () => {
            if (isFocused) {
                try {
                    setCardsData([])
                    setLoading(true)
                    const userId = await getData('userId');
                    if (!userId) {
                        Alert.alert('Error', 'User ID not found.');
                        return;
                    }

                    const notificationsSnapshot = await firestore()
                        .collection(`users/${userId}/notifications`)
                        .get();

                    const notifications = notificationsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setCardsData(notifications);
                    setLoading(false)
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                    setLoading(false)
                    Alert.alert('Error', 'Failed to fetch notifications.');
                }
            }
        };

        fetchNotifications();
    }, [isFocused]);

    return (
        <>
            <Header />
            <ScrollView contentContainerStyle={styles.container}>
            {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Color.colorBlueviolet} />
                    </View>
                ) :   cardsData.map((card, index) => (
                    <Card
                        key={index}
                        title={card.title}
                        mac_address={card.mac_address}
                        imageUrl={card.image_url}
                        description={card.body}
                    />
                ))
            }
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
    },
    loadingContainer:{ 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',}
});

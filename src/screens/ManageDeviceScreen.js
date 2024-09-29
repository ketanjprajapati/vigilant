import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, Button, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color } from '../../GlobalStyles';
import TextInput from '../components/TextInput';
import { codeValidator } from '../helpers/deviceCodeValidator';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import { useIsFocused } from '@react-navigation/native';
const ManageDeviceScreen = () => {
    const [macAddresses, setMacAddresses] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newMac, setNewMac] = useState({ value: '', error: '' });
    const [selectedMac, setSelectedMac] = useState(null);
    const [userId, setUserId] = useState('');
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUserId = async () => {
            if (isFocused) {
                setMacAddresses([])
                setLoading(true)
                const uid = await AsyncStorage.getItem('userId');
                setUserId(uid);
                fetchMacAddresses(uid);
            }
        };

        fetchUserId();
    }, [isFocused]);

    const fetchMacAddresses = async (uid) => {
        const userDoc = await firestore().collection('users').doc(uid).get();
        if (userDoc.exists) {
            setMacAddresses(userDoc.data().mac_address || []);
            setLoading(false)
        }
    };

    const addMacAddress = async () => {
        const updatedMacAddresses = [...macAddresses, newMac.value];
        const deviceCodeError = codeValidator(newMac.value);
        if (deviceCodeError) {
            setNewMac({ ...newMac, error: deviceCodeError });
            return;
        }
        await firestore().collection('users').doc(userId).update({
            mac_address: updatedMacAddresses,
        });
        setMacAddresses(updatedMacAddresses);
        setNewMac({ value: '', error: '' });
        setModalVisible(false);
    };

    const editMacAddress = async () => {
        const deviceCodeError = codeValidator(newMac.value);
        if (deviceCodeError) {
            setNewMac({ ...newMac, error: deviceCodeError });
            return;
        }
        const updatedMacAddresses = macAddresses.map((mac) =>
            mac === selectedMac ? newMac.value : mac
        );
        await firestore().collection('users').doc(userId).update({
            mac_address: updatedMacAddresses,
        });
        setMacAddresses(updatedMacAddresses);
        setNewMac({ value: '', error: '' });
        setSelectedMac(null);
        setModalVisible(false);
    };

    const deleteMacAddress = async (macToDelete) => {
        const updatedMacAddresses = macAddresses.filter(mac => mac !== macToDelete);
        await firestore().collection('users').doc(userId).update({
            mac_address: updatedMacAddresses,
        });
        setMacAddresses(updatedMacAddresses);
    };

    const openModalForEdit = (mac) => {
        setSelectedMac(mac);
        setNewMac({ value: mac, error: '' });
        setModalVisible(true);
    };

    return (<>
        <Header />
        {loading ? ( 
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Color.colorBlueviolet} />
            </View>
        ) : (
            <View style={styles.container}>
                <FlatList
                    data={macAddresses}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No Device codes Found</Text>
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <Text style={styles.modalTitle}>{item.length > 20 ? item.substring(0, 20) + '...' : item}</Text>
                            <View style={[styles.buttonContainer]}>
                                <TouchableOpacity onPress={() => openModalForEdit(item)}>
                                    <Icon name="edit" size={24} color="blue" style={styles.icon} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteMacAddress(item)}>
                                    <Icon name="trash" size={24} color="red" style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
                <Button title="Add MAC Address" onPress={() => setModalVisible(true)} />

                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Device Code</Text>

                            <TextInput
                                placeholder="Enter Device Code"
                                value={newMac.value}
                                keyboardType="default"
                                onChangeText={(text) => setNewMac({ value: text, error: '' })}
                                error={!!newMac.error}
                                errorText={newMac.error}
                                autoCapitalize="none"
                                textContentType="emailAddress"
                            />
                            <View style={styles.buttonContainer}>

                                <TouchableOpacity style={styles.submitButton} title={selectedMac ? "Update MAC Address" : "Add MAC Address"}
                                    onPress={selectedMac ? editMacAddress : addMacAddress}>
                                    <Text style={styles.submitButtonText}>{selectedMac?"Update":"Add"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => { setModalVisible(false); setNewMac({ value: '', error: '' }) }}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>)}
    </>

    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: 'gray',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    editButton: {
        color: 'blue',
        marginLeft: 10,
    },
    deleteButton: {
        color: 'red',
        marginLeft: 10,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    icon: {
        marginHorizontal: 10, // Space between icons
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ManageDeviceScreen;

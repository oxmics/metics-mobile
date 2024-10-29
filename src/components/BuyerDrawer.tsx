import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Drawer, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CustomNavigationProp, RootStackParamList } from '../types/common';
import EncryptedStorage from 'react-native-encrypted-storage';

const BuyerDrawer = ({ closeDrawer }: { closeDrawer: () => void }) => {
    const navigation = useNavigation<CustomNavigationProp>();

    const handleNavigation = (screen: string) => {
        navigation.navigate(screen as never);
        closeDrawer();
    };

    const handleLogout = async (screen: keyof RootStackParamList) => {
        navigation.replace(screen);
        await EncryptedStorage.removeItem('jwt-token');
          await EncryptedStorage.removeItem('user_id');
          await EncryptedStorage.removeItem('email');
        closeDrawer();
    };

    return (
        <View style={styles.drawerContainer}>
            <View style={styles.header}>
                <Image style={styles.image} source={require('../../assets/images/Metics-blue.png')}/>
            </View>
            <Drawer.Section style={styles.drawerSection} showDivider={false}>
                <TouchableOpacity onPress={() => handleNavigation('BuyerDashboard')}>
                    <View style={styles.itemRow}>
                        <Image source={require('../../assets/images/home.png')} resizeMode='contain'/>
                        <Text>Dashboard</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigation('BuyerRfqHistory')}>
                    <View style={styles.itemRow}>
                        <Image source={require('../../assets/images/rfq-w.png')} resizeMode='contain'/>
                        <Text>RFQ</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigation('BuyerPurchaseOrder')}>
                    <View style={styles.itemRow}>
                        <Image source={require('../../assets/images/orders-w.png')} resizeMode='contain'/>
                        <Text>Purchase Orders</Text>
                    </View>
                </TouchableOpacity>
            </Drawer.Section>

            <Drawer.Section showDivider={false} style={styles.logoutSection}>
                <TouchableOpacity onPress={() => handleNavigation('EnterNewPassword')}>
                    <View style={styles.itemRow}>
                        <Image source={require('../../assets/images/settings.png')} resizeMode='contain'/>
                        <Text>Settings</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLogout('Login')}>
                    <View style={styles.itemRow}>
                        <Image source={require('../../assets/images/logout.png')} resizeMode='contain'/>
                        <Text style={{color: '#FF0000'}}>Logout</Text>
                    </View>
                </TouchableOpacity>
            </Drawer.Section>
        </View>
    );
};

const styles = StyleSheet.create({
    drawerContainer: {
        position: 'relative',
        flex: 1,
        paddingTop: 45,
        backgroundColor: '#ffffff',
    },
    header: {
        paddingLeft: 28,
        paddingBottom: 40
    },
    itemRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 24,
        paddingHorizontal: 28,
        paddingVertical: 14
    },
    drawerSection: {
        flex: 1,
    },
    logoutSection: {
        marginBottom: 20,
    },
    image: {
        height: 42,
        width: 134
    }
});

export default BuyerDrawer;
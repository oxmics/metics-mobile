import React, { useContext } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Switch } from 'react-native';
import { Drawer, Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { CustomNavigationProp, RootStackParamList } from '../types/common';
import EncryptedStorage from 'react-native-encrypted-storage';
import { ThemeContext } from '../themes/ThemeContext';

const CustomDrawer = ({ closeDrawer }: { closeDrawer: () => void }) => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { isDark, theme, toggleTheme } = useContext(ThemeContext);

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

    const styles = getStyles(theme);

    return (
        <View style={styles.drawerContainer}>
            <View style={styles.header}>
                <Image style={styles.image} source={require('../../assets/images/Metics-blue.png')}/>
            </View>
            <Drawer.Section style={styles.drawerSection} showDivider={false}>
                <TouchableOpacity onPress={() => handleNavigation('SupplierDashboard')}>
                    <View style={styles.itemRow}>
                        <MaterialCommunityIcons name="home-outline" size={24} color={theme.colors.text} />
                        <Text style={styles.drawerText}>Dashboard</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigation('SupplierRequestHistory')}>
                    <View style={styles.itemRow}>
                        <MaterialCommunityIcons name="file-document-outline" size={24} color={theme.colors.text} />
                        <Text style={styles.drawerText}>Requests</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigation('SupplierPurchaseOrder')}>
                    <View style={styles.itemRow}>
                        <MaterialCommunityIcons name="briefcase-outline" size={24} color={theme.colors.text} />
                        <Text style={styles.drawerText}>Purchase Orders</Text>
                    </View>
                </TouchableOpacity>
            </Drawer.Section>

            <Drawer.Section showDivider={false} style={styles.logoutSection}>
                <View style={styles.itemRow}>
                    <Text style={styles.drawerText}>Dark Mode</Text>
                    <Switch value={isDark} onValueChange={toggleTheme} />
                </View>
                <TouchableOpacity onPress={() => handleNavigation('EnterNewPassword')}>
                    <View style={styles.itemRow}>
                        <MaterialCommunityIcons name="cog-outline" size={24} color={theme.colors.text} />
                        <Text style={styles.drawerText}>Settings</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLogout('Login')}>
                    <View style={styles.itemRow}>
                        <MaterialCommunityIcons name="logout" size={24} color={'#FF0000'} />
                        <Text style={{color: '#FF0000'}}>Logout</Text>
                    </View>
                </TouchableOpacity>
            </Drawer.Section>
        </View>
    );
};

const getStyles = (theme) => StyleSheet.create({
    drawerContainer: {
        position: 'relative',
        flex: 1,
        paddingTop: 45,
        backgroundColor: theme.colors.background,
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
    },
    drawerText: {
        color: theme.colors.text
    }
});

export default CustomDrawer;
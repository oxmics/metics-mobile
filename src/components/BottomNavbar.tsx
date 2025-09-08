import { useNavigation } from "@react-navigation/native"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { CustomNavigationProp } from "../types/common";
import { useContext } from "react";
import { ThemeContext } from "../themes/ThemeContext";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface props {
    isSupplier?: boolean
}

export const BottomNavbar = ({isSupplier}:props) => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return(
        <View style={styles.holder}>
            <View style={styles.container}>
                <TouchableOpacity onPress={()=> isSupplier ? navigation.replace('SupplierDashboard'): navigation.replace('BuyerDashboard')}>
                    <MaterialCommunityIcons name="home-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> isSupplier ? navigation.navigate('SupplierRequestHistory'): navigation.navigate('BuyerRfqHistory')}>
                    <MaterialCommunityIcons name="file-document-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> isSupplier ? navigation.navigate('SupplierPurchaseOrder'): navigation.navigate('BuyerPurchaseOrder')}>
                    <MaterialCommunityIcons name="briefcase-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> navigation.navigate('EnterNewPassword')}>
                    <MaterialCommunityIcons name="cog-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const getStyles = (theme) => StyleSheet.create({
    holder: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: '90%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 40,
        borderRadius: 16,
        backgroundColor: theme.colors.surface,
        padding: 28,
        // Shadow for iOS
        shadowColor: '#000000',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 28.4 / 2,
        // Shadow for Android
        elevation: 10,
        position: 'absolute',
        bottom: 16,
    },
})
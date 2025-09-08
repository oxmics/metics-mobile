import { useNavigation } from "@react-navigation/native"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { CustomNavigationProp } from "../types/common";
import { useContext } from "react";
import { ThemeContext } from "../themes/ThemeContext";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface props {
    isBuyer?: boolean
}
export const RFQQuickActionCard = ({isBuyer}: props) => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return(
        <TouchableOpacity onPress={() => isBuyer ? navigation.navigate('BuyerRfqHistory'): navigation.navigate('SupplierRequestHistory')}>
            <View style={styles.container}>
                <MaterialCommunityIcons name="file-document-outline" size={24} color={theme.colors.text} />
                <Text style={styles.title}>View Request</Text>
            </View>
        </TouchableOpacity>
    )
}

export const OrdersQuickActionCard = ({isBuyer}: props) => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return(
        <TouchableOpacity onPress={() => isBuyer ? navigation.navigate('BuyerPurchaseOrder'): navigation.navigate('SupplierPurchaseOrder')}>
            <View style={styles.container}>
                <MaterialCommunityIcons name="briefcase-outline" size={24} color={theme.colors.text} />
                <Text style={styles.title}>View Purchase Orders</Text>
            </View>
        </TouchableOpacity>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.placeholder,
        borderRadius: 10,
        backgroundColor: theme.colors.surface,
        height: 56,
        marginRight: 8  
    },
    title: {
        color: theme.colors.text,
        fontSize: 13,
        fontWeight: "400",
        flexWrap: 'wrap',
        marginLeft: 12
    }
})
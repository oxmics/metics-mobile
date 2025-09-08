import { useNavigation } from "@react-navigation/native"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { CustomNavigationProp } from "../types/common";
import { useContext } from "react";
import { ThemeContext } from "../themes/ThemeContext";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from "@react-native-community/blur";

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
                <BlurView
                    style={styles.blurView}
                    blurType={theme.dark ? "dark" : "light"}
                    blurAmount={10}
                    reducedTransparencyFallbackColor={theme.colors.surface}
                >
                    <MaterialCommunityIcons name="file-document-outline" size={24} color={theme.colors.text} />
                    <Text style={styles.title}>View Request</Text>
                </BlurView>
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
                <BlurView
                    style={styles.blurView}
                    blurType={theme.dark ? "dark" : "light"}
                    blurAmount={10}
                    reducedTransparencyFallbackColor={theme.colors.surface}
                >
                    <MaterialCommunityIcons name="briefcase-outline" size={24} color={theme.colors.text} />
                    <Text style={styles.title}>View Purchase Orders</Text>
                </BlurView>
            </View>
        </TouchableOpacity>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        borderRadius: 10,
        height: 56,
        marginRight: 8,
        overflow: 'hidden',
    },
    blurView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
        height: '100%',
    },
    title: {
        color: theme.colors.text,
        fontSize: 13,
        fontWeight: "400",
        flexWrap: 'wrap',
        marginLeft: 12
    }
})
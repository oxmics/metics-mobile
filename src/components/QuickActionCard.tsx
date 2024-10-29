import { useNavigation } from "@react-navigation/native"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { CustomNavigationProp } from "../types/common";

interface props {
    isBuyer?: boolean
}
export const RFQQuickActionCard = ({isBuyer}: props) => {
    const navigation = useNavigation<CustomNavigationProp>();
    return(
        <TouchableOpacity onPress={() => isBuyer ? navigation.navigate('BuyerRfqHistory'): navigation.navigate('SupplierRequestHistory')}>
            <View style={styles.container}>
                <Image source={require("../../assets/images/rfq.png")} resizeMode="contain" style={styles.image}/>
                <Text style={styles.title}>View Request</Text>
            </View>
        </TouchableOpacity>
    )
}

export const OrdersQuickActionCard = ({isBuyer}: props) => {
    const navigation = useNavigation<CustomNavigationProp>();
    return(
        <TouchableOpacity onPress={() => isBuyer ? navigation.navigate('BuyerPurchaseOrder'): navigation.navigate('SupplierPurchaseOrder')}>
            <View style={styles.container}>
                <Image source={require("../../assets/images/orders.png")} resizeMode="contain" style={styles.image}/>
                <Text style={styles.title}>View Purchase Orders</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#00000033',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        height: 56,
        marginRight: 8  
    },
    title: {
        color: '#000000CC',
        fontSize: 13,
        fontWeight: "400",
        flexWrap: 'wrap',
        marginLeft: 12
    },
    image: {
        height: 20,
        width: 20
    }
})
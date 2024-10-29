import { useNavigation } from "@react-navigation/native"
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { CustomNavigationProp } from "../types/common";
interface props {
    isSupplier?: boolean
}

export const BottomNavbar = ({isSupplier}:props) => {
    const navigation = useNavigation<CustomNavigationProp>();

    return(
        <View style={styles.holder}>
            <View style={styles.container}>
                <TouchableOpacity onPress={()=> isSupplier ? navigation.replace('SupplierDashboard'): navigation.replace('BuyerDashboard')}>
                    <Image source={require('../../assets/images/home.png')} resizeMode="contain" style={styles.image}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> isSupplier ? navigation.navigate('SupplierRequestHistory'): navigation.navigate('BuyerRfqHistory')}>
                    <Image source={require('../../assets/images/rfq-w.png')} resizeMode="contain" style={styles.image}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> isSupplier ? navigation.navigate('SupplierPurchaseOrder'): navigation.navigate('BuyerPurchaseOrder')}>
                    <Image source={require('../../assets/images/orders-w.png')} resizeMode="contain" style={styles.image}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> navigation.navigate('EnterNewPassword')}>
                    <Image source={require('../../assets/images/settings.png')} resizeMode="contain" style={styles.image}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        backgroundColor: '#FFFFFF',
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
    image: {
        height: 20,
        width: 20
    }
})
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View } from "react-native";
import EncryptedStorage from 'react-native-encrypted-storage';
import { CustomNavigationProp } from "../types/common";
import { ThemeContext } from "../themes/ThemeContext";
import LottieView from 'lottie-react-native';

const SplashScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { theme } = useContext(ThemeContext);

    const [bypassLogin, setBypassLogin] = useState<boolean>(false);
    const [userType, setUserType] = useState<string | null>(null);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const token = await EncryptedStorage.getItem('jwt-token');
        const type = await EncryptedStorage.getItem('user_type');
        if (token && type) {
            setBypassLogin(true);
            setUserType(type);
        }
    };

    const onAnimationFinish = () => {
        if (bypassLogin) {
            if (userType === 'buyer') {
                navigation.replace('BuyerMain');
            } else {
                navigation.replace('SupplierMain');
            }
        } else {
            navigation.replace('Login');
        }
    };

    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <LottieView
                source={require('../../assets/lottie/loading_animation.json')}
                autoPlay
                loop={false}
                onAnimationFinish={onAnimationFinish}
                style={styles.lottie}
            />
        </View>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: 200,
        height: 200,
    },
});

export default SplashScreen;

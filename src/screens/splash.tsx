import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import { Image, StyleSheet, View, Animated, Dimensions } from "react-native";
import EncryptedStorage from 'react-native-encrypted-storage';
import { CustomNavigationProp } from "../types/common";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SplashScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();

    const [bypassLogin, setBypassLogin] = useState<boolean>(false);
    const [animationEnded, setAnimationEnded] = useState<boolean>(false);
    const topValue = useRef(new Animated.Value((screenHeight / 2) - 47.5)).current; // Half of initial height (71 / 2)
    const leftValue = useRef(new Animated.Value((screenWidth / 2) - 107)).current; // Half of initial width (145 / 2)
    const widthValue = useRef(new Animated.Value(214)).current;
    const heightValue = useRef(new Animated.Value(95)).current;

    useEffect(() => {
        getToken();
        setTimeout(() => {
            startAnimation();
        }, 2000);
    }, []);

    const getToken = async () => {
        const token = await EncryptedStorage.getItem('jwt-token');
        if (token) {
            setBypassLogin(true);
        }
    };

    const startAnimation = () => {
        Animated.parallel([
            Animated.timing(topValue, {
                toValue: 20,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.timing(leftValue, {
                toValue: 20,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.timing(widthValue, {
                toValue: 145,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.timing(heightValue, {
                toValue: 71,
                duration: 500,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setAnimationEnded(true);
        });
    };

    useEffect(()=>{
        if(animationEnded){
            if(bypassLogin){
                navigation.replace('BuyerRfqHistory')
            }else{
                navigation.replace('Login')
            }
        } 
    }, [animationEnded, bypassLogin])

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../../assets/images/Metics-blue.png')}
                style={[
                    styles.image,
                    {
                        top: topValue,
                        left: leftValue,
                        width: widthValue,
                        height: heightValue,
                    },
                ]}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    image: {
        position: 'absolute',
    },
});

export default SplashScreen;

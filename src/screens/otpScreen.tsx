import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from 'react';
import GradientButton from "../components/GradientButton";
import { useNavigation } from "@react-navigation/native";
import { CustomNavigationProp } from "../types/common";
import { CustomInput } from "../components/CustomInput";

const OtpScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();

    const [otp, setOtp] = useState<string>('');

    const handleVerifyOtp = () => {
        navigation.navigate('EnterNewPassword');
    }

    return(
        <ScrollView style={styles.container} automaticallyAdjustKeyboardInsets={true}>
            <View style={styles.header}>
                <Image
                    source={require('../../assets/images/Metics-blue.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.otpTitle}>Enter OTP</Text>
            </View>
            <Text style={styles.inputLabelText}>Enter OTP sent to your email</Text>
            <CustomInput
                style={styles.inputFields}
                value={otp}
                onChange={setOtp}
                placeholder="OTP"
                keyboardType="decimal-pad"
            />
            <View style={styles.resendOtpContainer}>
                <TouchableOpacity disabled={false} onPress={() => Alert.alert("Goto login screen")}>
                    <Text style={styles.resendOtpText}>Resend OTP</Text>
                </TouchableOpacity>
                <Text style={styles.rememberPasswordText}></Text>
            </View>
            <GradientButton
                colors={["#00B976", "#00B976"]}
                label="Next"
                onPress={handleVerifyOtp}
                disabled={otp.length == 0}
            />
            <View style={styles.rememberPassContainer}>
                <Text style={styles.rememberPasswordText}>Remeber Your Password?</Text>
                <TouchableOpacity onPress={() => Alert.alert("Goto login screen")}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

export default OtpScreen;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        padding: 20,
        backgroundColor: '#FFFFFF',
        height: "100%",
        width: "100%",
        position: 'absolute',
    },
    header: {
        position: 'relative',
        top: 0,
        left: 0,
    },
    titleContainer: {
        width: "100%",
        display:"flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        rowGap: 20,
        marginTop: 80
    },
    image: {
        height: 71,
        width: 145,
    },
    titleImage: {
        height: 50,
        width: 50,
        marginTop: 40
    },
    otpTitle: {
        color:'#000',
        fontSize: 22,
        fontWeight: '600'
    },
    inputLabelText: {
        color:"#000",
        fontSize: 14,
        fontWeight: "400",
        marginTop: 40
    },
    loginText: {
        color: "#1000C2",
        fontWeight: '400',
        fontSize: 14,
    },
    inputFields: {
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "white",
        marginTop: 16,
    },
    rememberPassContainer: {
        display: 'flex',
        flexDirection:'row',
        gap:2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    rememberPasswordText:{
        color: '#000'
    },
    resendOtpContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap:2,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 6
    },
    resendOtpText: {
        color: "#000",
        fontWeight: '400',
        fontSize: 14,
    },
});
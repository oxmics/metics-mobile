import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from 'react';
import GradientButton from "../components/GradientButton";
import CaptchaCheckbox from "../components/CaptchaCheckbox";
import { useNavigation } from "@react-navigation/native";
import { CustomNavigationProp } from "../types/common";
import { CustomInput } from "../components/CustomInput";
import useResetPasswordOtp from "../api/auth/useResetPasswordOtp";
import { ResetPasswordOtpResponseEnum } from "../types/auth";
import { Snackbar } from "react-native-paper";
import { isValidEmail } from "../utils/helper";

const ForgotPasswordScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();

    const [email, setEmail] = useState<string>('');
    const [isRobot, setIsRobot] = useState<boolean>(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarColor, setSnackbarColor] = useState('green');

    const {mutateAsync: sendOtp, isPending: loading} = useResetPasswordOtp();

    const handleResetPassword = async() => {
        const result = await sendOtp({email});
        let message = '';

        switch (result) {
            case ResetPasswordOtpResponseEnum.FAILED:
                message = "Sending OTP failed!"
                break;
            case ResetPasswordOtpResponseEnum.INVALID:
                message = "Email id not found!"
            default:
                message = 'OTP send'
                break;
        }

        setSnackbarMessage(message);
        setSnackbarVisible(true);
        if( result === ResetPasswordOtpResponseEnum.SUCCESS){
            navigation.navigate('Otp', {email: email});
        }
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
                <Image
                    source={require('../../assets/images/key_circle.png')}
                    style={styles.titleImage}
                    resizeMode="contain"
                />
                <Text style={styles.resetPasswordTitle}>Reset Your Password</Text>
            </View>
            <Text style={styles.inputLabelText}>Enter Your Email</Text>
            <CustomInput
                style={styles.inputFields}
                value={email}
                onChange={setEmail}
                placeholder="Email"
                autoCaptalize="none"
            />
            <CaptchaCheckbox isRobot={isRobot} setIsRobot={setIsRobot}/>
            <GradientButton
                colors={["#00B976", "#00B976"]}
                label="Next"
                onPress={handleResetPassword}
                disabled={!isValidEmail(email) || !isRobot}
            />
            <View style={styles.rememberPassContainer}>
                <Text style={styles.rememberPasswordText}>Remeber Your Password?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
            </View>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={Snackbar.DURATION_SHORT}
                theme={{colors: {primary: snackbarColor}}}                                                 
            >
                {snackbarMessage}
            </Snackbar>
        </ScrollView>
    );
}

export default ForgotPasswordScreen;

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
        rowGap: 20
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
    resetPasswordTitle: {
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
    }
});
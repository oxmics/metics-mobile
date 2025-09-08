import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState, useContext } from 'react';
import GradientButton from "../components/GradientButton";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { APIResponseEnum, CustomNavigationProp } from "../types/common";
import { CustomInput } from "../components/CustomInput";
import useVerifyOtp from "../api/auth/useVerifyOtp";
import useResetPasswordOtp from "../api/auth/useResetPasswordOtp";
import { Snackbar, TextInput, useTheme } from "react-native-paper";
import { ThemeContext } from "../themes/ThemeContext";

type RootStackParamList = {
    OtpScreen: {
      email: string;
      userId: string;
    };
  };

const OtpScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'OtpScreen'>>();
    const {email, userId} = route.params;

    const navigation = useNavigation<CustomNavigationProp>();
    const { theme } = useContext(ThemeContext);

    const [otp, setOtp] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [hidePass, setHidePass] = useState(true);
    const [hideConfirmPass, setHideConfirmPass] = useState(true);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarColor, setSnackbarColor] = useState('green');

    const [countdown, setCountdown] = useState<number>(0);
    const [isResendDisabled, setIsResendDisabled] = useState(false);

    const {mutateAsync: verifyOtp, isPending: verifyOtpLoading} = useVerifyOtp();
    const {mutateAsync: sendOtp, isPending: sendOtpLoading} = useResetPasswordOtp();

    const handleResendOtp = async() => {
        const result = await sendOtp({email});
        let message = '';

        switch (result.status) {
            case APIResponseEnum.FAILED:
                message = "Sending OTP failed!";
                break;
            case APIResponseEnum.INVALID:
                message = "Email id not found!";
            default:
                message = 'OTP send';
                break;
        }

        setSnackbarMessage(message);
        setSnackbarVisible(true);
        setIsResendDisabled(true);
        setCountdown(60);
    }

    const handleVerifyOtp = async() => {
        const result = await verifyOtp({otp: otp, userId: userId, new_password: confirmPassword});
        let message = "";

        switch (result.status) {
            case APIResponseEnum.SUCCESS:
                message = "OTP Verified!";
                break;
            case APIResponseEnum.INVALID:
                message = "Invalid OTP!";
                break;
            case APIResponseEnum.FAILED:
                message = "Unexpected error occured! try again later"
                break;
        }
        setSnackbarMessage(message);
        setSnackbarVisible(true);
        if( result.status === APIResponseEnum.SUCCESS){
            navigation.navigate('Login');
        }
    }

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsResendDisabled(false);
        }

        return () => clearInterval(timer);
    }, [countdown]);

    const styles = getStyles(theme);

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
                <TouchableOpacity disabled={isResendDisabled} onPress={handleResendOtp}>
                    <Text style={styles.resendOtpText}>Resend OTP {isResendDisabled && ` (${countdown}s)`}</Text>
                </TouchableOpacity>
                <Text style={styles.rememberPasswordText}></Text>
            </View>
            <CustomInput
                style={styles.inputFields}
                value={password}
                onChange={setPassword}
                placeholder="Password"
                secureTextEntry={hidePass ? true : false}
                suffix={<TextInput.Icon icon={hidePass ? "eye" : "eye-off"} onPressIn={()=> setHidePass(!hidePass)}/>}
            />
            <CustomInput
                style={styles.inputFields2}
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirm Password"
                secureTextEntry={hideConfirmPass ? true : false}
                suffix={<TextInput.Icon icon={hideConfirmPass ? "eye" : "eye-off"} onPressIn={()=> setHideConfirmPass(!hideConfirmPass)}/>}
            />
            <GradientButton
                colors={["#00B976", "#00B976"]}
                label="Next"
                onPress={handleVerifyOtp}
                disabled={otp.length == 0 || confirmPassword !== password || password.length == 0 || confirmPassword.length == 0}
                loading={verifyOtpLoading}
            />
            <View style={styles.rememberPassContainer}>
                <Text style={styles.rememberPasswordText}>Remeber Your Password?</Text>
                <TouchableOpacity onPress={() => navigation.replace('Login')}>
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

export default OtpScreen;

const getStyles = (theme) => StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        padding: 20,
        backgroundColor: theme.colors.background,
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
        color: theme.colors.text,
        fontSize: 22,
        fontWeight: '600'
    },
    inputLabelText: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: "400",
        marginTop: 40
    },
    loginText: {
        color: theme.colors.primary,
        fontWeight: '400',
        fontSize: 14,
    },
    inputFields: {
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: theme.colors.surface,
        marginTop: 16,
        borderColor: theme.colors.placeholder,
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
        color: theme.colors.text
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
        color: theme.colors.text,
        fontWeight: '400',
        fontSize: 14,
    },
    inputFields2: {
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: theme.colors.surface,
        marginTop: 16,
        marginBottom: 40,
        borderColor: theme.colors.placeholder,
    },
});
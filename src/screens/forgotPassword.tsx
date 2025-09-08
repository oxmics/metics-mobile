import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useState, useContext } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientButton from "../components/GradientButton";
import CaptchaCheckbox from "../components/CaptchaCheckbox";
import { useNavigation } from "@react-navigation/native";
import { APIResponseEnum, CustomNavigationProp } from "../types/common";
import { CustomInput } from "../components/CustomInput";
import useResetPasswordOtp from "../api/auth/useResetPasswordOtp";
import { Snackbar, useTheme } from "react-native-paper";
import { isValidEmail } from "../utils/helper";
import { ThemeContext } from "../themes/ThemeContext";

const ForgotPasswordScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { theme } = useContext(ThemeContext);

    const [email, setEmail] = useState<string>('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarColor, setSnackbarColor] = useState('green');

    const {mutateAsync: sendOtp, isPending: loading} = useResetPasswordOtp();

    const handleResetPassword = async() => {
        const result = await sendOtp({email});
        let message = '';
        let userId = '';
        switch (result.status) {
            case APIResponseEnum.FAILED:
                message = "Sending OTP failed!";
                break;
            case APIResponseEnum.INVALID:
                message = "Email id not found!";
            default:
                message = 'OTP send';
                userId = result.user_id;
                break;
        }

        setSnackbarMessage(message);
        setSnackbarVisible(true);
        if( result.status === APIResponseEnum.SUCCESS){
            navigation.navigate('Otp', {email: email, userId: userId});
        }
    }

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
                <MaterialCommunityIcons name="key-outline" size={50} color={theme.colors.primary} />
                <Text style={styles.resetPasswordTitle}>Reset Your Password</Text>
            </View>
            <Text style={styles.inputLabelText}>Enter Your Email</Text>
            <CustomInput
                style={styles.inputField}
                value={email}
                onChange={setEmail}
                placeholder="Email"
                autoCaptalize="none"
            />
            <GradientButton
                label="Next"
                onPress={handleResetPassword}
                disabled={!isValidEmail(email) || loading}
                loading={loading}
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
        rowGap: 20
    },
    image: {
        height: 71,
        width: 145,
    },
    resetPasswordTitle: {
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
    inputField: {
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.placeholder,
        paddingHorizontal: 0,
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
        color: theme.colors.text
    }
});
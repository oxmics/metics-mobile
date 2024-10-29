import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ToggleButton from "../components/ToggleButton";
import React, { useState } from 'react';
import GradientButton from "../components/GradientButton";
import { Snackbar, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { CustomNavigationProp } from "../types/common";
import { CustomInput } from "../components/CustomInput";
import useLogin from "../api/auth/useLogin";
import { LoginResponseEnum } from "../types/auth";
import { isValidEmail } from "../utils/helper";

const LoginScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [active, setActive] = useState<string>('supplier');
    const [hidePass, setHidePass] = useState(true);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarColor, setSnackbarColor] = useState('green');

    const {mutateAsync: login, isPending: loading} = useLogin();

    const handleLogin = async () => {
        const loginResult = await login({email, password});
        let message = '';
        switch (loginResult) {
            case LoginResponseEnum.SUCCESS:
                message = 'Login successful!';
                break;
            case LoginResponseEnum.INVALID:
                message = 'Invalid email or password!';
                break;
            case LoginResponseEnum.FAILED:
                message = 'Login failed'
                break;
            default:
                message = 'unexpected error occured!';
                break;
        }
        setSnackbarMessage(message);
        setSnackbarVisible(true);
        if (loginResult === LoginResponseEnum.SUCCESS){
            if (active === "buyer"){
                navigation.replace('BuyerDashboard');
            }else{
                navigation.replace('SupplierDashboard');
            }
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
            <Text style={styles.welcomeText}>Welcome to Metics</Text>
            <Text style={styles.loginAsText}>Login as</Text>
            <ToggleButton active={active} setActive={setActive}/>
            <CustomInput
                style={styles.inputFields}
                value={email}
                onChange={setEmail}
                placeholder="Email"
                autoCaptalize="none"
            />
            <CustomInput
                style={styles.inputFields}
                value={password}
                onChange={setPassword}
                placeholder="Password"
                secureTextEntry={hidePass ? true : false}
                suffix={<TextInput.Icon icon={hidePass ? "eye" : "eye-off"} onPressIn={()=> setHidePass(!hidePass)}/>}
            />
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <GradientButton label="Submit" onPress={handleLogin} colors={['#021F66', '#205FA2']} disabled={(!isValidEmail(email) || password.length < 1 || loading)} loading={loading}/>
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

export default LoginScreen;

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
    image: {
        height: 71,
        width: 145,
    },
    welcomeText: {
        color:'#000000',
        fontSize: 24,
        fontWeight: '700',
        marginTop: 80
    },
    loginAsText: {
        color:'#000000',
        fontSize: 16,
        fontWeight: '400',
        marginTop: 20,
        marginBottom: 16
    },
    forgotPasswordText: {
        color: "#1000C2",
        fontWeight: '400',
        fontSize: 14,
        marginTop: 16
    },
    inputFields: {
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "white",
        marginTop: 16
    }
});
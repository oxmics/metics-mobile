import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useContext } from 'react';
import GradientButton from "../components/GradientButton";
import { Icon, TextInput, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { CustomNavigationProp } from "../types/common";
import { CustomInput } from "../components/CustomInput";
import useChangePassword from "../api/auth/useChangePassword";
import { ThemeContext } from "../themes/ThemeContext";

const EnterNewPasswordScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { theme } = useContext(ThemeContext);

    const {mutateAsync: changePassword, isPending} = useChangePassword();

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [hidePass, setHidePass] = useState(true);
    const [hideConfirmPass, setHideConfirmPass] = useState(true);

    const handleLogin = () => {
        changePassword({new_password: confirmNewPassword, old_password: password}).then((res) =>{
            navigation.navigate('Login');
        })
    }

    const styles = getStyles(theme);

    return(
        <ScrollView style={styles.container} automaticallyAdjustKeyboardInsets={true}>
           <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon size={20} source={"arrow-left"} color={theme.colors.text}/>
                    </TouchableOpacity>
                    <Text style={styles.title}>Settings</Text>
                </View>
            <View style={styles.titleContainer}>
                <Text style={styles.otpTitle}>Enter New Password</Text>
            </View>
            <Text style={styles.inputLabelText}>Please enter your new password</Text>
            <CustomInput
                style={styles.inputField}
                value={password}
                onChange={setPassword}
                placeholder="Old Password"
                secureTextEntry={hidePass ? true : false}
                suffix={<TextInput.Icon icon={hidePass ? "eye" : "eye-off"} onPressIn={()=> setHidePass(!hidePass)}/>}
            />
            <CustomInput
                style={styles.inputField}
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="New Password"
                secureTextEntry={hideConfirmPass ? true : false}
                suffix={<TextInput.Icon icon={hideConfirmPass ? "eye" : "eye-off"} onPressIn={()=> setHideConfirmPass(!hideConfirmPass)}/>}
            />
             <CustomInput
                style={[styles.inputField, {marginBottom: 40}]}
                value={confirmNewPassword}
                onChange={setConfirmNewPassword}
                placeholder="Confirm New Password"
                secureTextEntry={hideConfirmPass ? true : false}
                suffix={<TextInput.Icon icon={hideConfirmPass ? "eye" : "eye-off"} onPressIn={()=> setHideConfirmPass(!hideConfirmPass)}/>}
            />
            <GradientButton
                label="Change password"
                onPress={handleLogin}
                disabled={confirmNewPassword !== confirmPassword || confirmPassword.length < 1 || password.length < 1|| isPending}
                loading={isPending}
            />
        </ScrollView>
    );
}

export default EnterNewPasswordScreen;

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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 4,
        paddingVertical: 20
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        color: theme.colors.text
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
});
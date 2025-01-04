import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from 'react';
import GradientButton from "../components/GradientButton";
import { Icon, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { CustomNavigationProp } from "../types/common";
import { CustomInput } from "../components/CustomInput";
import useChangePassword from "../api/auth/useChangePassword";

const EnterNewPasswordScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();

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

    return(
        <ScrollView style={styles.container} automaticallyAdjustKeyboardInsets={true}>
           <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon size={20} source={"arrow-left"} color="#000000"/>
                    </TouchableOpacity>
                    <Text style={styles.title}>Settings</Text>
                </View>
            <View style={styles.titleContainer}>
                <Text style={styles.otpTitle}>Enter New Password</Text>
            </View>
            <Text style={styles.inputLabelText}>Please enter your new password</Text>
            <CustomInput
                style={styles.inputFields}
                value={password}
                onChange={setPassword}
                placeholder="Old Password"
                secureTextEntry={hidePass ? true : false}
                suffix={<TextInput.Icon icon={hidePass ? "eye" : "eye-off"} onPressIn={()=> setHidePass(!hidePass)}/>}
            />
            <CustomInput
                style={styles.inputFields2}
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="New Password"
                secureTextEntry={hideConfirmPass ? true : false}
                suffix={<TextInput.Icon icon={hideConfirmPass ? "eye" : "eye-off"} onPressIn={()=> setHideConfirmPass(!hideConfirmPass)}/>}
            />
             <CustomInput
                style={styles.inputFields3}
                value={confirmNewPassword}
                onChange={setConfirmNewPassword}
                placeholder="Confirm New Password"
                secureTextEntry={hideConfirmPass ? true : false}
                suffix={<TextInput.Icon icon={hideConfirmPass ? "eye" : "eye-off"} onPressIn={()=> setHideConfirmPass(!hideConfirmPass)}/>}
            />
            <GradientButton
                colors={["#00B976", "#00B976"]}
                label="Change password"
                onPress={handleLogin}
                disabled={confirmNewPassword !== confirmPassword || confirmPassword.length < 1 || password.length < 1|| isPending}
                loading={isPending}
            />
        </ScrollView>
    );
}

export default EnterNewPasswordScreen;

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
        color: '#000000'
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
        marginTop: 16
    },
    inputFields2: {
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "white",
        marginTop: 16,
    },
    inputFields3: {
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "white",
        marginTop: 16,
        marginBottom: 40
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
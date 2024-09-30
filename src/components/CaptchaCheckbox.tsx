import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";

interface CaptchaCheckboxProps {
    isRobot: boolean,
    setIsRobot:  React.Dispatch<React.SetStateAction<boolean>>
}

const CaptchaCheckbox = ({isRobot, setIsRobot}: CaptchaCheckboxProps) => {

    return(
        <View style={styles.captchaContainer}>
            <Checkbox
                status={isRobot? 'checked': 'unchecked'}
                onPress={() => setIsRobot(!isRobot)}
                color="#00B976"
            />
            <Text style={styles.checkboxLabel}>I'm not a robot</Text>
        </View>
    );
}

export default CaptchaCheckbox;

const styles = StyleSheet.create({
    captchaContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 1,
        borderColor:'#00000099',
        borderRadius: 5,
        width: '100%',
        marginTop: 12,
        marginBottom: 20,
        padding: 16
    },
    checkboxLabel: {
        color:'#000',
        fontWeight: '400',
        fontSize: 14,
    },
})
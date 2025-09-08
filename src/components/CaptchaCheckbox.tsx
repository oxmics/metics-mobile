import { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Checkbox, useTheme } from "react-native-paper";
import { ThemeContext } from "../themes/ThemeContext";

interface CaptchaCheckboxProps {
    isRobot: boolean,
    setIsRobot:  React.Dispatch<React.SetStateAction<boolean>>
}

const CaptchaCheckbox = ({isRobot, setIsRobot}: CaptchaCheckboxProps) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

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

const getStyles = (theme) => StyleSheet.create({
    captchaContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.placeholder,
        borderRadius: 5,
        width: '100%',
        marginTop: 12,
        marginBottom: 20,
        padding: 16
    },
    checkboxLabel: {
        color: theme.colors.text,
        fontWeight: '400',
        fontSize: 14,
    },
})
import { KeyboardTypeOptions, StyleProp, TextStyle } from "react-native"
import { TextInput, useTheme } from "react-native-paper"

interface CustomInputProp {
    value: string,
    onChange: React.Dispatch<React.SetStateAction<string>>,
    suffix?: React.ReactNode,
    secureTextEntry?: boolean,
    style?: StyleProp<TextStyle>,
    placeholder?: string,
    autoCaptalize?: "none" | "sentences" | "words" | "characters" | undefined,
    keyboardType?: KeyboardTypeOptions | undefined
}
export const CustomInput = ({autoCaptalize ,onChange, keyboardType, placeholder, secureTextEntry, style, suffix, value}: CustomInputProp) => {
    const theme = useTheme();
    return (
        <TextInput
                style={style && style}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder && placeholder}
                placeholderTextColor={theme.colors.placeholder}
                secureTextEntry={secureTextEntry !== null ? secureTextEntry : false}
                textColor={theme.colors.text}
                cursorColor="#1BBB6B"
                underlineStyle={{display: 'none'}}
                autoCapitalize={autoCaptalize !== null ? autoCaptalize : "none"}
                right={suffix}
                keyboardType={keyboardType}
            />
    )
}
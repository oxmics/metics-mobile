import { KeyboardTypeOptions, StyleProp, TextStyle } from "react-native"
import { TextInput } from "react-native-paper"

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
    return (
        <TextInput
                style={style && style}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder && placeholder}
                placeholderTextColor={"#00000080"}
                secureTextEntry={secureTextEntry !== null ? secureTextEntry : false}
                textColor="#000"
                cursorColor="#1BBB6B"
                underlineStyle={{display: 'none'}}
                autoCapitalize={autoCaptalize !== null ? autoCaptalize : "none"}
                right={suffix}
                keyboardType={keyboardType}
            />
    )
}
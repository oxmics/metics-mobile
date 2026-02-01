import React, { useState } from 'react';
import { KeyboardTypeOptions, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { colors, borderRadius } from '../theme';

interface CustomInputProp {
    value: string,
    onChange: ((text: string) => void) | React.Dispatch<React.SetStateAction<string>>,
    suffix?: React.ReactNode,
    prefix?: React.ReactNode,
    secureTextEntry?: boolean,
    style?: StyleProp<ViewStyle>,
    placeholder?: string,
    autoCaptalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined,
    keyboardType?: KeyboardTypeOptions | undefined,
    multiline?: boolean,
    numberOfLines?: number,
    disabled?: boolean,
    error?: boolean,
    label?: string,
}

export const CustomInput = ({
    autoCaptalize,
    onChange,
    keyboardType,
    placeholder,
    secureTextEntry,
    style,
    suffix,
    prefix,
    value,
    multiline,
    numberOfLines,
    disabled,
    error,
    label,
}: CustomInputProp) => {
    const [isFocused, setIsFocused] = useState(false);

    // Atlassian inputs often have a distinctive blue border on focus without the material ripple background scaling
    return (
        <TextInput
            mode="outlined"
            label={label}
            style={[
                styles.input,
                style,
            ]}
            outlineStyle={[
                styles.outline,
                isFocused && styles.outlineFocused,
                error && styles.outlineError,
                disabled && styles.outlineDisabled,
            ]}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={colors.neutral.text.tertiary}
            secureTextEntry={secureTextEntry || false}
            textColor={colors.neutral.text.primary}
            cursorColor={colors.primary[500]}
            activeOutlineColor={colors.primary[500]}
            outlineColor={colors.neutral.border.default}
            autoCapitalize={autoCaptalize || 'none'}
            right={suffix}
            left={prefix}
            keyboardType={keyboardType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            multiline={multiline}
            numberOfLines={numberOfLines}
            disabled={disabled}
            contentStyle={styles.contentStyle}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: colors.neutral.surface.default,
        fontSize: 14,
        minHeight: 48, // Slightly tighter vertical height common in productivity apps
    },
    outline: {
        borderRadius: borderRadius.base,
        borderWidth: 1, // Thinner border default
        borderColor: colors.neutral.border.default,
    },
    outlineFocused: {
        borderWidth: 2, // Highlighted border on focus
        borderColor: colors.primary[500],
    },
    outlineError: {
        borderColor: colors.semantic.error.default,
    },
    outlineDisabled: {
        backgroundColor: '#F4F5F7', // N20
        borderColor: '#F4F5F7',
    },
    contentStyle: {
        // Ensuring text aligns properly
    },
});

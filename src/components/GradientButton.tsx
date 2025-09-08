import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

interface GradientButtonProps {
    label: string,
    onPress: () => void,
    disabled?: boolean,
    loading?: boolean
}

const GradientButton = ({label, onPress, disabled, loading}: GradientButtonProps) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <TouchableOpacity disabled={disabled || loading} style={styles.buttonContainer} onPress={onPress}>
            <View style={[styles.button, disabled && styles.disabledButton]}>
                {loading && <ActivityIndicator size={"small"} color='#FFFFFF'/>}
                {!loading && <Text style={styles.buttonText}>{label}</Text>}
            </View>
        </TouchableOpacity>
    );
};

export default GradientButton;

const getStyles = (theme) => StyleSheet.create({
    buttonContainer: {
        width: '100%',
        alignSelf: 'center',
        marginTop: 20,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: theme.colors.disabled,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

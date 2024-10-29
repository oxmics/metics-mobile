import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ActivityIndicator } from 'react-native-paper';

interface GradientButtonProps {
    label: string,
    onPress: () => void
    colors: string[],
    disabled?: boolean,
    loading?: boolean
}

const GradientButton = ({label, onPress, colors, disabled, loading}: GradientButtonProps) => {
    return (
        <TouchableOpacity disabled={disabled && disabled} style={styles.buttonContainer} onPress={onPress}>
            <LinearGradient
                colors={disabled ? ["#585656", "#585656"]:colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
            >
                {loading && <ActivityIndicator size={"small"} color='#FFFFFF'/>}
                {!loading && <Text style={styles.buttonText}>{label}</Text>}
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default GradientButton;

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        alignSelf: 'center',
        marginTop: 20,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '400',
    },
});

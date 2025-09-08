import React, { useState, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { ThemeContext } from '../themes/ThemeContext';

interface ToggleButtonProps {
    active: string,
    setActive: React.Dispatch<React.SetStateAction<string>>
}
const ToggleButton = ({active, setActive}: ToggleButtonProps) => {
    const slideAnim = useRef(new Animated.Value(active === 'supplier' ? 0 : 1)).current;
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    // Function to handle the toggle
    const toggleActive = (val: string) => {
        if (active !== val) {
            setActive(val);
            // Animate the green round movement
            Animated.timing(slideAnim, {
                toValue: val === 'supplier' ? 0 : 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    // Interpolating the slide animation based on the value
    const translateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 124],  // Adjust based on the button width to move circle properly
    });

    return (
            <View style={styles.buttonContainer}>
                {/* Moving animated green circle */}
                <Animated.View
                    style={[
                        styles.activeIndicator,
                        { transform: [{ translateX }] },
                    ]}
                />
                {/* Supplier Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        active === 'supplier' ? styles.activeButton : styles.inactiveButton,
                    ]}
                    onPress={() => toggleActive('supplier')}
                >
                    <Text style={styles.buttonText}>Supplier</Text>
                </TouchableOpacity>

                {/* Buyer Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        active === 'buyer' ? styles.activeButton : styles.inactiveButton,
                    ]}
                    onPress={() => toggleActive('buyer')}
                >
                    <Text style={styles.buttonText}>Buyer</Text>
                </TouchableOpacity>
            </View>
    );
};

export default ToggleButton;

const getStyles = (theme) => StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 248,
        backgroundColor: theme.colors.surface,
        borderRadius: 25,
        position: 'relative',
        borderWidth: 1,
        borderColor: theme.colors.placeholder
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    buttonText: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    activeButton: {
        backgroundColor: 'transparent',
    },
    inactiveButton: {
        backgroundColor: 'transparent',
    },
    activeIndicator: {
        position: 'absolute',
        width: 124, // Button width
        height: '100%',
        backgroundColor: '#1BBB6B',
        borderRadius: 25,
    },
});

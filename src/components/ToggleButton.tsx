import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface ToggleButtonProps {
    active: string,
    setActive: React.Dispatch<React.SetStateAction<string>>
}
const ToggleButton = ({active, setActive}: ToggleButtonProps) => {
    const slideAnim = useRef(new Animated.Value(0)).current;

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

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 248,
        backgroundColor: '#585656',
        borderRadius: 25,
        position: 'relative',
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
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

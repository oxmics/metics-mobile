import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface ToggleButtonProps {
    active: string,
    setActive: React.Dispatch<React.SetStateAction<string>>
}

const ToggleButton = ({ active, setActive }: ToggleButtonProps) => {
    // Initialize with the correct position based on active prop
    const slideAnim = useRef(new Animated.Value(active === 'buyer' ? 1 : 0)).current;

    // Sync animation when active prop changes externally
    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: active === 'buyer' ? 1 : 0,
            useNativeDriver: false,
            tension: 50,
            friction: 10,
        }).start();
    }, [active, slideAnim]);

    const toggleActive = (val: string) => {
        if (active !== val) {
            setActive(val);
        }
    };

    const translateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [4, 150], // 4px padding on left, then 146px width + 4px padding = 150px for right position
    });

    return (
        <View style={styles.container}>
            {/* Sliding indicator */}
            <Animated.View
                style={[
                    styles.activeIndicator,
                    { transform: [{ translateX }] },
                ]}
            />

            {/* Supplier Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => toggleActive('supplier')}
                activeOpacity={0.8}
            >
                <Text style={[
                    styles.buttonText,
                    active === 'supplier' && styles.activeText,
                ]}>
                    Supplier
                </Text>
            </TouchableOpacity>

            {/* Buyer Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => toggleActive('buyer')}
                activeOpacity={0.8}
            >
                <Text style={[
                    styles.buttonText,
                    active === 'buyer' && styles.activeText,
                ]}>
                    Buyer
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ToggleButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.neutral.background,
        borderRadius: borderRadius.base,
        padding: 4,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
        position: 'relative',
        width: 300,
    },
    button: {
        flex: 1,
        paddingVertical: spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.base - 2,
        zIndex: 1,
    },
    buttonText: {
        ...typography.styles.label,
        color: colors.neutral.text.tertiary,
    },
    activeText: {
        color: colors.neutral.white,
        fontWeight: '600',
    },
    activeIndicator: {
        position: 'absolute',
        width: 146, // (300 - 8) / 2 = 146 (accounting for 4px padding on each side)
        top: 4,
        bottom: 4,
        backgroundColor: colors.primary[600],
        borderRadius: borderRadius.base - 2,
        ...shadows.sm,
    },
});

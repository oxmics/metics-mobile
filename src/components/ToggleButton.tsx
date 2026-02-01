import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface ToggleButtonProps {
    active: string,
    setActive: React.Dispatch<React.SetStateAction<string>>
}

const ToggleButton = ({ active, setActive }: ToggleButtonProps) => {
    const slideAnim = useRef(new Animated.Value(0)).current;

    const toggleActive = (val: string) => {
        if (active !== val) {
            setActive(val);
            Animated.spring(slideAnim, {
                toValue: val === 'supplier' ? 0 : 1,
                useNativeDriver: false,
                tension: 50,
                friction: 10,
            }).start();
        }
    };

    const translateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 150],
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
        padding: 2,
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
        color: colors.neutral.text.primary,
        fontWeight: '600',
    },
    activeIndicator: {
        position: 'absolute',
        width: 148,
        height: '100%',
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.base - 2,
        ...shadows.sm,
    },
});

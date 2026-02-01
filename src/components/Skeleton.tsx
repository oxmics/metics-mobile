import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors, borderRadius } from '../theme';

interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    style?: ViewStyle;
    variant?: 'box' | 'circle' | 'text';
}

export const Skeleton = ({ width, height, style, variant = 'box' }: SkeletonProps) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();

        return () => animation.stop();
    }, [opacity]);

    const getBorderRadius = () => {
        if (variant === 'circle') {return borderRadius.full;}
        if (variant === 'text') {return borderRadius.sm;}
        return borderRadius.md; // box
    };

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width: width,
                    height: height,
                    opacity: opacity,
                    borderRadius: getBorderRadius(),
                },
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: colors.neutral.border.default, // Light gray placeholder
    },
});

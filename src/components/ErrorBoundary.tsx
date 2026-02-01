import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { colors, spacing, borderRadius, typography } from '../theme';

type ErrorBoundaryProps = {
    children: React.ReactNode;
    name?: string;
};

type ErrorBoundaryState = {
    hasError: boolean;
    message: string;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {
        hasError: false,
        message: '',
    };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, message: error?.message || 'Unknown render error' };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('[ErrorBoundary]', this.props.name || 'Screen', error, info?.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, message: '' });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Render error</Text>
                    <Text style={styles.subtitle}>
                        {this.props.name ? `${this.props.name}: ` : ''}{this.state.message}
                    </Text>
                    <Button mode="outlined" onPress={this.handleReset} style={styles.button}>
                        Try again
                    </Button>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        backgroundColor: colors.neutral.surface.sunken,
    },
    title: {
        ...typography.styles.h4,
        marginBottom: spacing.sm,
        color: colors.semantic.error.default,
    },
    subtitle: {
        ...typography.styles.body,
        color: colors.neutral.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    button: {
        borderRadius: borderRadius.base,
        borderColor: colors.neutral.border.default,
    },
});

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Icon, Menu } from 'react-native-paper';
import { colors, spacing, typography, borderRadius } from '../theme';

export interface DropdownOption {
    label: string;
    value: string;
}

interface CustomDropdownProps {
    label?: string;
    placeholder: string;
    value: string;
    options: DropdownOption[];
    onSelect: (value: string, label: string) => void;
    disabled?: boolean;
    loading?: boolean;
    error?: boolean;
    style?: any;
}

export const CustomDropdown = ({
    label,
    placeholder,
    value,
    options,
    onSelect,
    disabled = false,
    loading = false,
    error = false,
    style,
}: CustomDropdownProps) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                contentStyle={styles.menuContent}
                anchor={
                    <TouchableOpacity
                        onPress={() => !disabled && !loading && setMenuVisible(true)}
                        style={[
                            styles.dropdownButton,
                            disabled && styles.dropdownButtonDisabled,
                            error && styles.dropdownButtonError,
                        ]}
                        disabled={disabled || loading}
                        activeOpacity={0.7}
                    >
                        <View style={styles.dropdownContent}>
                            <Text
                                style={[
                                    selectedOption ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder,
                                    disabled && styles.dropdownTextDisabled,
                                ]}
                                numberOfLines={1}
                            >
                                {loading ? 'Loading...' : displayText}
                            </Text>
                            <Icon
                                source={menuVisible ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color={disabled ? colors.neutral.text.disabled : colors.neutral.text.tertiary}
                            />
                        </View>
                    </TouchableOpacity>
                }
            >
                <ScrollView style={styles.menuScrollView} nestedScrollEnabled>
                    {options.length > 0 ? (
                        options.map((option) => (
                            <Menu.Item
                                key={option.value}
                                onPress={() => {
                                    onSelect(option.value, option.label);
                                    setMenuVisible(false);
                                }}
                                title={option.label}
                                titleStyle={
                                    option.value === value
                                        ? styles.menuItemSelected
                                        : styles.menuItemDefault
                                }
                                style={option.value === value ? styles.menuItemSelectedBg : undefined}
                            />
                        ))
                    ) : (
                        <Menu.Item title="No options available" disabled />
                    )}
                </ScrollView>
            </Menu>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
        width: '100%',
    },
    label: {
        ...typography.styles.label,
        color: colors.neutral.text.secondary,
        marginBottom: spacing.xs,
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.neutral.surface.default,
        minHeight: 56,
        justifyContent: 'center',
    },
    dropdownButtonDisabled: {
        backgroundColor: colors.neutral.surface.sunken,
        opacity: 0.6,
    },
    dropdownButtonError: {
        borderColor: colors.semantic.error.default,
    },
    dropdownContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.sm,
    },
    dropdownTextSelected: {
        ...typography.styles.body,
        color: colors.neutral.text.primary,
        flex: 1,
    },
    dropdownTextPlaceholder: {
        ...typography.styles.body,
        color: colors.neutral.text.tertiary,
        flex: 1,
    },
    dropdownTextDisabled: {
        color: colors.neutral.text.disabled,
    },
    menuContent: {
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.sm,
        maxHeight: 300,
        elevation: 8,
    },
    menuScrollView: {
        maxHeight: 300,
    },
    menuItemDefault: {
        color: colors.neutral.text.primary,
    },
    menuItemSelected: {
        color: colors.primary[600],
        fontWeight: '600',
    },
    menuItemSelectedBg: {
        backgroundColor: colors.primary[50],
    },
});

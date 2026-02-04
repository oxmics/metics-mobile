import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput, Divider } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface BidLineItem {
    id?: string;
    product_name: string;
    quantity: number;
    brand?: string;
    target_price?: string;
    created_at?: string;
}

interface Props {
    items: any[];
    quotes: Record<number, { price: string; date: CalendarDate | undefined; quantity?: string }>;
    onQuoteChange: (index: number, field: 'price' | 'date' | 'quantity', value: any) => void;
    editable?: boolean;
    partialQuantityAllowed?: boolean;
}

export const BidLinesInput = ({ items, quotes, onQuoteChange, editable = true, partialQuantityAllowed = false }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Bid Lines</Text>
            </View>

            <View style={styles.content}>
                {items.map((item, index) => {
                    const currentQuote = quotes[index] || { price: '', date: undefined, quantity: item.quantity.toString() };

                    return (
                        <View key={index} style={styles.itemContainer}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemName} numberOfLines={1}>{item.product_name}</Text>
                                {partialQuantityAllowed ? (
                                    <View style={styles.qtyInputWrapper}>
                                        <TextInput
                                            mode="outlined"
                                            label="Qty"
                                            value={currentQuote.quantity || item.quantity.toString()}
                                            onChangeText={(text) => onQuoteChange(index, 'quantity', text)}
                                            keyboardType="numeric"
                                            style={[styles.input, styles.qtyInput]}
                                            dense
                                            disabled={!editable}
                                            textColor={colors.neutral.text.primary}
                                            outlineColor={colors.neutral.border.default}
                                            activeOutlineColor={colors.primary[800]}
                                        />
                                    </View>
                                ) : (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>Qty: {item.quantity}</Text>
                                    </View>
                                )}
                            </View>

                            {item.brand && (
                                <Text style={styles.itemSubtext}>Brand: {item.brand}</Text>
                            )}

                            <View style={styles.targetPriceRow}>
                                <Text style={styles.label}>Target: ${item.target_price || 'N/A'}</Text>
                            </View>

                            <View style={styles.inputsRow}>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        mode="outlined"
                                        label="Price ($)"
                                        value={currentQuote.price}
                                        onChangeText={(text) => onQuoteChange(index, 'price', text)}
                                        keyboardType="numeric"
                                        style={styles.input}
                                        dense
                                        disabled={!editable}
                                        textColor={colors.neutral.text.primary}
                                        outlineColor={colors.neutral.border.default}
                                        activeOutlineColor={colors.primary[800]}
                                    />
                                </View>

                                <View style={styles.inputWrapper}>
                                    <DatePickerInput
                                        locale="en"
                                        label="Date"
                                        value={currentQuote.date}
                                        onChange={(d) => onQuoteChange(index, 'date', d)}
                                        inputMode="start"
                                        mode="outlined"
                                        style={styles.input}
                                        dense
                                        disabled={!editable}
                                        withDateFormatInLabel={false}
                                        textColor={colors.neutral.text.primary}
                                        outlineColor={colors.neutral.border.default}
                                        activeOutlineColor={colors.primary[800]}
                                    />
                                </View>
                            </View>

                            {index < items.length - 1 && <Divider style={styles.divider} />}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.lg,
        padding: spacing.lg, // Reduced padding for compactness
        ...shadows.sm,
    },
    header: {
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    title: {
        ...typography.styles.h4,
        color: colors.primary[800],
    },
    content: {
        gap: spacing.md,
    },
    itemContainer: {
        gap: spacing.xs,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemName: {
        ...typography.styles.h4,
        color: colors.neutral.text.primary,
        flex: 1,
        marginRight: spacing.sm,
    },
    badge: {
        backgroundColor: colors.neutral.surface.sunken,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    badgeText: {
        ...typography.styles.caption,
        fontWeight: '600',
        color: colors.neutral.text.secondary,
    },
    itemSubtext: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
    },
    targetPriceRow: {
        flexDirection: 'row',
        marginBottom: spacing.xs,
    },
    label: {
        ...typography.styles.caption,
        color: colors.neutral.text.secondary,
    },
    inputsRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.xs,
    },
    inputWrapper: {
        flex: 1,
    },
    input: {
        backgroundColor: colors.neutral.background,
        fontSize: typography.size.body,
        height: 48, // slightly taller for touch targets
    },
    qtyInputWrapper: {
        width: 100,
    },
    qtyInput: {
        textAlign: 'center',
    },
    divider: {
        marginTop: spacing.md,
        backgroundColor: colors.neutral.border.default,
    },
});

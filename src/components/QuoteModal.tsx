import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Modal, PaperProvider, Text, TextInput, IconButton } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

const customTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary[800],
        onPrimary: colors.neutral.white,
        onSurface: colors.neutral.text.primary,
        surface: colors.neutral.surface.default,
        onSurfaceVariant: colors.neutral.text.primary,
        secondary: colors.neutral.text.secondary,
    },
};

interface props {
    show: boolean,
    closeModal: () => void,
    price: string,
    date: CalendarDate,
    setPrice: React.Dispatch<React.SetStateAction<string>>,
    setDate: React.Dispatch<React.SetStateAction<CalendarDate>>
}

export const QuoteModal = ({ closeModal, date, price, setDate, setPrice, show }: props) => {
    const [inputDate, setInputDate] = useState<CalendarDate>(date);
    const [inputPrice, setInputPrice] = useState<string>(price);

    const handleAdd = () => {
        setDate(inputDate);
        setPrice(inputPrice);
        closeModal();
    };

    return (
        <Modal
            visible={show}
            onDismiss={closeModal}
            dismissable
            contentContainerStyle={styles.modalContent}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Update Quote</Text>
                    <IconButton
                        icon="close"
                        size={20}
                        onPress={closeModal}
                        iconColor={colors.neutral.text.tertiary}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Promised Price</Text>
                    <TextInput
                        placeholder="0.00"
                        mode="outlined"
                        value={inputPrice}
                        onChangeText={setInputPrice}
                        keyboardType="numeric"
                        textColor={colors.neutral.text.primary}
                        outlineColor={colors.neutral.border.default}
                        activeOutlineColor={colors.primary[800]}
                        style={styles.inputBox}
                        placeholderTextColor={colors.neutral.text.tertiary}
                        left={<TextInput.Icon icon="currency-usd" color={colors.neutral.text.tertiary} />}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Promised Date</Text>
                    <PaperProvider theme={customTheme}>
                        <DatePickerInput
                            withDateFormatInLabel={false}
                            mode="outlined"
                            locale="en"
                            value={inputDate}
                            onChange={(d) => setInputDate(d)}
                            inputMode="start"
                            textColor={colors.neutral.text.primary}
                            outlineColor={colors.neutral.border.default}
                            activeOutlineColor={colors.primary[800]}
                            style={styles.inputBox}
                        />
                    </PaperProvider>
                </View>

                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        style={styles.submitBtn}
                        labelStyle={styles.btnLabel}
                        onPress={handleAdd}
                    >
                        Save Quote
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        padding: spacing.lg,
    },
    container: {
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.styles.h3,
        color: colors.primary[800],
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.styles.labelSmall,
        marginBottom: spacing.xs,
        color: colors.neutral.text.secondary,
    },
    inputBox: {
        backgroundColor: colors.neutral.background,
        fontSize: typography.size.body,
    },
    footer: {
        marginTop: spacing.md,
    },
    submitBtn: {
        backgroundColor: colors.primary[700],
        borderRadius: borderRadius.base,
        height: 48,
        justifyContent: 'center',
    },
    btnLabel: {
        ...typography.styles.label,
        color: colors.neutral.white,
    },
});

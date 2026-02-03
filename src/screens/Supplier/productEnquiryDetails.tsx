import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Icon, ActivityIndicator } from 'react-native-paper';
import { useState } from 'react';
import useProductEnquiries from '../../api/products/useProductEnquiries';
import { RootStackParamList } from '../../types/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { CustomDialog } from '../../components/CustomDialog';
import GradientButton from '../../components/GradientButton';

type ScreenRouteProp = RouteProp<RootStackParamList, 'SupplierProductEnquiryDetails'>;

const SupplierProductEnquiryDetailsScreen = () => {
    const route = useRoute<ScreenRouteProp>();
    const navigation = useNavigation();
    const { id } = route.params;

    const { detail, acknowledge, reject } = useProductEnquiries(id);
    const { data: enquiry, isPending: loading, isError } = detail;

    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const handleAcknowledge = () => {
        acknowledge.mutate(id, {
            onSuccess: () => {
                setDialogMessage('Enquiry acknowledged successfully.');
                setShowSuccessDialog(true);
            },
            onError: () => {
                setDialogMessage('Failed to acknowledge enquiry.');
                setShowErrorDialog(true);
            }
        });
    };

    const handleReject = () => {
        setShowRejectDialog(true);
    };

    const confirmReject = () => {
        setShowRejectDialog(false);
        reject.mutate(id, {
            onSuccess: () => {
                setDialogMessage('Enquiry rejected successfully.');
                setShowSuccessDialog(true);
            },
            onError: () => {
                setDialogMessage('Failed to reject enquiry.');
                setShowErrorDialog(true);
            }
        });
    };

    const handleSuccessClose = () => {
        setShowSuccessDialog(false);
        navigation.goBack();
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator color={colors.primary[500]} />
            </View>
        );
    }

    if (isError || !enquiry) {
        return (
            <View style={styles.centerContainer}>
                <Text>Failed to load enquiry details</Text>
            </View>
        );
    }

    return (
        <ErrorBoundary name="SupplierProductEnquiryDetailsScreen">
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: spacing.md }}>
                        <Icon
                            source="arrow-left"
                            size={24}
                            color={colors.neutral.text.secondary}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Enquiry Details</Text>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.label}>Requested By</Text>
                        <Text style={styles.value}>{enquiry.organisation_name}</Text>
                        <Text style={styles.subValue}>{enquiry.email}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Items</Text>
                        {enquiry.items && enquiry.items.map((item, index) => (
                            <View key={index} style={styles.itemCard}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemName}>{item.product_name || `Product ID: ${item.product_id}`}</Text>
                                    <Text style={styles.itemQty}>x{item.quantity}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.section}>
                        <Text style={styles.label}>Status</Text>
                        <Text style={[
                            styles.statusValue,
                            enquiry.int_status === 1 ? { color: colors.semantic.success.default } :
                                enquiry.int_status === -1 ? { color: colors.semantic.error.default } :
                                    { color: colors.semantic.warning.default }
                        ]}>
                            {enquiry.int_status === 1 ? 'ACKNOWLEDGED' : enquiry.int_status === -1 ? 'REJECTED' : 'PENDING'}
                        </Text>
                    </View>

                </ScrollView>

                {/* Actions */}
                {enquiry.int_status === 0 && (
                    <View style={styles.footer}>
                        <GradientButton
                            label="Reject"
                            onPress={handleReject}
                            variant="outline"
                        />
                        <GradientButton
                            label="Acknowledge"
                            onPress={handleAcknowledge}
                            loading={acknowledge.isPending}
                        />
                    </View>
                )}

                {/* Dialogs */}
                <CustomDialog
                    visible={showRejectDialog}
                    title="Reject Enquiry"
                    message="Are you sure you want to reject this enquiry?"
                    onDismiss={() => setShowRejectDialog(false)}
                    confirmText="Reject"
                    cancelText="Cancel"
                    onConfirm={confirmReject}
                    isDestructive
                    loading={reject.isPending}
                />
                <CustomDialog
                    visible={showSuccessDialog}
                    title="Success"
                    message={dialogMessage}
                    onDismiss={handleSuccessClose}
                    confirmText="OK"
                />
                <CustomDialog
                    visible={showErrorDialog}
                    title="Error"
                    message={dialogMessage}
                    onDismiss={() => setShowErrorDialog(false)}
                    confirmText="OK"
                    isDestructive
                />
            </View>
        </ErrorBoundary>
    );
};

export default SupplierProductEnquiryDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral.surface.default,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    headerTitle: {
        ...typography.styles.h4,
    },
    content: {
        padding: spacing.lg,
    },
    section: {
        marginBottom: spacing.md,
    },
    label: {
        ...typography.styles.label,
        color: colors.neutral.text.secondary,
        marginBottom: 4,
    },
    value: {
        ...typography.styles.h4,
        color: colors.neutral.text.primary,
    },
    subValue: {
        ...typography.styles.body,
        color: colors.neutral.text.tertiary,
    },
    sectionTitle: {
        ...typography.styles.h4,
        marginBottom: spacing.md,
    },
    itemCard: {
        backgroundColor: colors.neutral.surface.sunken,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemName: {
        ...typography.styles.body,
        fontWeight: '600',
    },
    itemQty: {
        ...typography.styles.body,
        color: colors.neutral.text.secondary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.neutral.border.default,
        marginVertical: spacing.lg,
    },
    statusValue: {
        ...typography.styles.h4,
        fontWeight: 'bold',
    },
    footer: {
        padding: spacing.lg,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.border.default,
        gap: spacing.sm,
    },
    button: {
        flex: 1,
    }
});

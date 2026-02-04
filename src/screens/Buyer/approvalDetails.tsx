import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Icon, ActivityIndicator, TextInput } from 'react-native-paper';
import { useState } from 'react';
import { useWorkflowTasks, useWorkflowAction } from '../../api/workflow/useWorkflowTasks';
import { RootStackParamList } from '../../types/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { CustomDialog } from '../../components/CustomDialog';
import GradientButton from '../../components/GradientButton';
import { format } from 'date-fns';

type ScreenRouteProp = RouteProp<RootStackParamList, 'BuyerApprovalDetails'>;

const BuyerApprovalDetailsScreen = () => {
    const route = useRoute<ScreenRouteProp>();
    const navigation = useNavigation();
    const { taskId } = route.params;

    const { data: tasks, isLoading } = useWorkflowTasks();
    const workflowAction = useWorkflowAction();

    const [comment, setComment] = useState('');
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const task = tasks?.find(t => t.id === taskId);

    const handleApprove = () => {
        setShowApproveDialog(true);
    };

    const confirmApprove = () => {
        setShowApproveDialog(false);
        workflowAction.mutate(
            { taskId, payload: { action: 'approve', comment: comment || undefined } },
            {
                onSuccess: () => {
                    setDialogMessage('Task approved successfully');
                    setShowSuccessDialog(true);
                },
                onError: () => {
                    setDialogMessage('Failed to approve task');
                    setShowSuccessDialog(true);
                },
            }
        );
    };

    const handleReject = () => {
        setShowRejectDialog(true);
    };

    const confirmReject = () => {
        setShowRejectDialog(false);
        workflowAction.mutate(
            { taskId, payload: { action: 'reject', comment: comment || undefined } },
            {
                onSuccess: () => {
                    setDialogMessage('Task rejected');
                    setShowSuccessDialog(true);
                },
                onError: () => {
                    setDialogMessage('Failed to reject task');
                    setShowSuccessDialog(true);
                },
            }
        );
    };

    const handleSuccessClose = () => {
        setShowSuccessDialog(false);
        navigation.goBack();
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    if (!task) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Task not found</Text>
            </View>
        );
    }

    return (
        <ErrorBoundary>
            <View style={styles.wrapper}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon source="arrow-left" size={24} color={colors.neutral.text.primary} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerLabel}>Approval</Text>
                        <Text style={styles.title}>Task Details</Text>
                    </View>
                </View>

                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    {/* Task Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Task Information</Text>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Title</Text>
                            <Text style={styles.value}>{task.title}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Description</Text>
                            <Text style={styles.value}>{task.description}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Type</Text>
                            <Text style={styles.value}>{task.related_object_type.replace('_', ' ').toUpperCase()}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Due Date</Text>
                            <Text style={styles.value}>{format(new Date(task.due_date), 'MMMM dd, yyyy')}</Text>
                        </View>

                        {task.amount && (
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Amount</Text>
                                <Text style={[styles.value, styles.amountText]}>
                                    {task.currency} {task.amount.toLocaleString()}
                                </Text>
                            </View>
                        )}

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Status</Text>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                                <Text style={styles.statusText}>{task.status.toUpperCase()}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Comment Section */}
                    {task.status === 'pending' && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Add Comment (Optional)</Text>
                            <TextInput
                                mode="outlined"
                                placeholder="Enter your comments..."
                                value={comment}
                                onChangeText={setComment}
                                multiline
                                numberOfLines={4}
                                style={styles.commentInput}
                                outlineColor={colors.neutral.border.default}
                                activeOutlineColor={colors.primary[500]}
                            />
                        </View>
                    )}
                </ScrollView>

                {/* Actions */}
                {task.status === 'pending' && (
                    <View style={styles.footer}>
                        <GradientButton
                            label="Reject"
                            onPress={handleReject}
                            variant="outline"
                        />
                        <GradientButton
                            label="Approve"
                            onPress={handleApprove}
                            loading={workflowAction.isPending}
                        />
                    </View>
                )}

                {/* Dialogs */}
                <CustomDialog
                    visible={showApproveDialog}
                    title="Approve Task"
                    message="Are you sure you want to approve this task?"
                    onDismiss={() => setShowApproveDialog(false)}
                    confirmText="Approve"
                    cancelText="Cancel"
                    onConfirm={confirmApprove}
                />
                <CustomDialog
                    visible={showRejectDialog}
                    title="Reject Task"
                    message="Are you sure you want to reject this task?"
                    onDismiss={() => setShowRejectDialog(false)}
                    confirmText="Reject"
                    cancelText="Cancel"
                    onConfirm={confirmReject}
                    isDestructive
                />
                <CustomDialog
                    visible={showSuccessDialog}
                    title="Success"
                    message={dialogMessage}
                    onDismiss={handleSuccessClose}
                    confirmText="OK"
                />
            </View>
        </ErrorBoundary>
    );
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending': return colors.semantic.warning.default;
        case 'approved': return colors.semantic.success.default;
        case 'rejected': return colors.semantic.error.default;
        default: return colors.neutral.text.tertiary;
    }
};

export default BuyerApprovalDetailsScreen;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.neutral.surface.default,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        paddingTop: spacing.xl,
        gap: spacing.md,
        backgroundColor: colors.neutral.surface.default,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerLabel: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
        textTransform: 'uppercase',
    },
    title: {
        ...typography.styles.h2,
        color: colors.neutral.text.primary,
    },
    container: {
        flex: 1,
    },
    section: {
        padding: spacing.lg,
        backgroundColor: colors.neutral.white,
        marginBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    sectionTitle: {
        ...typography.styles.h4,
        color: colors.neutral.text.primary,
        marginBottom: spacing.md,
    },
    infoRow: {
        marginBottom: spacing.md,
    },
    label: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
        marginBottom: spacing.xs,
        textTransform: 'uppercase',
    },
    value: {
        ...typography.styles.body,
        color: colors.neutral.text.primary,
    },
    amountText: {
        ...typography.styles.h3,
        color: colors.primary[700],
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.xs,
        alignSelf: 'flex-start',
    },
    statusText: {
        color: colors.neutral.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    commentInput: {
        backgroundColor: colors.neutral.surface.default,
    },
    footer: {
        padding: spacing.lg,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.border.default,
        gap: spacing.sm,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        ...typography.styles.body,
        color: colors.semantic.error.default,
    },
});

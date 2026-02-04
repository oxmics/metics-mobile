import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Text, ActivityIndicator, Icon, Searchbar } from 'react-native-paper';
import { useState } from 'react';
import useWorkflowTasks from '../../api/workflow/useWorkflowTasks';
import { WorkflowTask } from '../../types/workflow';
import { CustomNavigationProp } from '../../types/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { format } from 'date-fns';

const BuyerApprovalsScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { data: tasks, isLoading, error, refetch } = useWorkflowTasks();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTasks = tasks?.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pendingTasks = filteredTasks?.filter(t => t.status === 'pending');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return colors.semantic.warning.default;
            case 'approved': return colors.semantic.success.default;
            case 'rejected': return colors.semantic.error.default;
            default: return colors.neutral.text.tertiary;
        }
    };

    const renderTask = ({ item }: { item: WorkflowTask }) => (
        <TouchableOpacity
            style={styles.taskCard}
            onPress={() => navigation.navigate('BuyerApprovalDetails', { taskId: item.id })}
            activeOpacity={0.7}
        >
            <View style={styles.taskHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.taskTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.taskDescription} numberOfLines={2}>{item.description}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.taskFooter}>
                <View style={styles.taskMeta}>
                    <Icon source="calendar-outline" size={16} color={colors.neutral.text.tertiary} />
                    <Text style={styles.metaText}>
                        Due: {format(new Date(item.due_date), 'MMM dd, yyyy')}
                    </Text>
                </View>
                {item.amount && (
                    <View style={styles.taskMeta}>
                        <Icon source="currency-usd" size={16} color={colors.neutral.text.tertiary} />
                        <Text style={styles.metaText}>
                            {item.currency} {item.amount.toLocaleString()}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    const EmptyState = () => (
        <View style={styles.emptyState}>
            <Icon source="check-circle-outline" size={64} color={colors.neutral.text.tertiary} />
            <Text style={styles.emptyTitle}>No Pending Approvals</Text>
            <Text style={styles.emptySubtitle}>You're all caught up!</Text>
        </View>
    );

    // Show empty state even if there's an error (likely no workflow feature enabled)
    const displayTasks = error ? [] : filteredTasks;

    return (
        <ErrorBoundary>
            <View style={styles.wrapper}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Icon source="arrow-left" size={24} color={colors.neutral.text.primary} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.headerLabel}>Workflow</Text>
                            <Text style={styles.title}>Approvals</Text>
                        </View>
                        {pendingTasks && pendingTasks.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{pendingTasks.length}</Text>
                            </View>
                        )}
                    </View>

                    {/* Search */}
                    <View style={styles.searchContainer}>
                        <Searchbar
                            mode="bar"
                            placeholder="Search approvals..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={styles.searchbar}
                            iconColor={colors.neutral.text.tertiary}
                            inputStyle={styles.searchInput}
                            placeholderTextColor={colors.neutral.text.tertiary}
                            cursorColor={colors.primary[500]}
                            elevation={0}
                        />
                    </View>

                    {/* Task List */}
                    <FlatList
                        data={displayTasks}
                        renderItem={renderTask}
                        keyExtractor={(item) => item.id}
                        refreshing={isLoading}
                        onRefresh={refetch}
                        ListEmptyComponent={isLoading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </ErrorBoundary>
    );
};

export default BuyerApprovalsScreen;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.neutral.surface.default,
    },
    container: {
        flex: 1,
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
    badge: {
        backgroundColor: colors.semantic.error.default,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        minWidth: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: colors.neutral.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    searchContainer: {
        padding: spacing.lg,
        backgroundColor: colors.neutral.surface.default,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    searchbar: {
        backgroundColor: colors.neutral.surface.sunken,
        borderRadius: borderRadius.base,
        height: 48,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    searchInput: {
        ...typography.styles.body,
        minHeight: 0,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.xl,
    },
    taskCard: {
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.base,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
        ...shadows.sm,
    },
    taskHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    taskTitle: {
        ...typography.styles.h4,
        color: colors.neutral.text.primary,
        marginBottom: spacing.xs,
    },
    taskDescription: {
        ...typography.styles.bodySmall,
        color: colors.neutral.text.secondary,
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.xs,
    },
    statusText: {
        color: colors.neutral.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    taskFooter: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    taskMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    metaText: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: spacing['3xl'],
    },
    emptyTitle: {
        ...typography.styles.h4,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
        color: colors.neutral.text.secondary,
    },
    emptySubtitle: {
        ...typography.styles.bodySmall,
        color: colors.neutral.text.tertiary,
    },
    loader: {
        marginTop: spacing['3xl'],
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

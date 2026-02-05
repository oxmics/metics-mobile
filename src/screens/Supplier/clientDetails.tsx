import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Linking } from 'react-native';
import { Text, Icon, ActivityIndicator } from 'react-native-paper';
import { useClientDetails, useClientMetrics } from '../../api/clients/useClients';
import { RootStackParamList } from '../../types/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import LinearGradient from 'react-native-linear-gradient';

type ScreenRouteProp = RouteProp<RootStackParamList, 'SupplierClientDetails'>;

const SupplierClientDetailsScreen = () => {
    const route = useRoute<ScreenRouteProp>();
    const navigation = useNavigation();
    const { clientId } = route.params;

    const { data: client, isLoading: loadingClient } = useClientDetails(clientId);
    const { data: metrics, isLoading: loadingMetrics } = useClientMetrics(clientId);

    const handleCall = () => {
        if (client?.contact) {
            Linking.openURL(`tel:${client.contact}`);
        }
    };

    const handleEmail = () => {
        if (client?.email) {
            Linking.openURL(`mailto:${client.email}`);
        }
    };

    if (loadingClient) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    if (!client) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Client not found</Text>
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
                        <Text style={styles.headerLabel}>Client</Text>
                        <Text style={styles.title} numberOfLines={1}>{client.name}</Text>
                    </View>
                </View>

                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    {/* Client Profile */}
                    <View style={styles.profileSection}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{client.name.charAt(0).toUpperCase()}</Text>
                        </View>
                        <Text style={styles.clientName}>{client.name}</Text>
                        {client.city && client.country && (
                            <View style={styles.locationRow}>
                                <Icon source="map-marker" size={16} color={colors.neutral.text.tertiary} />
                                <Text style={styles.locationText}>{client.city}, {client.country}</Text>
                            </View>
                        )}
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.actionsSection}>
                        <TouchableOpacity onPress={handleCall} activeOpacity={0.8} style={styles.actionButtonWrapper}>
                            <LinearGradient
                                colors={[colors.primary[600], colors.primary[700]]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.actionButton}
                            >
                                <Icon source="phone" size={20} color={colors.neutral.white} />
                                <Text style={styles.actionButtonText}>Call</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleEmail} activeOpacity={0.8} style={styles.actionButtonWrapper}>
                            <LinearGradient
                                colors={[colors.primary[600], colors.primary[700]]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.actionButton}
                            >
                                <Icon source="email" size={20} color={colors.neutral.white} />
                                <Text style={styles.actionButtonText}>Email</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Performance Metrics */}
                    {metrics && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Activity</Text>
                            <View style={styles.metricsGrid}>
                                <View style={styles.metricCard}>
                                    <Text style={styles.metricValue}>{metrics.total_auctions || 0}</Text>
                                    <Text style={styles.metricLabel}>Auctions</Text>
                                </View>
                                <View style={styles.metricCard}>
                                    <Text style={styles.metricValue}>{metrics.total_pos || 0}</Text>
                                    <Text style={styles.metricLabel}>Purchase Orders</Text>
                                </View>
                                {metrics.total_spend !== undefined && (
                                    <View style={styles.metricCard}>
                                        <Text style={styles.metricValue}>${metrics.total_spend}</Text>
                                        <Text style={styles.metricLabel}>Total Spend</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Contact Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact Information</Text>

                        <View style={styles.infoRow}>
                            <Icon source="email-outline" size={20} color={colors.neutral.text.tertiary} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.infoLabel}>Email</Text>
                                <Text style={styles.infoValue}>{client.email}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon source="phone-outline" size={20} color={colors.neutral.text.tertiary} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.infoLabel}>Phone</Text>
                                <Text style={styles.infoValue}>{client.contact}</Text>
                            </View>
                        </View>

                        {client.address_line1 && (
                            <View style={styles.infoRow}>
                                <Icon source="map-marker-outline" size={20} color={colors.neutral.text.tertiary} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.infoLabel}>Address</Text>
                                    <Text style={styles.infoValue}>
                                        {client.address_line1}
                                        {client.city && `, ${client.city}`}
                                        {client.country && `, ${client.country}`}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </ErrorBoundary>
    );
};

export default SupplierClientDetailsScreen;

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
    profileSection: {
        alignItems: 'center',
        padding: spacing.xl,
        backgroundColor: colors.neutral.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    avatarText: {
        color: colors.neutral.white,
        fontSize: 32,
        fontWeight: 'bold',
    },
    clientName: {
        ...typography.styles.h2,
        color: colors.neutral.text.primary,
        marginBottom: spacing.xs,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    locationText: {
        ...typography.styles.body,
        color: colors.neutral.text.tertiary,
    },
    actionsSection: {
        flexDirection: 'row',
        gap: spacing.md,
        padding: spacing.lg,
        paddingHorizontal: spacing.xl,
        backgroundColor: colors.neutral.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    actionButtonWrapper: {
        flex: 1,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.base,
        minHeight: 48,
        ...shadows.sm,
    },
    actionButtonText: {
        color: colors.neutral.white,
        fontSize: 15,
        fontWeight: '600',
    },
    section: {
        padding: spacing.lg,
        backgroundColor: colors.neutral.white,
        marginTop: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    sectionTitle: {
        ...typography.styles.h4,
        color: colors.neutral.text.primary,
        marginBottom: spacing.md,
    },
    metricsGrid: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    metricCard: {
        flex: 1,
        backgroundColor: colors.neutral.surface.sunken,
        padding: spacing.md,
        borderRadius: borderRadius.base,
        alignItems: 'center',
    },
    metricValue: {
        ...typography.styles.h2,
        color: colors.primary[700],
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    metricLabel: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
        textAlign: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    infoLabel: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
        marginBottom: spacing.xs,
    },
    infoValue: {
        ...typography.styles.body,
        color: colors.neutral.text.primary,
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

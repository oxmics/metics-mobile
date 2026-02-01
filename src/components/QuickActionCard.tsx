import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { CustomNavigationProp } from '../types/common';
import { colors, spacing, borderRadius } from '../theme';

interface props {
    isBuyer?: boolean
}

export const RFQQuickActionCard = ({ isBuyer }: props) => {
    const navigation = useNavigation<CustomNavigationProp>();
    return (
        <TouchableOpacity
            onPress={() => isBuyer ? navigation.navigate('BuyerRfqHistory') : navigation.navigate('SupplierRequestHistory')}
            activeOpacity={0.7}
        >
            <View style={styles.container}>
                <View style={[styles.iconContainer, styles.iconContainerRfq]}>
                    <Icon source="file-document-outline" size={20} color={colors.primary[600]} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>All Requests</Text>
                    <Text style={styles.subtitle}>View RFQs</Text>
                </View>
                {/* Arrow removed for a cleaner 'tile' look, or kept subtle */}
            </View>
        </TouchableOpacity>
    );
};

export const OrdersQuickActionCard = ({ isBuyer }: props) => {
    const navigation = useNavigation<CustomNavigationProp>();
    return (
        <TouchableOpacity
            onPress={() => isBuyer ? navigation.navigate('BuyerPurchaseOrder') : navigation.navigate('SupplierPurchaseOrder')}
            activeOpacity={0.7}
        >
            <View style={styles.container}>
                <View style={[styles.iconContainer, styles.iconContainerOrders]}>
                    <Icon source="package-variant" size={20} color={colors.semantic.success.dark} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Orders</Text>
                    <Text style={styles.subtitle}>Track status</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.sm,
        marginRight: spacing.md,
        width: 150, // Fixed width tiles
        height: 64,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
        // No shadow, flat style
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.sm, // Slightly squarer
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    iconContainerRfq: {
        backgroundColor: colors.primary[50],
    },
    iconContainerOrders: {
        backgroundColor: colors.semantic.success.light,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.neutral.text.primary,
        marginBottom: 0,
    },
    subtitle: {
        fontSize: 11,
        color: colors.neutral.text.tertiary,
    },
});

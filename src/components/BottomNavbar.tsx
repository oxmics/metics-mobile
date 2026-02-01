import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { CustomNavigationProp } from '../types/common';
import { colors, spacing } from '../theme';

interface props {
    isSupplier?: boolean
}

interface NavItemProps {
    icon: string;
    label: string;
    onPress: () => void;
    isActive?: boolean;
}

const NavItem = ({ icon, label, onPress, isActive }: NavItemProps) => (
    <TouchableOpacity
        onPress={onPress}
        style={styles.navItem}
        activeOpacity={1} // No fade, just instant feeling like native
    >
        <View style={styles.iconContainer}>
            <Icon
                source={isActive ? icon : `${icon}-outline`} // Switch filled variant often better for active
                size={24}
                color={isActive ? colors.primary[500] : colors.neutral.text.tertiary}
            />
        </View>
        <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
);

export const BottomNavbar = ({ isSupplier }: props) => {
    const navigation = useNavigation<CustomNavigationProp>();

    // Simple mock active state logic just for visual proof, ideally uses route name
    // But since this is a prop-driven or manual component in this architecture, we keep simple.

    return (
        <View style={styles.container}>
            <View style={styles.borderTop} />
            <View style={styles.navbar}>
                <NavItem
                    icon="home"
                    label="Home"
                    onPress={() => isSupplier ? navigation.replace('SupplierDashboard') : navigation.replace('BuyerDashboard')}
                    isActive={true} // Hardcoded for demo/dashboard screens usually
                />
                <NavItem
                    icon="file-document"
                    label="RFQs"
                    onPress={() => isSupplier ? navigation.navigate('SupplierRequestHistory') : navigation.navigate('BuyerRfqHistory')}
                />
                <NavItem
                    icon="package-variant-closed"
                    label="Orders"
                    onPress={() => isSupplier ? navigation.navigate('SupplierPurchaseOrder') : navigation.navigate('BuyerPurchaseOrder')}
                />
                <NavItem
                    icon="cog"
                    label="Settings"
                    onPress={() => navigation.navigate('EnterNewPassword')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.neutral.surface.default,
        paddingBottom: spacing.lg, // Safe area padding often needed
    },
    borderTop: {
        height: 1,
        backgroundColor: colors.neutral.border.default,
        width: '100%',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: spacing.md,
        backgroundColor: colors.neutral.surface.default,
    },
    navItem: {
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        marginBottom: 4,
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.neutral.text.tertiary,
    },
    labelActive: {
        color: colors.primary[500],
    },
});

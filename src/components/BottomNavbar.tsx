import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { colors, spacing } from '../theme';



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
                source={icon}
                size={24}
                color={isActive ? colors.primary[500] : colors.neutral.text.tertiary}
            />
        </View>
        <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
);

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export const BottomNavbar = ({ state, descriptors, navigation, isSupplier }: BottomTabBarProps & { isSupplier: boolean }) => {
    return (
        <View style={styles.container}>
            <View style={styles.borderTop} />
            <View style={styles.navbar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            // The `merge: true` option makes sure that the params inside the tab screen are preserved
                            navigation.navigate(route.name, { merge: true });
                        }
                    };

                    let iconName = '';
                    let labelText = '';

                    // Map route names to icons/labels
                    if (route.name === 'SupplierDashboard' || route.name === 'BuyerDashboard') {
                        iconName = 'home';
                        labelText = 'Home';
                    } else if (route.name === 'SupplierRequestHistory' || route.name === 'BuyerRfqHistory') {
                        iconName = 'file-document';
                        labelText = 'RFQs';
                    } else if (route.name === 'SupplierProducts') {
                        iconName = 'package-variant';
                        labelText = 'Products';
                    } else if (route.name === 'SupplierPurchaseOrder' || route.name === 'BuyerPurchaseOrder') {
                        iconName = 'package-variant-closed';
                        labelText = 'Orders';
                    } else if (route.name === 'SupplierClients') {
                        iconName = 'account-group';
                        labelText = 'Clients';
                    } else if (route.name === 'EnterNewPassword') { // Assuming settings route
                        iconName = 'cog';
                        labelText = 'Settings';
                    }

                    return (
                        <NavItem
                            key={index}
                            icon={iconName}
                            label={labelText}
                            onPress={onPress}
                            isActive={isFocused}
                        />
                    );
                })}
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

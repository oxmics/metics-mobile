import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CustomNavigationProp, RootStackParamList } from '../types/common';
import EncryptedStorage from 'react-native-encrypted-storage';
import { colors, spacing, borderRadius } from '../theme';
import { ContactUsModal } from './ContactUsModal';

interface NavItemProps {
    icon: string;
    label: string;
    onPress: () => void;
    isDestructive?: boolean;
    hasSubmenu?: boolean;
    isExpanded?: boolean;
}

interface SubNavItemProps {
    label: string;
    onPress: () => void;
}

const NavItem = ({ icon, label, onPress, isDestructive, hasSubmenu, isExpanded }: NavItemProps) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.itemRow, isDestructive && styles.destructiveRow]}>
            <View style={[styles.iconWrapper, isDestructive && styles.destructiveIcon]}>
                <Icon
                    source={icon}
                    size={20}
                    color={isDestructive ? colors.semantic.error.default : colors.neutral.text.secondary}
                />
            </View>
            <Text style={[styles.itemText, isDestructive && styles.destructiveText]}>
                {label}
            </Text>
            {hasSubmenu ? (
                <Icon
                    source={isExpanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={colors.neutral.text.tertiary}
                />
            ) : !isDestructive && (
                <Icon source="chevron-right" size={18} color={colors.neutral.text.tertiary} />
            )}
        </View>
    </TouchableOpacity>
);

const SubNavItem = ({ label, onPress }: SubNavItemProps) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.subItemRow}>
            <View style={styles.subItemDot} />
            <Text style={styles.subItemText}>{label}</Text>
            <Icon source="chevron-right" size={16} color={colors.neutral.text.tertiary} />
        </View>
    </TouchableOpacity>
);

const CustomDrawer = ({ closeDrawer }: { closeDrawer: () => void }) => {
    const navigation = useNavigation<CustomNavigationProp>();
    const [isProductsExpanded, setIsProductsExpanded] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    const handleNavigation = (screen: string) => {
        navigation.navigate(screen as never);
        closeDrawer();
    };

    const toggleProducts = () => {
        setIsProductsExpanded(!isProductsExpanded);
    };

    const handleLogout = async (screen: keyof RootStackParamList) => {
        navigation.replace(screen);
        await EncryptedStorage.removeItem('jwt-token');
        await EncryptedStorage.removeItem('user_id');
        await EncryptedStorage.removeItem('email');
        closeDrawer();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/images/Metics-blue.png')}
                    resizeMode="contain"
                />
                <TouchableOpacity
                    onPress={closeDrawer}
                    style={styles.closeButton}
                    activeOpacity={0.7}
                >
                    <Icon source="close" size={24} color={colors.neutral.text.secondary} />
                </TouchableOpacity>
            </View>

            {/* User Info */}
            <View style={styles.userSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>S</Text>
                </View>
                <View>
                    <Text style={styles.userName}>Supplier Portal</Text>
                    <Text style={styles.userRole}>Vendor Partner</Text>
                </View>
            </View>

            {/* Navigation */}
            <View style={styles.navSection}>
                <Text style={styles.sectionLabel}>NAVIGATION</Text>
                <NavItem
                    icon="view-dashboard-outline"
                    label="Dashboard"
                    onPress={() => handleNavigation('SupplierDashboard')}
                />
                <NavItem
                    icon="file-document-outline"
                    label="Requests"
                    onPress={() => handleNavigation('SupplierRequestHistory')}
                />
                <NavItem
                    icon="format-list-bulleted"
                    label="My Bids"
                    onPress={() => handleNavigation('SupplierBids')}
                />
                <NavItem
                    icon="package-variant-closed"
                    label="Purchase Orders"
                    onPress={() => handleNavigation('SupplierPurchaseOrder')}
                />
                <NavItem
                    icon="package-variant"
                    label="Products"
                    onPress={toggleProducts}
                    hasSubmenu
                    isExpanded={isProductsExpanded}
                />
                {isProductsExpanded && (
                    <>
                        <SubNavItem
                            label="Product List"
                            onPress={() => handleNavigation('SupplierProducts')}
                        />
                        <SubNavItem
                            label="Enquiries"
                            onPress={() => handleNavigation('SupplierProductEnquiries')}
                        />
                    </>
                )}
            </View>

            {/* Settings */}
            <View style={styles.settingsSection}>
                <Text style={styles.sectionLabel}>SETTINGS</Text>
                <NavItem
                    icon="cog-outline"
                    label="Account Settings"
                    onPress={() => handleNavigation('EnterNewPassword')}
                />
                <NavItem
                    icon="lifebuoy"
                    label="Contact Us"
                    onPress={() => setShowContactModal(true)}
                />
            </View>

            {/* Logout */}
            <View style={styles.logoutSection}>
                <NavItem
                    icon="logout"
                    label="Sign Out"
                    onPress={() => handleLogout('Login')}
                    isDestructive
                />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Metics v1.0.0</Text>
            </View>

            {/* Modals */}
            <ContactUsModal
                visible={showContactModal}
                onDismiss={() => setShowContactModal(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral.surface.default,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    logo: {
        height: 32,
        width: 100,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutral.surface.sunken,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xl,
        backgroundColor: colors.neutral.surface.sunken,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.full,
        backgroundColor: colors.semantic.success.default, // Green for supplier
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    avatarText: {
        color: colors.neutral.text.inverse,
        fontSize: 16,
        fontWeight: '600',
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.neutral.text.primary,
        marginBottom: 2,
    },
    userRole: {
        fontSize: 12,
        color: colors.neutral.text.secondary,
    },
    navSection: {
        paddingTop: spacing.xl,
    },
    settingsSection: {
        paddingTop: spacing.lg,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.neutral.text.tertiary,
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.md,
        letterSpacing: 0.5,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
    },
    destructiveRow: {
        borderRadius: borderRadius.base,
    },
    iconWrapper: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.base,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    destructiveIcon: {
        backgroundColor: 'transparent',
    },
    itemText: {
        flex: 1,
        fontSize: 14,
        color: colors.neutral.text.primary,
        fontWeight: '500',
    },
    destructiveText: {
        color: colors.semantic.error.default,
        fontWeight: '600',
    },
    logoutSection: {
        marginTop: 'auto',
        paddingVertical: spacing.xl,
    },
    footer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xl,
    },
    footerText: {
        fontSize: 11,
        color: colors.neutral.text.tertiary,
        textAlign: 'center',
    },
    subItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm,
        paddingLeft: spacing.xl + 44, // Indent for submenu
    },
    subItemDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.neutral.text.tertiary,
        marginRight: spacing.md,
    },
    subItemText: {
        flex: 1,
        fontSize: 13,
        color: colors.neutral.text.secondary,
        fontWeight: '400',
    },
});

export default CustomDrawer;

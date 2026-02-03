import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Icon, ActivityIndicator, TextInput, Button, Switch } from 'react-native-paper';
import { useState, useEffect } from 'react';
import useSupplierProductDetails from '../../api/products/useSupplierProductDetails';
import useSupplierProducts from '../../api/products/useSupplierProducts';
import { RootStackParamList } from '../../types/common';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { CustomDialog } from '../../components/CustomDialog';

type ScreenRouteProp = RouteProp<RootStackParamList, 'SupplierProductEdit'>;

const SupplierProductEditScreen = () => {
    const route = useRoute<ScreenRouteProp>();
    const navigation = useNavigation();
    const { id } = route.params;

    const { data: product, isPending: loading } = useSupplierProductDetails(id);
    const { editProduct } = useSupplierProducts();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [marketPrice, setMarketPrice] = useState('');
    const [listPrice, setListPrice] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);

    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setMarketPrice(product.market_price);
            setListPrice(product.list_price_per_unit);
            setIsAvailable(product.is_available);
        }
    }, [product]);

    const handleSave = () => {
        if (!name.trim()) {
            setShowValidationDialog(true);
            return;
        }

        editProduct.mutate(
            {
                id,
                data: {
                    name,
                    description,
                    market_price: marketPrice,
                    list_price_per_unit: listPrice,
                    is_available: isAvailable,
                },
            },
            {
                onSuccess: () => {
                    setShowSuccessDialog(true);
                },
                onError: () => {
                    setShowErrorDialog(true);
                },
            }
        );
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

    return (
        <ErrorBoundary name="SupplierProductEditScreen">
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: spacing.md }}>
                        <Icon source="arrow-left" size={24} color={colors.neutral.text.secondary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Product</Text>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <TextInput
                        label="Product Name"
                        value={name}
                        onChangeText={setName}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        style={styles.input}
                    />

                    <TextInput
                        label="Market Price"
                        value={marketPrice}
                        onChangeText={setMarketPrice}
                        mode="outlined"
                        keyboardType="decimal-pad"
                        style={styles.input}
                    />

                    <TextInput
                        label="List Price per Unit"
                        value={listPrice}
                        onChangeText={setListPrice}
                        mode="outlined"
                        keyboardType="decimal-pad"
                        style={styles.input}
                    />

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Available</Text>
                        <Switch value={isAvailable} onValueChange={setIsAvailable} />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        style={styles.button}
                    >
                        Cancel
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handleSave}
                        buttonColor={colors.primary[500]}
                        style={styles.button}
                        loading={editProduct.isPending}
                    >
                        Save
                    </Button>
                </View>

                {/* Dialogs */}
                <CustomDialog
                    visible={showValidationDialog}
                    title="Validation Error"
                    message="Product name is required"
                    onDismiss={() => setShowValidationDialog(false)}
                    confirmText="OK"
                    isDestructive
                />
                <CustomDialog
                    visible={showSuccessDialog}
                    title="Success"
                    message="Product updated successfully"
                    onDismiss={handleSuccessClose}
                    confirmText="OK"
                />
                <CustomDialog
                    visible={showErrorDialog}
                    title="Error"
                    message="Failed to update product"
                    onDismiss={() => setShowErrorDialog(false)}
                    confirmText="OK"
                    isDestructive
                />
            </View>
        </ErrorBoundary>
    );
};

export default SupplierProductEditScreen;

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
    input: {
        marginBottom: spacing.md,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    switchLabel: {
        ...typography.styles.body,
        fontWeight: '500',
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.border.default,
        flexDirection: 'row',
        gap: spacing.md,
    },
    button: {
        flex: 1,
    },
});

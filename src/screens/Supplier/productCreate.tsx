import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Icon, ActivityIndicator, TextInput, Switch } from 'react-native-paper';
import { useState } from 'react';
import useSupplierProducts from '../../api/products/useSupplierProducts';
import useProductCategories, { useProductSubCategories } from '../../api/products/useProductCategories';
import { RootStackParamList } from '../../types/common';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { CustomDialog } from '../../components/CustomDialog';
import { CustomDropdown } from '../../components/CustomDropdown';
import GradientButton from '../../components/GradientButton';

type ScreenRouteProp = RouteProp<RootStackParamList, 'SupplierProductCreate'>;

const SupplierProductCreateScreen = () => {
    const navigation = useNavigation();

    const { createProduct } = useSupplierProducts();
    const { data: categories, isPending: loadingCategories } = useProductCategories();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [selectedSubCategorySlug, setSelectedSubCategorySlug] = useState<string>('');
    const [marketPrice, setMarketPrice] = useState('');
    const [listPrice, setListPrice] = useState('');
    const [unitOfIssue, setUnitOfIssue] = useState('EA');
    const [baseItemId, setBaseItemId] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    const [showInCatalogue, setShowInCatalogue] = useState(true);
    const [isInventoryItem, setIsInventoryItem] = useState(true);

    const { data: subCategories, isPending: loadingSubCategories } = useProductSubCategories(selectedCategorySlug);

    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    const handleCreate = () => {
        // Validation
        if (!name.trim()) {
            setValidationMessage('Product name is required');
            setShowValidationDialog(true);
            return;
        }
        if (!selectedSubCategorySlug) {
            setValidationMessage('Product subcategory is required');
            setShowValidationDialog(true);
            return;
        }
        if (!marketPrice.trim()) {
            setValidationMessage('Market price is required');
            setShowValidationDialog(true);
            return;
        }
        if (!listPrice.trim()) {
            setValidationMessage('List price is required');
            setShowValidationDialog(true);
            return;
        }

        const productData = {
            name,
            description,
            product_sub_category: selectedSubCategorySlug,
            market_price: marketPrice,
            list_price_per_unit: listPrice,
            unit_of_issue: unitOfIssue,
            base_item_id: baseItemId || undefined,
            is_available: isAvailable,
            show_in_catalogue: showInCatalogue,
            is_inventory_item: isInventoryItem,
            additional_attributes: [],
            images: [],
            documents: [],
        };

        console.log('Creating product with data:', productData);

        createProduct.mutate(
            productData,
            {
                onSuccess: (data) => {
                    console.log('Product created successfully:', data);
                    setShowSuccessDialog(true);
                },
                onError: (error: any) => {
                    console.error('Failed to create product:', error);
                    console.error('Error response:', error.response?.data);
                    console.error('Error status:', error.response?.status);
                    setShowErrorDialog(true);
                },
            }
        );
    };

    const handleSuccessClose = () => {
        setShowSuccessDialog(false);
        navigation.goBack();
    };

    return (
        <ErrorBoundary name="SupplierProductCreateScreen">
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: spacing.md }}>
                        <Icon source="arrow-left" size={24} color={colors.neutral.text.secondary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Product</Text>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <TextInput
                        label="Product Name *"
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

                    {/* Category Dropdown */}
                    <CustomDropdown
                        label="Category *"
                        placeholder="Select Category"
                        value={selectedCategorySlug}
                        options={(categories || []).map(cat => ({ label: cat.name, value: cat.slug }))}
                        onSelect={(value, label) => {
                            setSelectedCategory(label);
                            setSelectedCategorySlug(value);
                            setSelectedSubCategory('');
                            setSelectedSubCategorySlug('');
                        }}
                        loading={loadingCategories}
                    />

                    {/* Subcategory Dropdown */}
                    <CustomDropdown
                        label="Subcategory *"
                        placeholder="Select Subcategory"
                        value={selectedSubCategorySlug}
                        options={(subCategories || []).map(subCat => ({ label: subCat.name, value: subCat.slug }))}
                        onSelect={(value, label) => {
                            setSelectedSubCategory(label);
                            setSelectedSubCategorySlug(value);
                        }}
                        disabled={!selectedCategorySlug}
                        loading={loadingSubCategories}
                    />

                    <TextInput
                        label="Market Price *"
                        value={marketPrice}
                        onChangeText={setMarketPrice}
                        mode="outlined"
                        keyboardType="decimal-pad"
                        style={styles.input}
                    />

                    <TextInput
                        label="List Price per Unit *"
                        value={listPrice}
                        onChangeText={setListPrice}
                        mode="outlined"
                        keyboardType="decimal-pad"
                        style={styles.input}
                    />

                    <TextInput
                        label="Unit of Issue"
                        value={unitOfIssue}
                        onChangeText={setUnitOfIssue}
                        mode="outlined"
                        style={styles.input}
                        placeholder="EA, KG, L, etc."
                    />

                    <TextInput
                        label="Base Item ID"
                        value={baseItemId}
                        onChangeText={setBaseItemId}
                        mode="outlined"
                        style={styles.input}
                        placeholder="Optional SKU or item code"
                    />

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Available</Text>
                        <Switch value={isAvailable} onValueChange={setIsAvailable} />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Show in Catalogue</Text>
                        <Switch value={showInCatalogue} onValueChange={setShowInCatalogue} />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Inventory Item</Text>
                        <Switch value={isInventoryItem} onValueChange={setIsInventoryItem} />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <GradientButton
                        label="Cancel"
                        onPress={() => navigation.goBack()}
                        variant="outline"
                    />
                    <GradientButton
                        label="Create Product"
                        onPress={handleCreate}
                        loading={createProduct.isPending}
                    />
                </View>

                {/* Dialogs */}
                <CustomDialog
                    visible={showValidationDialog}
                    title="Validation Error"
                    message={validationMessage}
                    onDismiss={() => setShowValidationDialog(false)}
                    confirmText="OK"
                    isDestructive
                />
                <CustomDialog
                    visible={showSuccessDialog}
                    title="Success"
                    message="Product created successfully"
                    onDismiss={handleSuccessClose}
                    confirmText="OK"
                />
                <CustomDialog
                    visible={showErrorDialog}
                    title="Error"
                    message="Failed to create product. Please check all required fields."
                    onDismiss={() => setShowErrorDialog(false)}
                    confirmText="OK"
                    isDestructive
                />
            </View>
        </ErrorBoundary>
    );
};

export default SupplierProductCreateScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral.surface.default,
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
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.border.default,
        gap: spacing.sm,
    },
});

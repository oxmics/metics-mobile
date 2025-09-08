import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Icon, Searchbar, Text, useTheme } from "react-native-paper";
import { CustomNavigationProp } from "../../types/common";
import { useEffect, useState, useContext } from "react";
import { DataCard } from "../../components/DataCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { PurchaseOrderStatusType } from "../../types/purchaseOrder";
import usePurchaseOrderStatus from "../../api/purchase order/usePurchaseOrderStatus";
import { DataCountCard } from "../../components/DataCountCard";
import useDebounce from "../../hooks/useDebounce";
import { BottomNavbar } from "../../components/BottomNavbar";
import { ThemeContext } from "../../themes/ThemeContext";

const SupplierPurchaseOrderScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const {data: purchaseOrders, isPending: loading, refetch} = usePurchaseOrderStatus();
    const { theme } = useContext(ThemeContext);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [displayOrders, setDisplayOrders] = useState<PurchaseOrderStatusType[]>([]);
    
    const debouncedSearchQuery = useDebounce(searchQuery, 800);

    useEffect(() => {
        if(purchaseOrders) {
            setDisplayOrders(purchaseOrders);
        }
    }, [purchaseOrders])


    // TODO: Export to CSV button
    const handleSearch = () => {
        if (searchQuery.length > 0) {
            let tempOrders = purchaseOrders?.filter((order) => order.document_num.includes(searchQuery));
            if (tempOrders){
                setDisplayOrders(tempOrders)
            }
        }else{
            if(purchaseOrders) {
                setDisplayOrders(purchaseOrders)
            }
        }
    }

    useEffect(() => {
            handleSearch();
    }, [debouncedSearchQuery])

    const styles = getStyles(theme);

    return (
        <View style={{position: 'relative', flex: 1, backgroundColor: theme.colors.background}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.replace("SupplierDashboard")}>
                        <Icon size={20} source={"arrow-left"} color={theme.colors.text}/>
                    </TouchableOpacity>
                    <Text style={styles.title}>Purchase Order</Text>
                </View>
                <DataCountCard count={purchaseOrders ? purchaseOrders.length: 0} title="All" icon="abacus"/>
                <View style={styles.filterBar}>
                    <Button mode="contained" onPress={() => console.log("Export CSV")} style={styles.exportBtn} labelStyle={{color: "#FFFFFF", minHeight: 0}} buttonColor="#000000">Export CSV</Button>
                    <Searchbar
                        mode="bar"
                        placeholder="Search"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchbar}
                        iconColor={theme.colors.placeholder}
                        inputStyle={{color: theme.colors.text, minHeight: 0,}}
                        placeholderTextColor={theme.colors.placeholder}
                        cursorColor={theme.colors.primary}
                        textAlign="left"
                        selectTextOnFocus
                        onClearIconPress={()=>setSearchQuery("")}
                    />
                </View>
                <SafeAreaView style={{flex: 1}}>
                    <FlatList
                        data={displayOrders}
                        renderItem={({item}) => <TouchableOpacity onPress={()=> navigation.push('SupplierPurchaseOrderDetails', {orderId: item.id})}><DataCard title={item.document_num} titleLabel="Document Number" status={item.int_status == 0 ? "PENDING" : item.int_status == -1 ? "REJECTED": "APPROVED"} footerLeftText={item.buyer_organisation_details.name} footerRightText={item.total_price}/></TouchableOpacity>}
                        keyExtractor={(item: PurchaseOrderStatusType) => item.id}
                        refreshing={loading}
                        onRefresh={() => refetch()}
                    />
                </SafeAreaView>
            </View>
            <BottomNavbar isSupplier/>
        </View>
    );
}

export default SupplierPurchaseOrderScreen;

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: theme.colors.background,
        marginBottom: 80
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 4,
        paddingVertical: 20
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        color: theme.colors.text
    },
    filterBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 24
    },
    exportBtn: {
        borderRadius: 5,
        height: 40
    },
    searchbar: {
        width: '50%',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.placeholder,
        height: 40
    }
});
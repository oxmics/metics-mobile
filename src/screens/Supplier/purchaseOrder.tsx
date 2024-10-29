import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Icon, Searchbar, Text } from "react-native-paper";
import { CustomNavigationProp } from "../../types/common";
import { useEffect, useState } from "react";
import { DataCard } from "../../components/DataCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { PurchaseOrderStatusType } from "../../types/purchaseOrder";
import usePurchaseOrderStatus from "../../api/purchase order/usePurchaseOrderStatus";
import { DataCountCard } from "../../components/DataCountCard";
import useDebounce from "../../hooks/useDebounce";
import { BottomNavbar } from "../../components/BottomNavbar";

const SupplierPurchaseOrderScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const {data: purchaseOrders, isPending: loading, refetch} = usePurchaseOrderStatus();

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

    return (
        <View style={{position: 'relative', flex: 1, backgroundColor: '#FFFFFF'}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.replace("SupplierDashboard")}>
                        <Icon size={20} source={"arrow-left"} color="#000000"/>
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
                        iconColor="#0000004D"
                        inputStyle={{color: '#000000', minHeight: 0,}}
                        placeholderTextColor={"#00000080"}
                        cursorColor={"#000000"}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: '#FFFFFF',
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
        color: '#000000'
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
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#0000004D',
        height: 40
    }
});
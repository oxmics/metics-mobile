import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import { CustomNavigationProp } from "../../types/common";
import { Icon, Searchbar, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuctionHeaders from "../../api/auctions/useAuctionHeaders";
import { AuctionType } from "../../types/auction";
import useDebounce from "../../hooks/useDebounce";
import { DataCard } from "../../components/DataCard";
import { formatDate } from "../../utils/helper";
import { Tabs, TabScreen, TabsProvider } from "react-native-paper-tabs";

const SupplierRequestHistory = () => {
    const navigation = useNavigation<CustomNavigationProp>();

    const {data: auctions, isPending: loading, refetch} = useAuctionHeaders();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [displayClosedAuctions, setDisplayClosedAuctions] = useState<AuctionType[]>([]);
    const [displayOpenAuctions, setDisplayOpenAuctions] = useState<AuctionType[]>([]);

    const debouncedSearchQuery = useDebounce(searchQuery, 800);

    useEffect(() => {
        if(auctions) {
            setDisplayOpenAuctions(auctions.open_auctions);
            setDisplayClosedAuctions(auctions.closed_auctions);
        }
    }, [auctions])

    const handleSearch = () => {
        if (searchQuery.length > 0) {
            let tempOpenAuctions = auctions?.open_auctions?.filter((order) => order.requisition_number.includes(searchQuery));
            let tempClosedAuctions = auctions?.closed_auctions?.filter((order) => order.requisition_number.includes(searchQuery));

            if (tempOpenAuctions){
                setDisplayOpenAuctions(tempOpenAuctions)
            }
            if (tempClosedAuctions){
                setDisplayClosedAuctions(tempClosedAuctions)
            }
        }else{
            if(auctions) {
                setDisplayOpenAuctions(auctions.open_auctions);
                setDisplayClosedAuctions(auctions.closed_auctions);
            }
        }
    }

    useEffect(() => {
            handleSearch();
    }, [debouncedSearchQuery])

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.replace("SupplierDashboard")}>
                    <Icon size={20} source={"arrow-left"} color="#000000"/>
                </TouchableOpacity>
                <Text style={styles.title}>Request History</Text>
            </View>
            <TabsProvider defaultIndex={0}>
                <Tabs mode="fixed" tabLabelStyle={{color:"#000000", fontSize: 15, fontWeight: 400}} style={{backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: '#0000004D', marginHorizontal: -20}} theme={{colors: {primary: '#000000CC'}}}>
                    <TabScreen label="All">
                        <View style={styles.container}>
                            {(displayClosedAuctions.length + displayOpenAuctions.length) > 0 && <View style={styles.filterBar}>
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
                            </View>}
                            <SafeAreaView style={{flex: 1}}>
                                <FlatList
                                    data={[...displayOpenAuctions, ...displayClosedAuctions]}
                                    renderItem={({item}) => <TouchableOpacity onPress={()=> navigation.push('SupplierRequestDetails', {reqId: item.id})}><DataCard title={item.requisition_number} titleLabel="Reference Number" status={item.is_open ? "OPEN" : "CLOSED"} footerLeftText={item.organization_name} footerRightText={formatDate(item.need_by_date)}/></TouchableOpacity>}
                                    keyExtractor={(item: AuctionType) => item.id}
                                    refreshing={loading}
                                    onRefresh={() => refetch()}
                                />
                            </SafeAreaView>
                        </View>
                    </TabScreen>
                    <TabScreen label="Open">
                        <View style={styles.container}>
                            {displayOpenAuctions.length > 0 && <View style={styles.filterBar}>
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
                            </View>}
                            <SafeAreaView style={{flex: 1}}>
                                <FlatList
                                    data={displayOpenAuctions}
                                    renderItem={({item}) => <TouchableOpacity onPress={()=> navigation.push('SupplierRequestDetails', {reqId: item.id})}><DataCard title={item.requisition_number} titleLabel="Reference Number" status={item.is_open ? "OPEN" : "CLOSED"} footerLeftText={item.organization_name} footerRightText={formatDate(item.need_by_date)}/></TouchableOpacity>}
                                    keyExtractor={(item: AuctionType) => item.id}
                                    refreshing={loading}
                                    onRefresh={() => refetch()}
                                />
                            </SafeAreaView>
                        </View>
                    </TabScreen>
                    <TabScreen label="Closed">
                        <View style={styles.container}>
                            {displayClosedAuctions.length > 0 && <View style={styles.filterBar}>
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
                            </View>}
                            <SafeAreaView style={{flex: 1}}>
                                <FlatList
                                    data={displayClosedAuctions}
                                    renderItem={({item}) => <TouchableOpacity onPress={()=> navigation.push('SupplierRequestDetails', {reqId: item.id})}><DataCard title={item.requisition_number} titleLabel="Reference Number" status={item.is_open ? "OPEN" : "CLOSED"} footerLeftText={item.organization_name} footerRightText={formatDate(item.need_by_date)}/></TouchableOpacity>}
                                    keyExtractor={(item: AuctionType) => item.id}
                                    refreshing={loading}
                                    onRefresh={() => refetch()}
                                />
                            </SafeAreaView>
                        </View>
                    </TabScreen>
                </Tabs>
            </TabsProvider>
    </View>
    )
}

export default SupplierRequestHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: '#FFFFFF'
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
        fontWeight: 500,
        color: '#000000'
    },
    filterBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 12
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
import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import { CustomNavigationProp } from "../../types/common";
import { Button, Icon, Searchbar, Text, useTheme } from "react-native-paper";
import { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuctionHeaders from "../../api/auctions/useAuctionHeaders";
import { AuctionType } from "../../types/auction";
import useDebounce from "../../hooks/useDebounce";
import { DataCard } from "../../components/DataCard";
import { formatDate } from "../../utils/helper";
import { Tabs, TabScreen, TabsProvider } from "react-native-paper-tabs";
import { BottomNavbar } from "../../components/BottomNavbar";
import { ThemeContext } from "../../themes/ThemeContext";

const SupplierRequestHistory = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { theme } = useContext(ThemeContext);

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

    const styles = getStyles(theme);

    return(
        <View style={{flex: 1, position: 'relative', backgroundColor: theme.colors.background}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.replace("SupplierDashboard")}>
                        <Icon size={20} source={"arrow-left"} color={theme.colors.text}/>
                    </TouchableOpacity>
                    <Text style={styles.title}>Request History</Text>
                </View>
                <TabsProvider defaultIndex={0}>
                    <Tabs mode="fixed" tabLabelStyle={{color:theme.colors.text, fontSize: 15, fontWeight: '400'}} style={{backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.placeholder, marginHorizontal: -20}} theme={{colors: {primary: theme.colors.primary}}}>
                        <TabScreen label="All">
                            <View style={styles.container}>
                                {(displayClosedAuctions.length + displayOpenAuctions.length) > 0 && <View style={styles.filterBar}>
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
                                        iconColor={theme.colors.placeholder}
                                        inputStyle={{color: theme.colors.text, minHeight: 0,}}
                                        placeholderTextColor={theme.colors.placeholder}
                                        cursorColor={theme.colors.primary}
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
                                        iconColor={theme.colors.placeholder}
                                        inputStyle={{color: theme.colors.text, minHeight: 0,}}
                                        placeholderTextColor={theme.colors.placeholder}
                                        cursorColor={theme.colors.primary}
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
        <BottomNavbar isSupplier/>
    </View>
    )
}

export default SupplierRequestHistory;

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: theme.colors.background,
        marginBottom: 20
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
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.placeholder,
        height: 40
    }
});
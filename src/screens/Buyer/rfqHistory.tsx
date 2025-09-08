import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import { CustomNavigationProp } from "../../types/common";
import { Button, Icon, Searchbar, Text, useTheme } from "react-native-paper";
import { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuctionType } from "../../types/auction";
import useDebounce from "../../hooks/useDebounce";
import { DataCard } from "../../components/DataCard";
import { formatDate } from "../../utils/helper";
import { Tabs, TabScreen, TabsProvider } from "react-native-paper-tabs";
import useMyAuctions from "../../api/auctions/useMyAuctions";
import { BottomNavbar } from "../../components/BottomNavbar";
import { ThemeContext } from "../../themes/ThemeContext";

const BuyerRfqHistoryScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { theme } = useContext(ThemeContext);

    const [auctions, setAuctions] = useState<AuctionType[]>([]);
    const [count, setCount] = useState<number>(0);
    const [pageCount, setPageCount] = useState<number>(1);

    const {data, isPending: loading, refetch} = useMyAuctions({page: pageCount});

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [displayInProgress, setDisplayInProgress] = useState<AuctionType[]>([]);
    const [displayDraft, setDisplayDraft] = useState<AuctionType[]>([]);
    const [displayCompleted, setDisplayCompleted] = useState<AuctionType[]>([]);

    useEffect(() => {
        if(data){
            setAuctions(data.results);
            setCount(data.count);
        }
    }, [data]);

    const debouncedSearchQuery = useDebounce(searchQuery, 800);

    const handleDisplayAuctions = () => {
        if(auctions) {
            let inProgress: AuctionType[] = [];
            let drafts: AuctionType[] = [];
            let completed: AuctionType[] = [];
            auctions.map((auction) => {
                if(auction.status === "In-Progress") {
                    inProgress.push(auction);
                }else if (auction.status === "Draft" || auction.status === "draft") {
                    drafts.push(auction);
                }else{
                    completed.push(auction);
                }
            })
            setDisplayInProgress(inProgress);
            setDisplayDraft(drafts);
            setDisplayCompleted(completed)
        }
    }

    useEffect(() => {
        handleDisplayAuctions();
    }, [auctions])

    const handleSearch = () => {
        if (searchQuery.length > 0) {
            let tempInProgress= auctions?.filter((auction) => auction.status==="In-Progress" && auction.requisition_number.includes(searchQuery));
            let tempDraft = auctions?.filter((auction) => (auction.status === "Draft" || auction.status === "draft") && auction.requisition_number.includes(searchQuery));
            let tempCompleted = auctions?.filter((auction) =>(auction.status === "Completed" || auction.status === "completed") && auction.requisition_number.includes(searchQuery));

            if (tempInProgress){
                setDisplayInProgress(tempInProgress);
            }
            if (tempDraft){
                setDisplayDraft(tempDraft);
            }
            if (tempCompleted) {
                setDisplayCompleted(tempCompleted);
            }
        }else{
            handleDisplayAuctions();
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
                    <TouchableOpacity onPress={() => navigation.replace("BuyerDashboard")}>
                        <Icon size={20} source={"arrow-left"} color={theme.colors.text}/>
                    </TouchableOpacity>
                    <Text style={styles.title}>RFQ History</Text>
                </View>
                <TabsProvider defaultIndex={0}>
                    <Tabs mode="fixed" tabLabelStyle={{color: theme.colors.text, fontSize: 12, fontWeight: '400'}} style={{backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.placeholder, marginHorizontal: -20}} theme={{colors: {primary: theme.colors.primary}}}>
                        <TabScreen label="All">
                            <View style={styles.container}>
                                {(displayCompleted.length + displayDraft.length + displayInProgress.length) > 0 && <View style={styles.filterBar}>
                                    <View style={{display: 'flex', flexDirection: 'row', gap: 4}}>
                                        <Button mode="text" icon={"chevron-left"} disabled={pageCount==1} onPress={() => setPageCount(pageCount-1)}> </Button>
                                        <Button mode="text" icon={"chevron-right"} disabled={((pageCount)*10) >= count} onPress={() => setPageCount(pageCount+1)}> </Button>
                                    </View>
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
                                        data={[...displayInProgress, ...displayDraft, ...displayCompleted]}
                                        renderItem={({item}) => <TouchableOpacity onPress={()=> navigation.push('BuyerRfqDetails', {reqId: item.id})}><DataCard title={item.requisition_number} titleLabel="Reference Number" status={item.status === "In-Progress" ? "IN-PROGRESS" : item.status === "draft" ? "DRAFT" : "COMPLETED"} footerLeftText={item.organization_name} footerRightText={formatDate(item.need_by_date)}/></TouchableOpacity>}
                                        keyExtractor={(item: AuctionType) => item.id}
                                        refreshing={loading}
                                        onRefresh={() => refetch()}
                                    />
                                </SafeAreaView>
                            </View>
                        </TabScreen>
                        <TabScreen label="In-Progress">
                            <View style={styles.container}>
                                {displayInProgress.length > 0 && <View style={styles.filterBar}>
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
                                        data={displayInProgress}
                                        renderItem={({item}) => <TouchableOpacity onPress={()=> navigation.push('BuyerRfqDetails', {reqId: item.id})}><DataCard title={item.requisition_number} titleLabel="Reference Number" status={"IN-PROGRESS"} footerLeftText={item.organization_name} footerRightText={formatDate(item.need_by_date)}/></TouchableOpacity>}
                                        keyExtractor={(item: AuctionType) => item.id}
                                        refreshing={loading}
                                        onRefresh={() => refetch()}
                                    />
                                </SafeAreaView>
                            </View>
                        </TabScreen>
                        <TabScreen label="Draft">
                            <View style={styles.container}>
                                {displayDraft.length > 0 && <View style={styles.filterBar}>
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
                                        data={displayDraft}
                                        renderItem={({item}) => <TouchableOpacity onPress={()=> navigation.push('BuyerRfqDetails', {reqId: item.id})}><DataCard title={item.requisition_number} titleLabel="Reference Number" status={"DRAFT"} footerLeftText={item.organization_name} footerRightText={formatDate(item.need_by_date)}/></TouchableOpacity>}
                                        keyExtractor={(item: AuctionType) => item.id}
                                        refreshing={loading}
                                        onRefresh={() => refetch()}
                                    />
                                </SafeAreaView>
                            </View>
                        </TabScreen>
                        <TabScreen label="Completed">
                            <View style={styles.container}>
                                {displayCompleted.length > 0 && <View style={styles.filterBar}>
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
                                        data={displayCompleted}
                                        renderItem={({item}) => <TouchableOpacity onPress={()=> navigation.push('BuyerRfqDetails', {reqId: item.id})}><DataCard title={item.requisition_number} titleLabel="Reference Number" status={"COMPLETED"} footerLeftText={item.organization_name} footerRightText={formatDate(item.need_by_date)}/></TouchableOpacity>}
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
        <BottomNavbar/>
    </View>
    )
}

export default BuyerRfqHistoryScreen;

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
        justifyContent: 'space-between',
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
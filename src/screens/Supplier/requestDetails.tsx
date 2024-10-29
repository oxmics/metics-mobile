import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Icon, Portal, Text } from "react-native-paper";
import { CustomNavigationProp } from "../../types/common";
import { InfoCard } from "../../components/InfoCard";
import { useEffect, useMemo, useState } from "react";
import { formatDate, formatDateReverse } from "../../utils/helper";
import { BidModal } from "../../components/Modal";
import useAuctionDetails from "../../api/auctions/useAuction";
import useAuctionLines from "../../api/auctions/useAuctionLineHeader";
import useComments from "../../api/auctions/useComments";
import useCreateComment from "../../api/auctions/useCreateComment";
import { RequestInfoCard } from "../../components/RequestCard";
import { CommentCard } from "../../components/CommentCard";
import { QuoteContainer } from "../../components/QuoteContainer";
import useTemplates from "../../api/templates/useTemplates";
import { TemplateType } from "../../types/template";
import { TemplatesCard } from "../../components/TemplatesCard";
import { TemplateEditCard } from "../../components/TemplateEditCard";
import useUpdateTemplateDescription from "../../api/templates/useUpdateTemplateDescription";
import { NoteCard } from "../../components/NoteCard";
import { QuoteModal } from "../../components/QuoteModal";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { AttachmentsCard } from "../../components/AttachmentsCard";
import { AttachmentType } from "../../types/purchaseOrder";
import useCreateBid from "../../api/auctions/useCreateBid";
import useAuctionIgnore from "../../api/auctions/useAuctionIgnore";
import { BottomNavbar } from "../../components/BottomNavbar";

type RootStackParamList = {
    SupplierRequestDetailsScreen: {
      reqId: string;
    };
};

const SupplierRequestDetailsScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'SupplierRequestDetailsScreen'>>();
    const {reqId} = route.params;
    
    const navigation = useNavigation<CustomNavigationProp>();

    const [statusLoading, setStatusLoading] = useState<0|1|2>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showEditTemplate, setShowEditTemplate] = useState<boolean>(false);

    const [noteToSupplier, setNoteToSupplier] = useState<string>("");
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>();
    const [promisedDate, setPromisedDate] = useState<CalendarDate>();
    const [promisedPrice, setPromisedPrice] = useState<string>("");

    const {data: auction, isPending: loading, refetch} = useAuctionDetails({id: reqId});
    const {data: auctionLines, isPending: linesLoading, refetch: refetchLines} = useAuctionLines({id: reqId});
    const {data: comments, isPending: commentsLoading, refetch: refetchComments} = useComments({id: reqId});
    const {data: templates, isPending: templatesLoading, refetch: refetchTemplates} = useTemplates();
    const {mutateAsync: createComment, isPending: sendingComments} = useCreateComment();
    const {mutateAsync: updateDescription, isPending: updatingDescription} = useUpdateTemplateDescription();
    const {mutateAsync: bid, isPending: sendingBidUpdate} = useCreateBid();
    const {mutateAsync: ignore, isPending: sendingBidIgnore} = useAuctionIgnore();

    const handleStatusUpdate = (status: string) => {
        if(status === "Bid") {
            setStatusLoading(1)
            let tempBidLine: any = auctionLines && auctionLines[0];
            if(auctionLines && auctionLines[0] && tempBidLine){
                tempBidLine['price'] = promisedPrice;
                tempBidLine['promised_date'] = promisedDate ? formatDateReverse(promisedDate?.toISOString()): ""
            }
            bid({
                id: reqId,
                lst_bid_line: JSON.stringify(tempBidLine ? tempBidLine: []),
                note_to_supplier: noteToSupplier,
                template_data: JSON.stringify(selectedTemplate)
            }).then((res) => {setStatusLoading(0); navigation.navigate('SupplierRequestHistory')})   
        }else{
            setStatusLoading(2)
            ignore({id: reqId}).then((res) => {setStatusLoading(0); navigation.navigate('SupplierRequestHistory')})
        }     
    }

    const requestedByDetails = useMemo(() => {
        if(auction) {
            return {
                Title: auction.title,
                'Reference Number': auction.requisition_number,
                'Contract Type': auction.is_open ? "OPEN":  "CLOSED"
            }
        }
    }, [auction])

    const attachmentsDetails = useMemo(() => {
        if (auctionLines) {
            let attachments: AttachmentType[] = [];
            auctionLines.map((auctionLine) => {
                auctionLine.attachments.map((item) => attachments.push(item))
            })
            return attachments
        }else{
            return [];
        }
    }, [auctionLines]);
    

    const quoteDetails = useMemo(() => {
        if (auctionLines) {
            let lines: any[] = [];
            auctionLines.map((item, index) => {
                lines.push({
                    Name: item.product_name,
                    Quantity: item.quantity,
                    Brand: item.brand,
                    'Target Price': item.target_price,
                    'Created At': formatDate(item.created_at),
                    'Promised Price': promisedPrice ? promisedPrice : '',
                    'Promised Date': promisedDate ? formatDate(promisedDate.toISOString()) : '' 
                });
            })
            return lines
        }else{
            return [];
        }
    }, [auctionLines, promisedDate, promisedPrice])

    const handleShowModal= () => {
        setShowModal(true)
    };

    const handleHideModal = () => {
        setShowModal(false)
    }

    const handleComment = (value: string) => {
        createComment({id: reqId, message: value}).then((res) => {
            refetchComments();
        })
    }

    const handleTemplateSelection = (template: TemplateType|undefined) => {
        setSelectedTemplate(template);
        setShowEditTemplate(true);
    }

    const handleUpdateTemplateDescription = (id:string, value: string) => {
        updateDescription({id: id, display_description: value}).then((res) => {
            refetchTemplates();
            setShowEditTemplate(false);
        });
    }

    return(
        <View style={{position: 'relative', flex: 1, backgroundColor: '#FFFFFF'}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.replace("SupplierRequestHistory")}>
                        <Icon size={20} source={"arrow-left"} color="#000000"/>
                    </TouchableOpacity>
                    <Text style={styles.title}>Details</Text>
                </View>
                {(!loading && auction) ? <ScrollView>
                    <View style={styles.statusContainer}>
                        <Text style={styles.orderStatusLabel}>Request</Text>
                        <View style={styles.statusValueContainer}>
                            <Button style={styles.approveBtn} labelStyle={styles.statusBtnText} disabled={sendingBidUpdate} loading={statusLoading === 1} onPress={() => handleStatusUpdate("Bid")}>
                                Bid
                            </Button>
                            <Button style={styles.rejectBtn} labelStyle={styles.statusBtnText} disabled={sendingBidUpdate} loading={statusLoading === 2} onPress={() => handleStatusUpdate("Ignore")}>
                                Ignore
                            </Button>
                        </View>
                    </View>
                    <View style={styles.cardContainer}>
                        <RequestInfoCard title={auction.title} contentData={requestedByDetails} organization_name={auction.organization_name} date={auction.created_at}/>
                        {attachmentsDetails.length > 0 && <AttachmentsCard title="Attachments" contentData={attachmentsDetails}/>}
                        <TemplatesCard title="Payment Templates" contentData={templates} selectedTemplate={selectedTemplate} setSelectedTemplate={handleTemplateSelection}/>
                        {selectedTemplate && showEditTemplate && <TemplateEditCard title={selectedTemplate.name} contentData={selectedTemplate} closeFn={()=>setShowEditTemplate(false)} saveFn={handleUpdateTemplateDescription} saving={updatingDescription}/>}
                        <NoteCard title="Note to Supplier" content={noteToSupplier} setContent={setNoteToSupplier}/>
                        <CommentCard comments={comments} buttonFn={handleComment} loading={sendingComments || commentsLoading}/>
                        {quoteDetails && quoteDetails?.length > 0 && <QuoteContainer contentData={quoteDetails[0]} buttonFn={handleShowModal} footerButtonAvailable={true}/>}
                    </View>
                </ScrollView>: <View style={styles.loadingContainer}><ActivityIndicator animating={true} size={"large"} color="#000000"/></View>}
                <Portal>
                    <QuoteModal closeModal={handleHideModal} show={showModal} date={promisedDate} price={promisedPrice} setDate={setPromisedDate} setPrice={setPromisedPrice}/>
                </Portal>
            </View>
            <BottomNavbar isSupplier/>
        </View>
    )
}

export default SupplierRequestDetailsScreen;

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
    cardContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 24,
        paddingTop: 16,
        marginBottom: 16,
    },
    statusContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderStatusLabel: {
        fontSize: 20,
        fontWeight: '400',
        color: '#000000E5',
        marginLeft: 12
    },
    statusValueContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10
    },
    pendingStatus: {
        fontSize: 12,
        fontWeight: '400',
        color: '#F7A64F'
    },
    rejectedStatus: {
        fontSize: 12,
        fontWeight: '400',
        color: '#FC555B'
    },
    acceptedStatus: {
        fontSize: 12,
        fontWeight: '400',
        color: '#00B528'
    },
    statusBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        gap: 10,
        paddingHorizontal: 16,
        paddingTop: 12
    },
    approveBtn: {
        backgroundColor: '#00B528',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rejectBtn: {
        backgroundColor: '#D92121',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBtnText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#FFFFFF'
    },
    loadingContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, StyleSheet, TouchableOpacity, View, StatusBar, Alert } from 'react-native';
import { ActivityIndicator, Button, Icon, Portal, Text } from 'react-native-paper';
import { APIResponseEnum, CustomNavigationProp } from '../../types/common';
import { useMemo, useState } from 'react';
import { formatDate, formatDateReverse } from '../../utils/helper';
import useAuctionDetails from '../../api/auctions/useAuction';
import useAuctionLines from '../../api/auctions/useAuctionLineHeader';
import useComments from '../../api/auctions/useComments';
import useCreateComment from '../../api/auctions/useCreateComment';
import { RequestInfoCard } from '../../components/RequestCard';
import { CommentCard } from '../../components/CommentCard';
import { BidLinesInput } from '../../components/BidLinesInput';
import useTemplates from '../../api/templates/useTemplates';
import { TemplateType } from '../../types/template';
import { TemplatesCard } from '../../components/TemplatesCard';
import { TemplateEditCard } from '../../components/TemplateEditCard';
import useUpdateTemplateDescription from '../../api/templates/useUpdateTemplateDescription';
import { NoteCard } from '../../components/NoteCard';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import { AttachmentsCard } from '../../components/AttachmentsCard';
import { AttachmentType } from '../../types/purchaseOrder';
import useCreateBid from '../../api/auctions/useCreateBid';
import useCheckMyBid from '../../api/auctions/useCheckMyBid';
import useAuctionIgnore from '../../api/auctions/useAuctionIgnore';
import { BottomNavbar } from '../../components/BottomNavbar';
import { colors, typography, spacing, borderRadius } from '../../theme';

type RootStackParamList = {
    SupplierRequestDetailsScreen: {
        reqId: string;
    };
};

const SupplierRequestDetailsScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'SupplierRequestDetailsScreen'>>();
    const { reqId } = route.params;

    const navigation = useNavigation<CustomNavigationProp>();

    const [statusLoading, setStatusLoading] = useState<0 | 1 | 2>(0);
    const [showEditTemplate, setShowEditTemplate] = useState<boolean>(false);

    const [noteToSupplier, setNoteToSupplier] = useState<string>('');
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>();

    // Per-line quote management
    const [lineQuotes, setLineQuotes] = useState<Record<number, { price: string; date: Date | undefined; quantity?: string }>>({});

    const { data: auction, isPending: loading } = useAuctionDetails({ id: reqId });
    const { data: auctionLines } = useAuctionLines({ id: reqId });
    const { data: comments, isPending: commentsLoading, refetch: refetchComments } = useComments({ id: reqId });
    const { data: templates, refetch: refetchTemplates } = useTemplates();
    const { mutateAsync: createComment, isPending: sendingComments } = useCreateComment();
    const { mutateAsync: updateDescription, isPending: updatingDescription } = useUpdateTemplateDescription();
    const { mutateAsync: bid, isPending: sendingBidUpdate } = useCreateBid();
    const { mutateAsync: ignore } = useAuctionIgnore();

    // Check for existing bid
    const { data: existingBid, isPending: checkingBid } = useCheckMyBid({ id: reqId });

    // Populate form with existing bid data
    useEffect(() => {
        if (existingBid && auctionLines) {
            console.log('Found existing bid:', existingBid);
            setNoteToSupplier(existingBid.note_to_supplier || '');

            // Map existing bid lines to form state
            if (existingBid.bid_lines && Array.isArray(existingBid.bid_lines)) {
                const newQuotes: Record<number, { price: string; date: Date | undefined; quantity?: string }> = {};

                auctionLines.forEach((line, index) => {
                    // Find corresponding bid line
                    const bidLine = existingBid.bid_lines.find((bl: any) => bl.auction_line === line.id || bl.auction_line_id === line.id);

                    if (bidLine) {
                        newQuotes[index] = {
                            price: String(bidLine.price || 0),
                            date: bidLine.promised_date ? new Date(bidLine.promised_date) : undefined,
                            quantity: String(bidLine.quantity || line.quantity)
                        };
                    }
                });

                setLineQuotes(newQuotes);
            }
        }
    }, [existingBid, auctionLines]);

    const isReadOnly = useMemo(() => !!existingBid, [existingBid]);

    const handleStatusUpdate = (status: string) => {
        if (isReadOnly) return;

        if (status === 'Bid') {
            setStatusLoading(1);

            try {
                // Build bid lines array from all auction lines (match web payload shape)
                let bidLines: any[] = [];
                if (auctionLines && auctionLines.length > 0) {
                    auctionLines.forEach((line, index) => {
                        const quote = lineQuotes[index];
                        const rawQuantity = quote?.quantity ?? line.quantity;
                        const bidQuantity =
                            typeof rawQuantity === 'string' && rawQuantity.trim() !== ''
                                ? Number(rawQuantity)
                                : rawQuantity;

                        bidLines.push({
                            auction_line: line.id,
                            bid_quantity: bidQuantity,
                            quantity: bidQuantity,
                            price: quote?.price || 0,
                            promised_date: quote?.date ? formatDateReverse(quote.date.toISOString()) : null,
                        });
                    });
                }

                // Timeout promise
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timed out')), 10000)
                );

                Promise.race([
                    bid({
                        id: reqId,
                        lst_bid_line: bidLines,
                        note_to_supplier: noteToSupplier,
                        template_data: selectedTemplate
                            ? JSON.stringify({
                                id: selectedTemplate.id,
                                name: selectedTemplate.name,
                                display_description: selectedTemplate.display_description,
                            })
                            : undefined,
                    }),
                    timeoutPromise
                ])
                    .then((res: any) => {
                        setStatusLoading(0);
                        if (res !== APIResponseEnum.SUCCESS) {
                            console.error('Bid submission failed with status:', res);
                            Alert.alert('Error', 'Bid submission failed. Please try again.');
                        } else {
                            navigation.navigate('SupplierRequestHistory');
                        }
                    })
                    .catch((err) => {
                        console.error('Bid submission error:', err);
                        setStatusLoading(0);
                        const msg = err instanceof Error ? err.message : 'Unknown error';
                        Alert.alert('Submission Error', msg);
                    });
            } catch (e: any) {
                console.error('Sync Error:', e);
                setStatusLoading(0);
                Alert.alert('App Error', e.message || 'Error preparing bid');
            }
        } else {
            setStatusLoading(2);
            ignore({ id: reqId }).then(() => {
                setStatusLoading(0);
                navigation.navigate('SupplierRequestHistory');
            });
        }
    };

    const requestedByDetails = useMemo(() => {
        if (auction) {
            return {
                Title: auction.title,
                'Reference Number': auction.requisition_number,
                'Contract Type': auction.is_open ? 'OPEN' : 'CLOSED',
            };
        }
    }, [auction]);

    const attachmentsDetails = useMemo(() => {
        if (auctionLines) {
            let attachments: AttachmentType[] = [];
            auctionLines.map((auctionLine) => {
                auctionLine.attachments?.map((item) => attachments.push(item));
            });
            return attachments;
        } else {
            return [];
        }
    }, [auctionLines]);

    const handleQuoteChange = (index: number, field: 'price' | 'date' | 'quantity', value: any) => {
        setLineQuotes(prev => ({
            ...prev,
            [index]: {
                ...prev[index] || { price: '', date: undefined, quantity: '' },
                [field]: value
            }
        }));
    };

    const handleComment = (value: string) => {
        createComment({ id: reqId, message: value }).then(() => {
            refetchComments();
        });
    };

    const handleTemplateSelection = (template: TemplateType | undefined) => {
        setSelectedTemplate(template);
        setShowEditTemplate(true);
    };

    const handleUpdateTemplateDescription = (id: string, value: string) => {
        updateDescription({ id: id, display_description: value }).then(() => {
            refetchTemplates();
            setShowEditTemplate(false);
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Icon size={24} source="arrow-left" color={colors.neutral.text.secondary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerLabel}>Request Details</Text>
                    <Text style={styles.title} numberOfLines={1}>{auction?.requisition_number}</Text>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.scrollContainer}>
                    {auction && (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {/* Status Actions */}
                            <View style={styles.actionCard}>
                                <View style={styles.actionHeader}>
                                    <Text style={styles.actionTitle}>Actions</Text>
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>{auction.is_open ? 'OPEN' : 'CLOSED'}</Text>
                                    </View>
                                </View>
                                <View style={styles.actionButtons}>
                                    {isReadOnly ? (
                                        <Button
                                            mode="contained"
                                            style={[styles.bidButton, { backgroundColor: colors.neutral.border.default }]}
                                            labelStyle={{ color: colors.neutral.text.disabled }}
                                            disabled={true}
                                            icon="check-all"
                                        >
                                            Bid Submitted
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                mode="contained"
                                                style={styles.bidButton}
                                                labelStyle={styles.buttonLabel}
                                                disabled={sendingBidUpdate || !auction.is_open}
                                                loading={statusLoading === 1}
                                                onPress={() => handleStatusUpdate('Bid')}
                                                icon="check-circle-outline"
                                            >
                                                Submit
                                            </Button>
                                            <Button
                                                mode="outlined"
                                                style={styles.ignoreButton}
                                                labelStyle={styles.ignoreLabel}
                                                disabled={sendingBidUpdate || !auction.is_open}
                                                loading={statusLoading === 2}
                                                onPress={() => handleStatusUpdate('Ignore')}
                                                icon="close-circle-outline"
                                            >
                                                Ignore
                                            </Button>
                                        </>
                                    )}
                                </View>
                            </View>

                            <View style={styles.sectionSpacer} />

                            <RequestInfoCard
                                title={auction.title}
                                contentData={requestedByDetails}
                                organization_name={auction.organization_name}
                                date={auction.created_at}
                            />

                            <View style={styles.sectionSpacer} />

                            <View style={styles.sectionSpacer} />

                            {auctionLines && auctionLines.length > 0 && (
                                <BidLinesInput
                                    items={auctionLines}
                                    quotes={lineQuotes}
                                    onQuoteChange={handleQuoteChange}
                                    editable={auction.is_open && !isReadOnly}
                                    partialQuantityAllowed={auction.partial_quantity_bidding}
                                />
                            )}

                            <View style={styles.sectionSpacer} />

                            {attachmentsDetails.length > 0 && (
                                <AttachmentsCard title="Attachments" contentData={attachmentsDetails} />
                            )}

                            <View style={styles.sectionSpacer} />

                            <TemplatesCard
                                title="Payment Templates"
                                contentData={templates}
                                selectedTemplate={selectedTemplate}
                                setSelectedTemplate={handleTemplateSelection}
                            />

                            {selectedTemplate && showEditTemplate && (
                                <TemplateEditCard
                                    title={selectedTemplate.name}
                                    contentData={selectedTemplate}
                                    closeFn={() => setShowEditTemplate(false)}
                                    saveFn={handleUpdateTemplateDescription}
                                    saving={updatingDescription}
                                />
                            )}

                            <View style={styles.sectionSpacer} />

                            <NoteCard
                                title="Note to Supplier"
                                content={noteToSupplier}
                                setContent={setNoteToSupplier}
                                editable={!isReadOnly}
                            />

                            <View style={styles.sectionSpacer} />

                            <CommentCard
                                comments={comments}
                                buttonFn={handleComment}
                                loading={sendingComments || commentsLoading}
                            />
                        </ScrollView>
                    )}

                </View>
            </View>
        </View >
    );
};

export default SupplierRequestDetailsScreen;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.neutral.surface.sunken,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: spacing['2xl'],
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.xl,
        backgroundColor: colors.neutral.surface.default,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    headerLabel: {
        ...typography.styles.caption,
        marginBottom: 2,
    },
    title: {
        ...typography.styles.h3,
        maxWidth: 250,
        color: colors.neutral.text.primary,
    },
    scrollContent: {
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },
    sectionSpacer: {
        height: spacing.xl,
    },
    actionCard: {
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.sm,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    actionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    actionTitle: {
        ...typography.styles.h4,
        color: colors.neutral.text.primary,
    },
    statusBadge: {
        backgroundColor: colors.semantic.success.light,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    statusText: {
        ...typography.styles.caption,
        color: colors.semantic.success.dark,
        fontWeight: '600',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    bidButton: {
        flex: 1,
        backgroundColor: colors.semantic.success.default, // Fixed: use .default
        borderRadius: borderRadius.base,
    },
    ignoreButton: {
        flex: 1,
        borderColor: colors.semantic.error.default, // Fixed: use .default
        borderRadius: borderRadius.base,
    },
    buttonLabel: {
        ...typography.styles.label,
        color: colors.neutral.white,
    },
    ignoreLabel: {
        ...typography.styles.label,
        color: colors.semantic.error.default, // Fixed
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.neutral.surface.sunken,
    },
});

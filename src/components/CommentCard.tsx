import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { BidCommentType, CommentType } from '../types/auction';
import { useEffect, useState } from 'react';
import Timeline from 'react-native-timeline-flatlist';
import { formatDateVerbose } from '../utils/helper';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface props {
    comments: CommentType[] | BidCommentType[] | undefined,
    buttonFn?: (value: string) => void,
    loading: boolean
}

export const CommentCard = ({ buttonFn, comments, loading }: props) => {
    const [data, setData] = useState<any[]>([]);
    const [comment, setComment] = useState<string>('');

    useEffect(() => {
        if (comments) {
            const tempData = comments.map((commentItem) => ({
                title: commentItem.author,
                time: formatDateVerbose(commentItem.created_at),
                description: commentItem.message,
            }));
            setData(tempData);
        } else {
            setData([]);
        }
    }, [comments]);

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Comments</Text>

            {data.length > 0 ? (
                <View style={styles.timelineContainer}>
                    <Timeline
                        data={data}
                        circleColor={colors.neutral.border.default}
                        lineColor={colors.neutral.border.default}
                        timeContainerStyle={styles.timeContainer}
                        timeStyle={styles.timeStyle}
                        descriptionStyle={styles.descriptionStyle}
                        titleStyle={styles.titleStyle}
                        innerCircle={'icon'}
                        iconStyle={styles.iconStyle}
                        options={{
                            scrollEnabled: false, // Disable internal scrolling when inside a ScrollView
                            removeClippedSubviews: false,
                        }}
                    />
                </View>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No comments yet</Text>
                </View>
            )}

            <View style={styles.noteContainer}>
                <Text style={styles.noteBold}>Note:</Text>
                <Text style={styles.noteDescription}>Avoid disclosing sensitive personal or financial information here.</Text>
            </View>

            {buttonFn &&
                <View style={styles.footer}>
                    <TextInput
                        value={comment}
                        onChangeText={setComment}
                        style={styles.commentInput}
                        mode="outlined"
                        placeholder="Type your comment..."
                        textColor={colors.neutral.text.primary}
                        placeholderTextColor={colors.neutral.text.tertiary}
                        cursorColor={colors.primary[800]}
                        outlineColor={colors.neutral.border.default}
                        activeOutlineColor={colors.primary[800]}
                        dense
                    />
                    <Button
                        loading={loading}
                        disabled={comment.length < 1}
                        style={[styles.footerBtn, comment.length < 1 && styles.disabledBtn]}
                        labelStyle={styles.footerLabel}
                        onPress={() => { buttonFn(comment); setComment(''); }}
                        icon="send-outline"
                        mode="contained"
                    >
                        Send
                    </Button>
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.sm,
    },
    headerTitle: {
        ...typography.styles.h4,
        marginBottom: spacing.lg,
        color: colors.primary[800],
    },
    timelineContainer: {
        marginBottom: spacing.md,
    },
    timeContainer: {
        minWidth: 70,
    },
    timeStyle: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
        textAlign: 'center',
        paddingTop: 2,
    },
    titleStyle: {
        ...typography.styles.body,
        fontWeight: '600',
        color: colors.neutral.text.primary,
        marginBottom: 2,
    },
    descriptionStyle: {
        ...typography.styles.bodySmall,
        color: colors.neutral.text.secondary,
        marginTop: 0,
        marginBottom: spacing.md,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    emptyContainer: {
        paddingVertical: spacing.lg,
        alignItems: 'center',
    },
    emptyText: {
        ...typography.styles.bodySmall,
        color: colors.neutral.text.tertiary,
        fontStyle: 'italic',
    },
    noteContainer: {
        flexDirection: 'row',
        gap: spacing.xs,
        backgroundColor: colors.primary[50],
        borderRadius: borderRadius.sm,
        padding: spacing.sm,
        marginBottom: spacing.lg,
    },
    noteBold: {
        ...typography.styles.caption,
        fontWeight: '700',
        color: colors.primary[800],
    },
    noteDescription: {
        ...typography.styles.caption,
        color: colors.primary[800],
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    commentInput: {
        flex: 1,
        backgroundColor: colors.neutral.background,
        fontSize: typography.size.sm,
    },
    footerBtn: {
        height: 48,
        justifyContent: 'center',
        borderRadius: borderRadius.base,
        backgroundColor: colors.primary[700],
    },
    disabledBtn: {
        backgroundColor: colors.neutral.border.default,
    },
    footerLabel: {
        ...typography.styles.label,
        color: colors.neutral.white,
    },
});

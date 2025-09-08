import { StyleSheet, View } from "react-native"
import { Button, Text, TextInput, useTheme } from "react-native-paper"
import { BidCommentType, CommentType } from "../types/auction"
import { useContext, useEffect, useState } from "react"
import Timeline, { Data } from "react-native-timeline-flatlist"
import { formatDateVerbose } from "../utils/helper"
import { ThemeContext } from "../themes/ThemeContext"

interface props {
    comments: CommentType[]| BidCommentType[] |undefined,
    buttonFn?: (value: string) => void,
    loading: boolean
}

export const CommentCard = ({buttonFn, comments, loading}: props) => {
    const [data, setData] = useState<any[]>([]);
    const [comment, setComment] = useState<string>("");
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    useEffect(() => {
        if (comments) {
            let tempData: any[] = [];
            comments.map((comment) => {
                tempData.push({
                    title: comment.author,
                    time: formatDateVerbose(comment.created_at),
                    description: comment.message,
                })
            })
            setData([...tempData]);
        }
    }, [comments]);

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Comments</Text>
            {comments && data.length > 0 && (
                <Timeline data={data} circleColor={theme.colors.placeholder} lineColor={theme.colors.placeholder} timeContainerStyle={{minWidth: 150}} descriptionStyle={{flexWrap: 'wrap', color: theme.colors.text}} titleStyle={{flexWrap: 'wrap', color: theme.colors.text}}/>
            )}
            <View style={styles.noteContainer}>
                <Text style={styles.noteBold}>Note:</Text>
                <Text style={styles.noteDescription}>Avoid disclosing private information here</Text>
            </View>
            { buttonFn &&
                <View style={styles.footer}>
                        <TextInput value={comment} onChangeText={setComment} style={styles.commentInput} mode="outlined" placeholder="Comment here..." textColor={theme.colors.text} placeholderTextColor={theme.colors.placeholder} cursorColor={theme.colors.text} outlineColor={theme.colors.placeholder} selectionColor={theme.colors.placeholder} activeOutlineColor={theme.colors.placeholder}/>
                        <Button loading={loading} disabled={comment.length < 1} style={styles.footerBtn} labelStyle={{color: '#FFFFFF', fontSize: 11, fontWeight: '600'}} onPress={() => {buttonFn(comment); setComment("")}}>Comment</Button>
                </View>
            }
        </View>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        width: '100%',
        padding: 16,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: theme.colors.placeholder,
        backgroundColor: theme.colors.surface,
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        color: theme.colors.text,
        marginLeft: 12,
        marginBottom: 16
    },
    card: {
        width: '100%',
        padding: 16,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: theme.colors.placeholder,
        backgroundColor: theme.colors.surface,
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 4,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 5,
        flexWrap: 'wrap'
    },
    rowText: {
        color: theme.colors.placeholder,
        fontWeight: '400',
        fontSize: 12
    },
    noteContainer: {
        paddingHorizontal:16,
        paddingVertical: 12,
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        backgroundColor: theme.colors.background,
        borderRadius: 5,
    },
    noteBold: {
        fontWeight: '700',
        fontSize: 10,
        color: theme.colors.text,
    },
    noteDescription: {
        fontWeight: '500',
        fontSize: 10,
        color: theme.colors.placeholder
    },
    footer: {
        width: '100%',
        paddingTop: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerBtn: {
        width: '25%',
        backgroundColor: '#00B976',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 7,
        borderBottomRightRadius: 7,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -4,
        height: 40
    },
    commentInput: {
        width: '75%',
        display: 'flex',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7,
        borderEndColor: '#00B976',
        height: 40,
        backgroundColor: theme.colors.surface
    },
    descriptionContainer:{
        flexDirection: 'row',
        paddingRight: 50
    },
    textDescription: {
        marginLeft: 10,
        color: theme.colors.text
    }
})
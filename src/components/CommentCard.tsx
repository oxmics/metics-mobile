import { StyleSheet, View } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"
import { CommentType } from "../types/auction"
import { useEffect, useState } from "react"
import Timeline from "react-native-timeline-flatlist"
import { formatDateVerbose } from "../utils/helper"

interface props {
    comments: CommentType[]|undefined,
    buttonFn?: (value: string) => void,
    loading: boolean
}

export const CommentCard = ({buttonFn, comments, loading}: props) => {
    const [data, setData] = useState<any[]>([]);
    const [comment, setComment] = useState<string>("");

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
    }, [comments])

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Comments</Text>
            {comments && data.length > 0 && (
                <Timeline data={data} circleColor="#D9D9D9" lineColor="#D9D9D9" timeContainerStyle={{minWidth: 150}} descriptionStyle={{flexWrap: 'wrap'}} titleStyle={{flexWrap: 'wrap'}}/>
            )}
            <View style={styles.noteContainer}>
                <Text style={styles.noteBold}>Note:</Text>
                <Text style={styles.noteDescription}>Avoid disclosing private information here</Text>
            </View>
            { buttonFn &&
                <View style={styles.footer}>
                        <TextInput value={comment} onChangeText={setComment} style={styles.commentInput} mode="outlined" placeholder="Comment here..." placeholderTextColor={"#00000099"} cursorColor="#000" outlineColor="#0000004D" selectionColor="#0000004D" activeOutlineColor="#0000004D"/>
                        <Button loading={loading} disabled={comment.length < 1} style={styles.footerBtn} labelStyle={{color: '#FFFFFF', fontSize: 11, fontWeight: 600}} onPress={() => {buttonFn(comment); setComment("")}}>Comment</Button>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 16,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#0000004D',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 15,
        fontWeight: 500,
        color: '#000000CC',
        marginLeft: 12,
        marginBottom: 16
    },
    card: {
        width: '100%',
        padding: 16,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#0000004D',
        backgroundColor: '#FFFFFF',
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
        color: '#00000099',
        fontWeight: 400,
        fontSize: 12
    },
    noteContainer: {
        paddingHorizontal:16,
        paddingVertical: 12,
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        backgroundColor: '#ECECEC',
        borderRadius: 5,
    },
    noteBold: {
        fontWeight: 700,
        fontSize: 10,
        color: '#000',
    },
    noteDescription: {
        fontWeight: 500,
        fontSize: 10,
        color: '#00000099'
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
        height: 40
    }
})
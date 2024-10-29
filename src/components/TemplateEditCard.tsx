import { StyleSheet, View } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"
import { TemplateType } from "../types/template"
import { useEffect, useState } from "react"

interface props {
    title: string,
    contentData: TemplateType,
    saveFn: (id: string, value: string) => void,
    closeFn: () => void,
    saving: boolean
}

export const TemplateEditCard = ({closeFn, saveFn, saving, contentData, title}: props) => {
    const [description, setDescription] = useState<string>("");

    useEffect(() => {
        setDescription(contentData.display_description)
    }, [contentData])

    const handleSave = () => {
        saveFn(contentData.id, description);
    } 

    return(
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <TextInput style={styles.inputBox} mode="outlined" underlineStyle={{display: 'none'}} outlineColor="#00000033" activeOutlineColor="#000000AB" value={description} onChangeText={setDescription} placeholder="Description here..." placeholderTextColor={"#00000080"} multiline/>
            <View style={styles.footer}>
                <View style={styles.btnContainer}>
                    <Button mode="text" labelStyle={{color: '#000000', fontSize: 11, fontWeight: '600'}} onPress={() => closeFn()}>Close</Button>
                    <Button loading={saving} style={styles.footerBtn} labelStyle={{color: '#FFFFFF', fontSize: 11, fontWeight: '600'}} onPress={() => handleSave()}>Save</Button>
                </View>
            </View>
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
        fontWeight: '500',
        color: '#000000CC',
        marginLeft: 12,
        marginBottom: 16
    },
    inputBox: {
        borderRadius: 10,
        borderColor: '#00000033',
        height: 120,
        backgroundColor: '#FFFFFF'
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
        fontWeight: '400',
        fontSize: 12
    },
    footer: {
        marginTop: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#00000033',
        borderRadius: 10
    },
    footerBtn: {
        backgroundColor: '#00B976',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
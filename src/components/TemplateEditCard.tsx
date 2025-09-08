import { StyleSheet, View } from "react-native"
import { Button, Text, TextInput, useTheme } from "react-native-paper"
import { TemplateType } from "../types/template"
import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "../themes/ThemeContext"

interface props {
    title: string,
    contentData: TemplateType,
    saveFn: (id: string, value: string) => void,
    closeFn: () => void,
    saving: boolean
}

export const TemplateEditCard = ({closeFn, saveFn, saving, contentData, title}: props) => {
    const [description, setDescription] = useState<string>("");
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    useEffect(() => {
        setDescription(contentData.display_description)
    }, [contentData])

    const handleSave = () => {
        saveFn(contentData.id, description);
    } 

    return(
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <TextInput style={styles.inputBox} mode="outlined" underlineStyle={{display: 'none'}} outlineColor={theme.colors.placeholder} activeOutlineColor={theme.colors.text} value={description} onChangeText={setDescription} placeholder="Description here..." placeholderTextColor={theme.colors.placeholder} multiline textColor={theme.colors.text}/>
            <View style={styles.footer}>
                <View style={styles.btnContainer}>
                    <Button mode="text" labelStyle={{color: theme.colors.text, fontSize: 11, fontWeight: '600'}} onPress={() => closeFn()}>Close</Button>
                    <Button loading={saving} style={styles.footerBtn} labelStyle={{color: '#FFFFFF', fontSize: 11, fontWeight: '600'}} onPress={() => handleSave()}>Save</Button>
                </View>
            </View>
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
    inputBox: {
        borderRadius: 10,
        borderColor: theme.colors.placeholder,
        height: 120,
        backgroundColor: theme.colors.surface
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
        borderColor: theme.colors.placeholder,
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
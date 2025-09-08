import { StyleSheet, View } from "react-native"
import { Text, TextInput, useTheme } from "react-native-paper"
import { useContext } from "react";
import { ThemeContext } from "../themes/ThemeContext";

interface props {
    title: string,
    content: string,
    setContent:  React.Dispatch<React.SetStateAction<string>>
}

export const NoteCard = ({content, setContent, title}: props) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return(
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <TextInput style={styles.inputBox} mode="outlined" underlineStyle={{display: 'none'}} outlineColor={theme.colors.placeholder} activeOutlineColor={theme.colors.text} value={content} onChangeText={setContent} placeholder="Note here..." placeholderTextColor={theme.colors.placeholder} multiline textColor={theme.colors.text}/>
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
    }
})
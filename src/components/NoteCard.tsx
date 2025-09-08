import { StyleSheet, View } from "react-native"
import { Text, TextInput, useTheme } from "react-native-paper"
import { useContext } from "react";
import { ThemeContext } from "../themes/ThemeContext";
import { BlurView } from "@react-native-community/blur";

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
            <BlurView
                style={styles.blurView}
                blurType={theme.dark ? "dark" : "light"}
                blurAmount={10}
                reducedTransparencyFallbackColor={theme.colors.surface}
            >
                <Text style={styles.title}>{title}</Text>
                <TextInput style={styles.inputBox} mode="outlined" underlineStyle={{display: 'none'}} outlineColor={theme.colors.placeholder} activeOutlineColor={theme.colors.text} value={content} onChangeText={setContent} placeholder="Note here..." placeholderTextColor={theme.colors.placeholder} multiline textColor={theme.colors.text}/>
            </BlurView>
        </View>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
    },
    blurView: {
        padding: 16,
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
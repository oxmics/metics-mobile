import { StyleSheet, View } from "react-native"
import { Text, TextInput } from "react-native-paper"

interface props {
    title: string,
    content: string,
    setContent:  React.Dispatch<React.SetStateAction<string>>
}

export const NoteCard = ({content, setContent, title}: props) => {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <TextInput style={styles.inputBox} mode="outlined" underlineStyle={{display: 'none'}} outlineColor="#00000033" activeOutlineColor="#000000AB" value={content} onChangeText={setContent} placeholder="Note here..." placeholderTextColor={"#00000080"} multiline/>
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
    inputBox: {
        borderRadius: 10,
        borderColor: '#00000033',
        height: 120,
        backgroundColor: '#FFFFFF'
    }
})
import { StyleSheet, View } from "react-native"
import { Button, Text, useTheme } from "react-native-paper"
import { useContext } from "react";
import { ThemeContext } from "../themes/ThemeContext";

interface props {
    contentData: any,
    footerButtonAvailable?: boolean,
    buttonFn?: () => void,
}

export const QuoteContainer = ({footerButtonAvailable, buttonFn, contentData,}: props) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return(
        <View style={styles.container}>
            {Object.entries(contentData).map(([key, value], index) => (
                <View key={index} style={styles.row}>
                <Text style={styles.rowText}>{key}:</Text>
                <Text style={styles.rowText}>{String(value)}</Text>
                </View>
            ))}
            {footerButtonAvailable && buttonFn &&
                <View style={styles.footer}>
                    <Button style={styles.footerBtn} labelStyle={{color: '#FFFFFF', fontSize: 11, fontWeight: 600}} onPress={() => buttonFn()}>Quote</Button>
                </View>
            }
        </View>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        width: '100%',
        padding: 28,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: theme.colors.placeholder,
        backgroundColor: theme.colors.surface,
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
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 12
    },
    rowText: {
        color: theme.colors.placeholder,
        fontWeight: '400',
        fontSize: 12
    },
    footer: {
        paddingTop: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    footerBtn: {
        backgroundColor: '#00B976',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
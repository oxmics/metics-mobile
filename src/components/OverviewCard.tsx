import { StyleSheet, View } from "react-native"
import { Text, useTheme } from "react-native-paper"
import { useContext } from "react";
import { ThemeContext } from "../themes/ThemeContext";

interface props {
    title: string,
    value: number,
    footer?: string
}

export const OverviewCard = ({title, value, footer}: props) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return(
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
            {footer && <Text style={styles.footer}>{footer}</Text>}
        </View>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        maxHeight: 120, 
        minHeight: 100,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: theme.colors.placeholder,
        padding: 20,
        backgroundColor: theme.colors.surface,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 12,
        marginRight: 12
    },
    title: {
        color: theme.colors.placeholder,
        fontSize: 12,
        fontWeight: '400'
    },
    value: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: '400'
    },
    footer: {
        color: theme.colors.placeholder,
        fontSize: 12,
        fontWeight: '400'
    },
})
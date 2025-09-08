import { StyleSheet, View } from "react-native"
import { Text, useTheme } from "react-native-paper"
import { useContext } from "react";
import { ThemeContext } from "../themes/ThemeContext";
import { BlurView } from "@react-native-community/blur";

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
            <BlurView
                style={styles.blurView}
                blurType={theme.dark ? "dark" : "light"}
                blurAmount={10}
                reducedTransparencyFallbackColor={theme.colors.surface}
            >
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.value}>{value}</Text>
                {footer && <Text style={styles.footer}>{footer}</Text>}
            </BlurView>
        </View>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        maxHeight: 120, 
        minHeight: 100,
        borderRadius: 20,
        marginRight: 12,
        overflow: 'hidden',
    },
    blurView: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 12,
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
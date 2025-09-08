import { StyleSheet, View } from "react-native"
import { Button, Text, useTheme } from "react-native-paper"
import { useContext } from "react";
import { ThemeContext } from "../themes/ThemeContext";
import { BlurView } from "@react-native-community/blur";

interface props {
    title: string,
    iterative: boolean,
    contentData: any,
    footerButtonAvailable?: boolean,
    buttonFn?: () => void
}

export const InfoCard = ({footerButtonAvailable, buttonFn, contentData, iterative, title}: props) => {
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
                {iterative ? (
                    contentData.map((item: any, index: number) => {
                        return (<View style={styles.card} key={index}>
                            {Object.entries(item).map(([key, value], index) => (
                                <View key={index} style={styles.row}>
                                <Text style={styles.rowText}>{key}:</Text>
                                <Text style={styles.rowText}>{String(value)}</Text>
                                </View>
                            ))}
                        </View>)
                    })
                ): (
                    <View style={styles.card}>
                    {Object.entries(contentData).map(([key, value], index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.rowText}>{key}:</Text>
                        <Text style={styles.rowText}>{String(value)}</Text>
                    </View>
                    ))}
                </View>
                )}
                {footerButtonAvailable && buttonFn &&
                    <View style={styles.footer}>
                        <Button style={styles.footerBtn} labelStyle={{color: '#FFFFFF', fontSize: 11, fontWeight: '600'}} onPress={() => buttonFn()}>See More</Button>
                    </View>
                }
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
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
        flexWrap: 'wrap',
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
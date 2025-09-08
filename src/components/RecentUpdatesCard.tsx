import { StyleSheet, Text, View } from "react-native"
import { SupplierActivityLogsType } from "../types/dashboard"
import { daysAgo } from "../utils/helper"
import { Button, useTheme } from "react-native-paper"
import { useContext } from "react"
import { ThemeContext } from "../themes/ThemeContext"

interface props {
    logs: SupplierActivityLogsType[],
    viewAll: () => void
}

export const RecentUpdatesCard = ({logs, viewAll}: props) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return(
        <View style={styles.container}>
            <View style={styles.body}>
                {logs.length > 0 ?logs.map((log, index) =>{ if (index < 5) {
                    return (
                        <View key={index} style={styles.row}>
                            <Text style={styles.heading}>{log.activity_type}</Text>
                            <View style={styles.descriptionRow}>
                                <Text style={styles.description}>{log.description}</Text>
                                <Text style={styles.date}>{daysAgo(log.updated_at)}</Text>
                            </View>
                        </View>
                    )
                }}): <View><Text style={{color: theme.colors.text}}>No recent updates</Text></View>}
            </View>
            {logs.length > 0 && <View style={styles.footer}>
                <Button onPress={viewAll} mode="text" textColor="#1BBB6B">View All</Button>
            </View>}
        </View>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: theme.colors.placeholder,
        borderRadius: 10,
        width: '100%',
        backgroundColor: theme.colors.surface
    },
    body: {
        padding: 20,
        width: '100%',
    },
    row: {
        display: 'flex',
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.placeholder,
        paddingVertical: 8,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    heading: {
        fontSize: 13,
        fontWeight: '500',
        color: theme.colors.text
    },
    description: {
        width: '60%',
        flexWrap: 'wrap',
        color: theme.colors.placeholder,
        fontSize: 12,
        fontWeight: '400'
    },
    date: {
        color: theme.colors.placeholder,
        fontSize: 12,
        fontWeight: '400'
    },
    descriptionRow: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 4
    },
    footer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.colors.placeholder,
    }
})
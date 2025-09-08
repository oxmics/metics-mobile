import { Button, Modal, Text, useTheme } from "react-native-paper"
import { SupplierActivityLogsType } from "../types/dashboard"
import { ScrollView, StyleSheet, View } from "react-native"
import { daysAgo } from "../utils/helper"
import { useContext } from "react"
import { ThemeContext } from "../themes/ThemeContext"

interface props {
    show: boolean,
    hideModal: () => void,
    logs: SupplierActivityLogsType[]
}

export const RecentUpdatesModal = ({hideModal, logs, show}: props) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return(
        <Modal visible={show} onDismiss={hideModal} dismissable dismissableBackButton>
            <View style={styles.holder}>
                <View style={styles.container}>
                    <ScrollView style={styles.body}>
                        {logs.map((log, index) =>(
                            <View key={index} style={styles.row}>
                                    <Text style={styles.heading}>{log.activity_type}</Text>
                                    <View style={styles.descriptionRow}>
                                        <Text style={styles.description}>{log.description}</Text>
                                        <Text style={styles.date}>{daysAgo(log.updated_at)}</Text>
                                    </View>
                                </View>
                            )
                        )}
                    </ScrollView>
                    <View style={styles.footer}>
                        <Button onPress={hideModal} mode="text" textColor="#1BBB6B">Close</Button>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const getStyles = (theme) => StyleSheet.create({
    holder: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '75%',
    },
    container: {
        borderWidth: 1,
        borderColor: theme.colors.placeholder,
        borderRadius: 10,
        width: '80%',
        height: '100%',
        backgroundColor: theme.colors.surface
    },
    body: {
        padding: 20,
        width: '100%',
        marginBottom: 10,
        marginTop: 10
    },
    row: {
        display: 'flex',
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.placeholder,
        paddingVertical: 8,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingBottom: 16
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
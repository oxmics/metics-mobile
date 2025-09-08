import { Linking, StyleSheet, View } from "react-native"
import { DataTable, Text, useTheme } from "react-native-paper"
import { AttachmentType } from "../types/purchaseOrder"
import { useContext } from "react";
import { ThemeContext } from "../themes/ThemeContext";

interface props {
    title: string,
    contentData: AttachmentType[],
}

export const AttachmentsCard = ({contentData, title}: props) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const openLinkInBrowser = (url: string) => {
        Linking.openURL(url).catch((err) => {
          console.error("Failed to open URL:", err);
        });
    };

    return(
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Cell><Text style={styles.rowText}>Name</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.rowText}>Description</Text></DataTable.Cell>
                </DataTable.Header>
            </DataTable>
            {contentData.map((item: AttachmentType, index: number) => {
                return (
                    <DataTable.Row key={index}>
                        <DataTable.Cell onPress={() => openLinkInBrowser(`https://metics.org/${item.file}`)}><Text style={{color: "#0D6EFD", textDecorationLine: "underline"}}>{item.name}</Text></DataTable.Cell>
                        <DataTable.Cell><Text style={[styles.rowText, {display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}]}>{item.description}</Text></DataTable.Cell>
                    </DataTable.Row>
                )
            })}
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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 5,
        flexWrap: 'wrap'
    },
    rowText: {
        color: theme.colors.text,
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
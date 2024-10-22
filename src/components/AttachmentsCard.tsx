import { Linking, StyleSheet, View } from "react-native"
import { DataTable, Text } from "react-native-paper"
import { AttachmentType } from "../types/purchaseOrder"

interface props {
    title: string,
    contentData: AttachmentType[],
}

export const AttachmentsCard = ({contentData, title}: props) => {
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
                    <DataTable.Cell>Name</DataTable.Cell>
                    <DataTable.Cell>Description</DataTable.Cell>
                </DataTable.Header>
            </DataTable>
            {contentData.map((item: AttachmentType, index: number) => {
                return (
                    <DataTable.Row>
                        <DataTable.Cell onPress={() => openLinkInBrowser(`https://metics.org/${item.file}`)}><Text style={{color: "#0D6EFD", textDecorationLine: "underline"}}>{item.name}</Text></DataTable.Cell>
                        <DataTable.Cell><Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>{item.description}</Text></DataTable.Cell>
                    </DataTable.Row>
                )
            })}
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
    card: {
        width: '100%',
        padding: 16,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#0000004D',
        backgroundColor: '#FFFFFF',
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
        color: '#00000099',
        fontWeight: 400,
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
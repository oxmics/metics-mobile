import { StyleSheet, View } from "react-native"
import { Button, Modal, Text } from "react-native-paper"

interface props {
    show: boolean,
    closeModal: () => void,
    contentData: any
}
export const BidModal = ({closeModal, contentData, show}: props) => {
    return(
        <Modal visible={show} onDismiss={closeModal}>
            <View style={styles.container}>
                <Text style={styles.title}>Additional Details</Text>
                <View style={styles.card}>
                    {Object.entries(contentData).map(([key, value], index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.rowText}>{key}:</Text>
                        <Text style={styles.rowText}>{String(value)}</Text>
                    </View>
                    ))}
                </View>  
                <Button style={styles.closeBtn} labelStyle={{color: '#FFFFFF', fontSize: 11, fontWeight: 600}} onPress={closeModal}>Close</Button>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 20, 
        paddingHorizontal: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 16,
        marginHorizontal: 16,
        borderRadius: 10
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
    title: {
        fontSize: 15,
        fontWeight: 500,
        color: '#000000CC'
    },
    closeBtn: {
        backgroundColor: '#00B976',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
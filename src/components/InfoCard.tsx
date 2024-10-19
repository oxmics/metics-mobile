import { StyleSheet, View } from "react-native"
import { Button, Text } from "react-native-paper"

interface props {
    title: string,
    iterative: boolean,
    contentData: any,
    footerButtonAvailable?: boolean,
    buttonFn?: () => void
}

export const InfoCard = ({footerButtonAvailable, buttonFn, contentData, iterative, title}: props) => {

    return(
        <View style={styles.container}>
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
                    <Button style={styles.footerBtn} labelStyle={{color: '#FFFFFF', fontSize: 11, fontWeight: 600}} onPress={() => buttonFn()}>See More</Button>
                </View>
            }
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
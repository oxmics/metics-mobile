import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"

interface props {
    title: string,
    value: number,
    footer?: string
}

export const OverviewCard = ({title, value, footer}: props) => {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
            {footer && <Text style={styles.footer}>{footer}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        maxHeight: 120, 
        minHeight: 100,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#00000033',
        padding: 20,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 12,
        marginRight: 12
    },
    title: {
        color: '#000000A6',
        fontSize: 12,
        fontWeight: '400'
    },
    value: {
        color: '#000000',
        fontSize: 20,
        fontWeight: '400'
    },
    footer: {
        color: '#000000A6',
        fontSize: 12,
        fontWeight: '400'
    },
})
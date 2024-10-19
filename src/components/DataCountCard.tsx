import { StyleSheet, View } from "react-native"
import { Icon, Text } from "react-native-paper"

interface props {
    title: string,
    count: number,
    icon: string
}

export const DataCountCard = ({count, icon, title}: props) => {
    return(
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.count}>{count}</Text>
            </View>
            <View style={styles.logoContainer}>
                <Icon source={icon} size={17} color="#1BBB6B"/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: '#0000004D',
        paddingHorizontal: 32,
        paddingVertical: 18,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 14
    },
    title: {
        fontSize: 13,
        fontWeight: 400,
        color: '#000000'
    },
    count: {
        fontSize: 13,
        fontWeight: 400,
        color: '#000000B2'
    },
    logoContainer: {
        borderRadius: 6,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DFD9FA99',
        padding: 6
    }
})
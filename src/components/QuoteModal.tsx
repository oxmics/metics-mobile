import { useContext, useState } from "react";
import { StyleSheet, View } from "react-native"
import { Button, Modal, PaperProvider, Text, TextInput, useTheme } from "react-native-paper"
import { DatePickerInput} from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { ThemeContext } from "../themes/ThemeContext";

interface props {
    show: boolean,
    closeModal: () => void,
    price: string,
    date: CalendarDate,
    setPrice: React.Dispatch<React.SetStateAction<string>>,
    setDate: React.Dispatch<React.SetStateAction<CalendarDate>>
}
export const QuoteModal = ({closeModal,date, price, setDate, setPrice, show}: props) => {
    const [inputDate, setInputDate] = useState<Date|undefined>(undefined);
    const [inputPrice, setInputPrice] = useState<string>("");
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const handleAdd = () => {
        setDate(inputDate);
        setPrice(inputPrice);
        closeModal();
    }
    return(
        <Modal visible={show} onDismiss={closeModal} dismissable>
                <View style={styles.container}>
                    <Text style={styles.title}>Quote</Text>
                    <Text style={{color: theme.colors.text}}>Promised Price</Text>
                    <View style={{height: 50, width: '100%'}}>
                        <TextInput 
                            placeholder="Price" 
                            mode="outlined" 
                            value={inputPrice} 
                            onChangeText={setInputPrice} 
                            keyboardType="numeric" 
                            textColor={theme.colors.text}
                            outlineColor={theme.colors.placeholder}
                            underlineStyle={{display: 'none'}} 
                            style={styles.inputBox} 
                            activeOutlineColor={theme.colors.text}
                            placeholderTextColor={theme.colors.placeholder}
                        />
                    </View>
                    <Text style={{color: theme.colors.text}}>Promised Date</Text>
                    <View style={{height: 50}}>
                        <PaperProvider theme={theme as any}>
                        <DatePickerInput
                            withDateFormatInLabel={false}
                            mode="outlined"
                            locale="en"
                            value={inputDate}
                            onChange={(d) => setInputDate(d)}
                            inputMode="start"
                            textColor={theme.colors.text}
                            outlineColor={theme.colors.placeholder}
                            underlineStyle={{display: 'none'}}
                            style={styles.inputBox}
                            activeOutlineColor={theme.colors.text}
                            placeholder="10/11/24"
                            placeholderTextColor={theme.colors.placeholder}
                        />
                        </PaperProvider>
                    </View>
                    <Button style={styles.closeBtn} labelStyle={{color: '#FFFFFF', fontSize: 11, fontWeight: 600}} onPress={handleAdd}>Add</Button>
                </View>
        </Modal>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
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
        color: theme.colors.placeholder,
        fontWeight: '400',
        fontSize: 12
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        color: theme.colors.text
    },
    closeBtn: {
        backgroundColor: '#00B976',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputBox: {
        borderRadius: 10,
        backgroundColor: theme.colors.surface
    },
})
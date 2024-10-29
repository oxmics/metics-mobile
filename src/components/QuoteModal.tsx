import { useState } from "react";
import { StyleSheet, View } from "react-native"
import { Button, Modal, PaperProvider, Text, TextInput } from "react-native-paper"
import { DatePickerInput} from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { MD3LightTheme as DefaultTheme} from "react-native-paper";

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#00B976",
    onPrimary: "#FFFFFF",
    onSurface: "#000000",
    surface: "#FFFFFF",
    onSurfaceVariant: "#000000",
    secondary: "#000000",
  },
};


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

    const handleAdd = () => {
        setDate(inputDate);
        setPrice(inputPrice);
        closeModal();
    }
    return(
        <Modal visible={show} onDismiss={closeModal} dismissable>
                <View style={styles.container}>
                    <Text style={styles.title}>Quote</Text>
                    <Text>Promised Price</Text>
                    <View style={{height: 50, width: '100%'}}>
                        <TextInput 
                            placeholder="Price" 
                            mode="outlined" 
                            value={inputPrice} 
                            onChangeText={setInputPrice} 
                            keyboardType="numeric" 
                            textColor="#000000" 
                            outlineColor="#00000033" 
                            underlineStyle={{display: 'none'}} 
                            style={styles.inputBox} 
                            activeOutlineColor="#000000AB"
                            placeholderTextColor={"#00000033"}
                        />
                    </View>
                    <Text>Promised Date</Text>
                    <View style={{height: 50}}>
                        <PaperProvider theme={customTheme}>
                        <DatePickerInput
                            withDateFormatInLabel={false}
                            mode="outlined"
                            locale="en"
                            value={inputDate}
                            onChange={(d) => setInputDate(d)}
                            inputMode="start"
                            textColor="#000000"
                            outlineColor="#00000033"
                            underlineStyle={{display: 'none'}}
                            style={styles.inputBox}
                            activeOutlineColor="#000000AB"
                            placeholder="10/11/24"
                            placeholderTextColor={"#00000033"}
                        />
                        </PaperProvider>
                    </View>
                    <Button style={styles.closeBtn} labelStyle={{color: '#FFFFFF', fontSize: 11, fontWeight: 600}} onPress={handleAdd}>Add</Button>
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
        fontWeight: '400',
        fontSize: 12
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000000CC'
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
        backgroundColor: '#FFFFFF'
    },
})
import { StyleSheet, View } from "react-native"
import { ActivityIndicator, Button, Checkbox, DataTable, Text, useTheme } from "react-native-paper"
import { TemplateType } from "../types/template"
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../themes/ThemeContext";

interface props {
    title: string,
    selectedTemplate: TemplateType | undefined,
    setSelectedTemplate: (template: TemplateType|undefined) => void,
    contentData: TemplateType[] | undefined,
}

export const TemplatesCard = ({contentData, title, selectedTemplate, setSelectedTemplate}: props) => {
    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([5, 10, 15]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, contentData ? contentData.length : 10);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);


    const handleTemplateSelect = (template: TemplateType) => {
        if(selectedTemplate && selectedTemplate.id === template.id) {
            setSelectedTemplate(undefined);
        }else{
            setSelectedTemplate(template)
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {contentData ? <View style={styles.card}>
                <DataTable style={{backgroundColor: theme.colors.surface}}>
                    <DataTable.Header style={{width: '100%'}}>
                        <DataTable.Title style={{width: '15%'}} textStyle={{color: theme.colors.text}}>Sl no</DataTable.Title>
                        <DataTable.Title style={{width: '75%'}} textStyle={{color: theme.colors.text}}>Name</DataTable.Title>
                        <DataTable.Title style={{width: '15%'}} textStyle={{color: theme.colors.text}}>Select</DataTable.Title>
                    </DataTable.Header>
                    {contentData.slice(from, to).map((item, index)=> (
                        <DataTable.Row key={item.id} style={{width: '100%'}}>
                            <DataTable.Cell style={{width: '15%'}} textStyle={{color: theme.colors.text}}>{(index+1)+(page*itemsPerPage)}</DataTable.Cell>
                            <DataTable.Cell style={{width: '70%'}} textStyle={{color: theme.colors.text}}>{item.name}</DataTable.Cell>
                            <DataTable.Cell style={{width: '15%'}}><Checkbox color="#00B976" status={ selectedTemplate ? selectedTemplate.id === item.id ? "checked" : "unchecked" : "unchecked"} onPress={()=> handleTemplateSelect(item)}/></DataTable.Cell>
                        </DataTable.Row>
                    ))}
                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(contentData.length / itemsPerPage)}
                        onPageChange={(page) => setPage(page)}
                        label={`${from + 1}-${to} of ${contentData.length}`}
                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                        numberOfItemsPerPage={itemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        showFastPaginationControls
                        selectPageDropdownLabel={'Rows per page'}
                        theme={theme}
                    />
                </DataTable>
            </View> : <ActivityIndicator size={"small"}/>}
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
        paddingHorizontal: 16,
        paddingVertical: 12,
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
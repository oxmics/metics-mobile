import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Checkbox, DataTable, Text } from 'react-native-paper';
import { TemplateType } from '../types/template';
import { useEffect, useState } from 'react';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface props {
    title: string,
    selectedTemplate: TemplateType | undefined,
    setSelectedTemplate: (template: TemplateType | undefined) => void,
    contentData: TemplateType[] | undefined,
}

export const TemplatesCard = ({ contentData, title, selectedTemplate, setSelectedTemplate }: props) => {
    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([5, 10, 15]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, contentData ? contentData.length : 10);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);


    const handleTemplateSelect = (template: TemplateType) => {
        if (selectedTemplate && selectedTemplate.id === template.id) {
            setSelectedTemplate(undefined);
        } else {
            setSelectedTemplate(template);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {contentData ? (
                        <View style={styles.content}>
                    <DataTable>
                        <DataTable.Header style={styles.tableHeader}>
                            <DataTable.Title style={styles.tableCellSlNo}>Sl no</DataTable.Title>
                            <DataTable.Title style={styles.tableCellName}>Name</DataTable.Title>
                            <DataTable.Title style={styles.tableCellSelect}>Select</DataTable.Title>
                        </DataTable.Header>
                        {contentData.slice(from, to).map((item, index) => (
                            <DataTable.Row key={item.id} style={styles.tableRow}>
                                <DataTable.Cell style={styles.tableCellSlNo}>{(index + 1) + (page * itemsPerPage)}</DataTable.Cell>
                                <DataTable.Cell style={styles.tableCellName}>{item.name}</DataTable.Cell>
                                <DataTable.Cell style={styles.tableCellSelect}>
                                    <Checkbox
                                        color={colors.primary[800]}
                                        status={selectedTemplate ? selectedTemplate.id === item.id ? 'checked' : 'unchecked' : 'unchecked'}
                                        onPress={() => handleTemplateSelect(item)}
                                    />
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(contentData.length / itemsPerPage)}
                            onPageChange={(nextPage) => setPage(nextPage)}
                            label={`${from + 1}-${to} of ${contentData.length}`}
                            numberOfItemsPerPageList={numberOfItemsPerPageList}
                            numberOfItemsPerPage={itemsPerPage}
                            onItemsPerPageChange={onItemsPerPageChange}
                            showFastPaginationControls
                            selectPageDropdownLabel={'Rows per page'}
                        />
                    </DataTable>
                </View>
            ) : (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="small" color={colors.primary[800]} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.sm,
    },
    title: {
        ...typography.styles.h4,
        marginBottom: spacing.md,
        color: colors.primary[800],
    },
    content: {
        backgroundColor: colors.neutral.background,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    tableHeader: {
        backgroundColor: colors.primary[50],
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    tableRow: {
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    tableCellSlNo: {
        flex: 1,
    },
    tableCellName: {
        flex: 4,
    },
    tableCellSelect: {
        flex: 1,
    },
    loaderContainer: {
        padding: spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

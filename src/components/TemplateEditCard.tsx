import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { TemplateType } from '../types/template';
import { useEffect, useState } from 'react';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface props {
    title: string,
    contentData: TemplateType,
    saveFn: (id: string, value: string) => void,
    closeFn: () => void,
    saving: boolean
}

export const TemplateEditCard = ({ closeFn, saveFn, saving, contentData, title }: props) => {
    const [description, setDescription] = useState<string>('');

    useEffect(() => {
        setDescription(contentData.display_description);
    }, [contentData]);

    const handleSave = () => {
        saveFn(contentData.id, description);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <TextInput
                style={styles.inputBox}
                mode="outlined"
                value={description}
                onChangeText={setDescription}
                placeholder="Description here..."
                placeholderTextColor={colors.neutral.text.tertiary}
                multiline
                numberOfLines={4}
                textColor={colors.neutral.text.primary}
                outlineColor={colors.neutral.border.default}
                activeOutlineColor={colors.primary[800]}
                selectionColor={colors.primary[800]}
                contentStyle={styles.inputContent}
            />
            <View style={styles.footer}>
                <View style={styles.btnContainer}>
                    <Button
                        mode="outlined"
                        onPress={() => closeFn()}
                        textColor={colors.neutral.text.secondary}
                        style={styles.closeBtn}
                    >
                        Cancel
                    </Button>
                    <Button
                        loading={saving}
                        style={styles.saveBtn}
                        labelStyle={styles.saveLabel}
                        onPress={() => handleSave()}
                        mode="contained"
                    >
                        Save Changes
                    </Button>
                </View>
            </View>
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
    inputBox: {
        backgroundColor: colors.neutral.background,
        fontSize: typography.size.body,
    },
    inputContent: {
        textAlignVertical: 'top',
    },
    footer: {
        marginTop: spacing.lg,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    btnContainer: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    closeBtn: {
        borderColor: colors.neutral.border.default,
        borderRadius: borderRadius.base,
    },
    saveBtn: {
        backgroundColor: colors.primary[700],
        borderRadius: borderRadius.base,
    },
    saveLabel: {
        ...typography.styles.label,
        color: colors.neutral.white,
    },
});

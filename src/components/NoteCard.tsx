import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface props {
    title: string,
    content: string,
    setContent: React.Dispatch<React.SetStateAction<string>>
}

export const NoteCard = ({ content, setContent, title }: props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <TextInput
                style={styles.inputBox}
                mode="outlined"
                value={content}
                onChangeText={setContent}
                placeholder="Type your note here..."
                placeholderTextColor={colors.neutral.text.tertiary}
                multiline
                numberOfLines={4}
                textColor={colors.neutral.text.primary}
                outlineColor={colors.neutral.border.default}
                activeOutlineColor={colors.primary[800]}
                selectionColor={colors.primary[800]}
                contentStyle={styles.inputContent}
            />
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
});

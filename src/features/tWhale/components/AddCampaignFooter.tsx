import { useAppTheme } from '@/shared/hooks';
import React, { FC } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

const AddCampaignFooter: FC<Props> = ({ value, onChangeText, onSubmit }) => {
  const { colors, spacing, typography } = useAppTheme();

  return (
    <View style={[styles.row, { gap: spacing.sm }]}>
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder="New campaign name"
        placeholderTextColor={colors.textSecondary}
        onSubmitEditing={onSubmit}
      />
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: colors.primary, paddingHorizontal: spacing.md },
        ]}
        onPress={onSubmit}
      >
        <Text style={{ color: colors.primaryForeground, ...typography.label }}>
          Add
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 40,
  },
  addButton: {
    justifyContent: 'center',
    borderRadius: 4,
  },
});

export default React.memo(AddCampaignFooter);

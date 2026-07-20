import { useAppTheme } from '@/shared/hooks';
import React, { FC } from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

const CampaignSearchBar: FC<Props> = ({ value, onChangeText }) => {
  const { colors, spacing } = useAppTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          borderColor: colors.border,
          color: colors.text,
          marginHorizontal: spacing.md,
          marginBottom: spacing.md,
        },
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder="Search campaigns"
      placeholderTextColor={colors.textSecondary}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 40,
  },
});

export default React.memo(CampaignSearchBar);

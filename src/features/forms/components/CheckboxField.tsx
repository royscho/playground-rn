import { useAppTheme } from '@/shared/hooks';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

function CheckboxField<T extends FieldValues>({
  control,
  name,
  label,
}: Props<T>) {
  const { colors, spacing, typography } = useAppTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={{ marginBottom: spacing.md }}>
          <View style={[styles.row, { gap: spacing.sm }]}>
            <Switch
              value={!!value}
              onValueChange={onChange}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
            <Text style={{ color: colors.text, ...typography.body }}>
              {label}
            </Text>
          </View>
          {error && (
            <Text
              style={[
                typography.caption,
                { color: colors.error, marginTop: spacing.xs },
              ]}
            >
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default React.memo(CheckboxField) as typeof CheckboxField;

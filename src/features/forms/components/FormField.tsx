import { useAppTheme } from '@/shared/hooks';
import React from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
}

// Generic over the form's field values — RN's TextInput doesn't expose a
// ref shape RHF's register() can bind to directly (that's a web-input
// thing), so every text field goes through Controller instead.
function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  keyboardType,
  multiline,
}: Props<T>) {
  const { colors, spacing, typography } = useAppTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View style={{ marginBottom: spacing.md }}>
          <Text
            style={[
              typography.label,
              { color: colors.text, marginBottom: spacing.xs },
            ]}
          >
            {label}
          </Text>
          <TextInput
            value={value === undefined ? '' : String(value)}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            keyboardType={keyboardType}
            multiline={multiline}
            style={[
              styles.input,
              multiline && styles.multiline,
              {
                borderColor: error ? colors.error : colors.border,
                color: colors.text,
                paddingHorizontal: spacing.sm,
              },
            ]}
          />
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
  input: {
    borderWidth: 1,
    borderRadius: 4,
    height: 44,
  },
  multiline: {
    height: 80,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
});

export default React.memo(FormField) as typeof FormField;

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';
import FormField from '../components/FormField';
import CheckboxField from '../components/CheckboxField';
import { ProfileFormValues, profileFormSchema } from '../schema';

export const FormsScreen = () => {
  const { colors, spacing, typography } = useAppTheme();
  const [submitted, setSubmitted] = useState<ProfileFormValues | null>(null);

  const { control, handleSubmit, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      age: '',
      phone: '',
      company: '',
      bio: '',
      acceptTerms: false,
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    setSubmitted(values);
  };

  return (
    <ScreenWrapper
      title="Forms"
      form
      footer={
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={[styles.submit, { backgroundColor: colors.primary }]}
        >
          <Text
            style={{ color: colors.primaryForeground, ...typography.label }}
          >
            Submit
          </Text>
        </TouchableOpacity>
      }
    >
      <FormField
        control={control}
        name="name"
        label="Name"
        placeholder="Jane Doe"
      />
      <FormField
        control={control}
        name="email"
        label="Email"
        placeholder="jane@example.com"
        keyboardType="email-address"
      />
      <FormField
        control={control}
        name="age"
        label="Age"
        placeholder="25"
        keyboardType="number-pad"
      />
      <FormField
        control={control}
        name="phone"
        label="Phone"
        placeholder="+1 (555) 123-4567"
        keyboardType="phone-pad"
      />
      <FormField
        control={control}
        name="company"
        label="Company"
        placeholder="Triple Whale"
      />
      <FormField
        control={control}
        name="bio"
        label="Bio (optional)"
        placeholder="A short bio…"
        multiline
      />
      <CheckboxField
        control={control}
        name="acceptTerms"
        label="I accept the terms"
      />

      {submitted && (
        <View
          style={[
            styles.result,
            { backgroundColor: colors.surface, padding: spacing.md },
          ]}
        >
          <Text style={{ color: colors.success, ...typography.label }}>
            Submitted
          </Text>
          <Text style={{ color: colors.textSecondary, ...typography.caption }}>
            {JSON.stringify(submitted)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              reset();
              setSubmitted(null);
            }}
          >
            <Text style={{ color: colors.primary, ...typography.caption }}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  submit: {
    alignItems: 'center',
    borderRadius: 4,
    paddingVertical: 12,
  },
  result: {
    borderRadius: 8,
    marginTop: 8,
  },
});

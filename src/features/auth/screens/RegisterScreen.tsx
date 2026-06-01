import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';
import type { AuthStackParamList } from '@/app/navigation/types';
import { useRegister } from '../hooks';
import type { AuthError } from '../types/auth.types';

type RegisterNavProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const { colors, spacing, typography } = useAppTheme();
  const navigation = useNavigation<RegisterNavProp>();
  const { mutate: register, isPending, error } = useRegister();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const authError = error as AuthError | null;

  const styles = StyleSheet.create({
    form: {
      width: '100%',
      gap: spacing.md,
    },
    label: {
      ...typography.body,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: spacing.md,
      ...typography.body,
      color: colors.text,
    },
    inputError: {
      borderColor: colors.error,
    },
    errorText: {
      ...typography.caption,
      color: colors.error,
      marginTop: spacing.xs,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: spacing.md,
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      ...typography.body,
      color: colors.primaryForeground,
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.lg,
      gap: spacing.xs,
    },
    footerText: {
      ...typography.body,
      color: colors.textSecondary,
    },
    footerLink: {
      ...typography.body,
      color: colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <ScreenWrapper title="Create Account" centered scrollable={false}>
      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[
              styles.input,
              authError?.field === 'name' && styles.inputError,
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="words"
            editable={!isPending}
          />
          {authError?.field === 'name' && (
            <Text style={styles.errorText}>{authError.message}</Text>
          )}
        </View>

        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[
              styles.input,
              authError?.field === 'email' && styles.inputError,
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isPending}
          />
          {authError?.field === 'email' && (
            <Text style={styles.errorText}>{authError.message}</Text>
          )}
        </View>

        <View>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[
              styles.input,
              authError?.field === 'password' && styles.inputError,
            ]}
            value={password}
            onChangeText={setPassword}
            placeholder="Min 6 characters"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            editable={!isPending}
          />
          {authError?.field === 'password' && (
            <Text style={styles.errorText}>{authError.message}</Text>
          )}
        </View>

        {authError && !authError.field && (
          <Text style={styles.errorText}>{authError.message}</Text>
        )}

        <TouchableOpacity
          style={[styles.button, isPending && styles.buttonDisabled]}
          onPress={() => register({ email, password, name })}
          disabled={isPending}
          accessibilityRole="button"
          accessibilityLabel="Create account"
        >
          {isPending ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

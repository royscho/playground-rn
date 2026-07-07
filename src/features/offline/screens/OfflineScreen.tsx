import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';
import { OfflineBanner } from '../components/OfflineBanner';
import { useCreateNote, useDeleteNote, useNotes } from '../hooks/useNotes';
import type { Note } from '../types/notes.types';

export const OfflineScreen = () => {
  const { colors, spacing, typography } = useAppTheme();
  const { data: notes, isLoading, error, refetch } = useNotes();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  // ponytail: single-field input, useState instead of RHF+Zod — not worth
  // pulling in a form library for one TextInput. Swap to RHF+Zod once this
  // screen grows past one field.
  const [title, setTitle] = useState('');

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: spacing.sm,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    rowText: { ...typography.body, color: colors.text, flex: 1, marginRight: spacing.sm },
    deleteText: { ...typography.label, color: colors.error },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: spacing.xs,
      paddingHorizontal: spacing.sm,
      color: colors.text,
      height: spacing.xl + spacing.sm,
      ...typography.body,
    },
    footerRow: { flexDirection: 'row', gap: spacing.sm },
    addButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      justifyContent: 'center',
      borderRadius: spacing.xs,
    },
    addButtonText: { ...typography.label, color: colors.primaryForeground },
    list: { flex: 1 },
    inlineError: { ...typography.bodySmall, color: colors.error, marginBottom: spacing.sm },
  });

  const handleAdd = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    createNote.mutate(trimmed);
    setTitle('');
  };

  const renderItem = ({ item }: { item: Note }) => (
    <View style={styles.row}>
      <Text style={styles.rowText}>{item.title}</Text>
      <TouchableOpacity onPress={() => deleteNote.mutate(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper
      title="Offline"
      subtitle="Persisted cache + queued mutations"
      scrollable={false}
      loading={isLoading}
      // A fetch failing (e.g. a transient reconnect blip) shouldn't blank out
      // cached notes + the connectivity banner — only block the screen when
      // there's truly nothing cached to show yet.
      error={notes ? null : error}
      onRetry={refetch}
      footer={
        <View style={styles.footerRow}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="New note"
            placeholderTextColor={colors.textSecondary}
            onSubmitEditing={handleAdd}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <OfflineBanner />
      {error && notes && <Text style={styles.inlineError}>{error.message}</Text>}
      <FlatList style={styles.list} data={notes} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </ScreenWrapper>
  );
};

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/shared/hooks';
import type { FeedPost } from '../hooks/useFeedPosts';

interface PostCardProps {
  post: FeedPost;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { colors, spacing, typography } = useAppTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    meta: {
      ...typography.caption,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      textTransform: 'uppercase',
    },
    title: {
      ...typography.body,
      color: colors.text,
      fontWeight: '600',
      marginBottom: spacing.xs,
      textTransform: 'capitalize',
    },
    body: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.card}>
      <Text style={styles.meta}>Post #{post.id}</Text>
      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
      <Text style={styles.body} numberOfLines={3}>{post.body}</Text>
    </View>
  );
};

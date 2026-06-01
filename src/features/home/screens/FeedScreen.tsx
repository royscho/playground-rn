import React, { useCallback } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';
import { useFeedPosts } from '../hooks/useFeedPosts';
import { PostCard } from '../components/PostCard';
import type { FeedPost } from '../hooks/useFeedPosts';

const keyExtractor = (item: FeedPost) => String(item.id);

export const FeedScreen = () => {
  const { colors, spacing, typography } = useAppTheme();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useFeedPosts();

  const posts = data?.pages.flat() ?? [];

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const styles = StyleSheet.create({
    list: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
    },
    footer: {
      alignItems: 'center',
      paddingVertical: spacing.lg,
    },
    endText: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    errorText: {
      ...typography.body,
      color: colors.error,
      textAlign: 'center',
    },
    retryText: {
      ...typography.body,
      color: colors.primary,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
  });

  const renderFooter = () => (
    <View style={styles.footer}>
      {isFetchingNextPage ? (
        <ActivityIndicator color={colors.primary} />
      ) : !hasNextPage && posts.length > 0 ? (
        <Text style={styles.endText}>All caught up</Text>
      ) : null}
    </View>
  );

  return (
    <ScreenWrapper
      title="Feed"
      loading={isLoading}
      error={isError ? new Error('Failed to load posts') : null}
      onRetry={refetch}
      scrollable={false}
      padded={false}
    >
      <FlatList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.list}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

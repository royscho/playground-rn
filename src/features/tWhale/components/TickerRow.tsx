import { useAppTheme } from '@/shared/hooks';
import React, { FC, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTickerStoreImmer } from '../store/tickerStore.immer';
import { useToggleFavoriteMutation } from '../hooks/useCampaigns';
import { Campaign } from '../types';

interface Props {
  item: Campaign;
  showStarButton: boolean;
  isActive: boolean;
}

const TickerRow: FC<Props> = ({ item, showStarButton, isActive }) => {
  const metric = useTickerStoreImmer(state => state.metrics[item.campaignId]);
  // isFavorite lives on the Campaign itself (server metadata) now, not a
  // separate store Set — see useToggleFavoriteMutation.
  const isWatchlisted = !!item.isFavorite;
  const { colors, spacing } = useAppTheme();
  const toggleFavorite = useToggleFavoriteMutation();

  const toggle = useCallback(
    () =>
      toggleFavorite.mutate({
        campaignId: item.campaignId,
        isFavorite: !isWatchlisted,
      }),
    [toggleFavorite, item.campaignId, isWatchlisted],
  );

  return (
    <View
      style={{
        backgroundColor: isActive ? colors.success : colors.secondary,
        padding: spacing.lg,
        marginBottom: spacing.sm,
      }}
    >
      {showStarButton && (
        <TouchableOpacity
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={
            isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'
          }
          style={[
            styles.title,
            {
              gap: spacing.sm,
              paddingBottom: spacing.sm,
            },
          ]}
        >
          <Star
            size={20}
            color={colors.warning}
            fill={isWatchlisted ? colors.warning : 'none'}
          />
          <Text
            numberOfLines={1}
            style={[{ color: colors.text, paddingRight: spacing.md }]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.data}>
        <Text style={[styles.title, { color: colors.text }]}>
          {`spend: ${metric?.spend}`}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          {`revenue: ${metric?.revenue}`}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          {`roas: ${metric?.roas.toFixed(2)}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  data: {
    alignItems: 'flex-start',
  },
});

export default React.memo(TickerRow);

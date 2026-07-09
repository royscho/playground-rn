import { ScreenWrapper } from '@/shared/components';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useTickerStore } from '../store/tickerStore';
import { useAppTheme } from '@/shared/hooks';
import TickerRow from '../components/TickerRow';
import { Campaign } from '../types';
import { useEffect, useMemo } from 'react';

const LiveTicker = () => {
  const { colors, spacing } = useAppTheme();
  const watchlistSorted = useTickerStore(state => state.watchlistSorted);
  const totalSpendToday = useTickerStore(state => state.totalSpendToday);
  const allCampaigns = useTickerStore(state => state.allCampaigns);
  const activeCampaigns = useTickerStore(state => state.activeCampaigns);
  const connect = useTickerStore(state => state.connect);
  const disconnect = useTickerStore(state => state.disconnect);

  // Set for O(1) membership check — rarely changes, cheap to recompute either way.
  const activeIds = useMemo(
    () => new Set(activeCampaigns.map(c => c.campaignId)),
    [activeCampaigns],
  );

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: {
          color: colors.text,
          textAlign: 'center',
          padding: spacing.md,
        },
        item: {
          backgroundColor: colors.secondary,
          padding: spacing.lg,
          marginVertical: spacing.md,
        },
        header: {
          backgroundColor: colors.background,
        },
      }),
    [colors.secondary, colors.text, colors.background, spacing.lg, spacing.md],
  );

  const renderItemSort = ({ item }: { item: Campaign }) => (
    <TickerRow
      item={item}
      showStarButton={false}
      isActive={activeIds.has(item.campaignId)}
    />
  );

  const renderItem = ({ item }: { item: Campaign }) => (
    <TickerRow
      item={item}
      showStarButton={true}
      isActive={activeIds.has(item.campaignId)}
    />
  );

  return (
    <ScreenWrapper title="Ticker" scrollable={false}>
      <Text
        style={styles.title}
      >{`Total Spend Today: ${totalSpendToday}`}</Text>
      <SectionList
        keyExtractor={(item, index) => item.campaignId + index}
        sections={[
          {
            title: 'Watchlist (by ROAS)',
            data: watchlistSorted,
            renderItem: renderItemSort,
          },
          {
            title: 'All Campaigns',
            data: allCampaigns,
            renderItem,
          },
        ]}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>
        )}
      />
    </ScreenWrapper>
  );
};

export default LiveTicker;

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

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={[styles.title, { padding: spacing.md, color: colors.text }]}>
        {title}
      </Text>
    </View>
  );

  const keyExtractor = (item: Campaign, index: number) =>
    item.campaignId + index;

  return (
    <ScreenWrapper title="Ticker" scrollable={false}>
      <Text
        style={[styles.title, { color: colors.text, padding: spacing.md }]}
      >{`Total Spend Today: ${totalSpendToday}`}</Text>
      <SectionList
        keyExtractor={keyExtractor}
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
        renderSectionHeader={renderSectionHeader}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});

export default LiveTicker;

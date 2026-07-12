import { ScreenWrapper } from '@/shared/components';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/shared/hooks';
import { observer } from 'mobx-react-lite';
import { tickerStore } from '../store/tickerStore.mobx';
import TickerRowMobx from '../components/TickerRowMobx';
import { Campaign } from '../types';
import { useEffect, useMemo } from 'react';

const LiveTickerMobx = observer(() => {
  const { colors, spacing } = useAppTheme();

  // Reading these directly off tickerStore — no selector hooks. `observer`
  // (wrapping this whole component) re-renders it when any observable read
  // during render changes: watchlistSorted/totalSpendToday are `computed`
  // getters, so this only re-renders when THEIR underlying dependencies
  // change, same as the Zustand version's precomputed store fields.
  const { watchlistSorted, totalSpendToday, allCampaigns, activeCampaigns } =
    tickerStore;

  const activeIds = useMemo(
    () => new Set(activeCampaigns.map(c => c.campaignId)),
    [activeCampaigns],
  );

  useEffect(() => {
    tickerStore.connect();
    return () => tickerStore.disconnect();
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: { color: colors.text, textAlign: 'center', padding: spacing.md },
        header: { backgroundColor: colors.background },
      }),
    [colors.text, colors.background, spacing.md],
  );

  const renderItemSort = ({ item }: { item: Campaign }) => (
    <TickerRowMobx
      item={item}
      showStarButton={false}
      isActive={activeIds.has(item.campaignId)}
    />
  );

  const renderItem = ({ item }: { item: Campaign }) => (
    <TickerRowMobx
      item={item}
      showStarButton={true}
      isActive={activeIds.has(item.campaignId)}
    />
  );

  return (
    <ScreenWrapper title="Ticker (MobX)" scrollable={false}>
      <Text style={styles.title}>{`Total Spend Today: ${totalSpendToday}`}</Text>
      <SectionList
        keyExtractor={(item, index) => item.campaignId + index}
        sections={[
          {
            title: 'Watchlist (by ROAS)',
            data: watchlistSorted,
            renderItem: renderItemSort,
          },
          { title: 'All Campaigns', data: allCampaigns, renderItem },
        ]}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>
        )}
      />
    </ScreenWrapper>
  );
});

export default LiveTickerMobx;

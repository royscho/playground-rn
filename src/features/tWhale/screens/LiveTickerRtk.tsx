import { ScreenWrapper } from '@/shared/components';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/shared/hooks';
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
  tickerStore,
  connectStream,
  disconnectStream,
  selectTotalSpendToday,
  selectWatchlistSorted,
} from '../store/tickerStore.rtk';
import type { AppDispatch, RootState } from '../store/tickerStore.rtk';
import TickerRowRtk from '../components/TickerRowRtk';
import { Campaign } from '../types';
import { useEffect, useMemo } from 'react';

const LiveTickerRtkScreen = () => {
  const { colors, spacing } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();

  // Precomputed via createSelector (reselect) — not stored in the slice.
  // Only recomputes when its input selectors' outputs actually changed.
  const totalSpendToday = useSelector(selectTotalSpendToday);
  const watchlistSorted = useSelector(selectWatchlistSorted);
  const allCampaigns = useSelector((state: RootState) => state.ticker.allCampaigns);
  const activeCampaigns = useSelector(
    (state: RootState) => state.ticker.activeCampaigns,
  );

  const activeIds = useMemo(
    () => new Set(activeCampaigns.map(c => c.campaignId)),
    [activeCampaigns],
  );

  useEffect(() => {
    dispatch(connectStream());
    return () => {
      dispatch(disconnectStream());
    };
  }, [dispatch]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: { color: colors.text, textAlign: 'center', padding: spacing.md },
        header: { backgroundColor: colors.background },
      }),
    [colors.text, colors.background, spacing.md],
  );

  const renderItemSort = ({ item }: { item: Campaign }) => (
    <TickerRowRtk
      item={item}
      showStarButton={false}
      isActive={activeIds.has(item.campaignId)}
    />
  );

  const renderItem = ({ item }: { item: Campaign }) => (
    <TickerRowRtk
      item={item}
      showStarButton={true}
      isActive={activeIds.has(item.campaignId)}
    />
  );

  return (
    <ScreenWrapper title="Ticker (RTK)" scrollable={false}>
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
};

// This feature's Redux store is standalone (not part of App.tsx's global
// provider tree, unlike a real app where you'd have exactly one root
// store). Provider wraps just this screen so it's drop-in navigable like
// the Zustand/MobX versions without touching App.tsx.
const LiveTickerRtk = () => (
  <Provider store={tickerStore}>
    <LiveTickerRtkScreen />
  </Provider>
);

export default LiveTickerRtk;

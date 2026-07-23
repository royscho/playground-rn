import { ScreenWrapper } from '@/shared/components';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTickerStoreImmer } from '../store/tickerStore.immer';
import { useAppTheme } from '@/shared/hooks';
import TickerRow from '../components/TickerRow';
import { Campaign } from '../types';
import { useCampaignsQuery } from '../hooks/useCampaigns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import FilterChips from '../components/FilterChips';
import CampaignSearchBar from '../components/CampaignSearchBar';
import { filterCampaigns } from '../utils';
import {
  selectActiveCampaigns,
  selectTotalSpendToday,
} from '../store/tickerSelelctors';
import { CircleCheckIcon } from 'lucide-react-native';

const LiveTickerList = () => {
  const { colors, spacing } = useAppTheme();
  const totalSpendToday = useTickerStoreImmer(selectTotalSpendToday);
  const allCampaigns = useTickerStoreImmer(state => state.allCampaigns);
  const activeCampaigns = useTickerStoreImmer(selectActiveCampaigns);
  const setCampaigns = useTickerStoreImmer(state => state.setCampaigns);
  const connect = useTickerStoreImmer(state => state.connect);
  const isConnected = useTickerStoreImmer(state => state.isConnected);
  const disconnect = useTickerStoreImmer(state => state.disconnect);

  const campaignsQuery = useCampaignsQuery();
  // One-directional handoff: Query owns the initial fetch, the store just
  // receives the result once it's ready. The store never reaches back into
  // Query's cache directly.
  useEffect(() => {
    if (campaignsQuery.data) setCampaigns(campaignsQuery.data);
  }, [campaignsQuery.data, setCampaigns]);

  // Sequencing: don't start the mock stream until the initial campaign list
  // actually exists — ticking for a list you don't have yet doesn't mean
  // anything. disconnect() still runs unconditionally on unmount.
  useEffect(() => {
    if (!campaignsQuery.isSuccess) return;
    connect();
    return () => disconnect();
  }, [campaignsQuery.isSuccess, connect, disconnect]);

  // Set for O(1) membership check — rarely changes, cheap to recompute either way.
  const activeIds = useMemo(
    () => new Set(activeCampaigns.map(c => c.campaignId)),
    [activeCampaigns],
  );

  // Local, ephemeral UI state — pure filter/search input, doesn't belong in
  // the ticker store (nothing else reads it, nothing streams it).
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'active'>('all');

  const filteredAllCampaigns = useMemo(
    () => filterCampaigns(allCampaigns, search, filterMode, activeIds),
    [allCampaigns, search, filterMode, activeIds],
  );

  const renderItem = useCallback(
    ({ item }: { item: Campaign }) => (
      <TickerRow
        item={item}
        showStarButton={true}
        isActive={activeIds.has(item.campaignId)}
      />
    ),
    [activeIds],
  );

  const keyExtractor = useCallback((item: Campaign) => item.campaignId, []);

  return (
    <ScreenWrapper
      title="Ticker"
      scrollable={false}
      form
      loading={campaignsQuery.isLoading}
      error={allCampaigns.length === 0 ? campaignsQuery.error : null}
      onRetry={campaignsQuery.refetch}
    >
      <View style={styles.total}>
        <CircleCheckIcon color={isConnected ? colors.success : colors.error} />
        <Text
          style={[styles.title, { color: colors.text, padding: spacing.md }]}
        >{`Total Spend Today: ${totalSpendToday}`}</Text>
      </View>
      <CampaignSearchBar value={search} onChangeText={setSearch} />
      <FilterChips filterMode={filterMode} onChange={setFilterMode} />
      <FlatList
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        data={filteredAllCampaigns}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LiveTickerList;

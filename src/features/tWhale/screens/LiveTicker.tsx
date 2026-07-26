import { ScreenWrapper } from '@/shared/components';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useTickerStoreImmer } from '../store/tickerStore.immer';
import { useAppTheme } from '@/shared/hooks';
import TickerRow from '../components/TickerRow';
import { Campaign, SortMetric } from '../types';
import {
  useCampaignsQuery,
  useCreateCampaignMutation,
} from '../hooks/useCampaigns';
import { useEffect, useMemo, useState } from 'react';
import StatCard from '../components/StatCard';
import FilterChips from '../components/FilterChips';
import CampaignSearchBar from '../components/CampaignSearchBar';
import AddCampaignFooter from '../components/AddCampaignFooter';
import SortDropdown from '../components/SortDropdown';
import { filterCampaigns, sortCampaignsByMetric } from '../utils';
import {
  selectActiveCampaigns,
  selectTotalSpendToday,
  selectWatchlistSorted,
} from '../store/tickerSelelctors';
import { CircleCheckIcon } from 'lucide-react-native';

const LiveTicker = () => {
  const { colors, spacing } = useAppTheme();
  const watchlistSorted = useTickerStoreImmer(selectWatchlistSorted);
  const totalSpendToday = useTickerStoreImmer(selectTotalSpendToday);
  const allCampaigns = useTickerStoreImmer(state => state.allCampaigns);
  const activeCampaigns = useTickerStoreImmer(selectActiveCampaigns);
  const metrics = useTickerStoreImmer(state => state.metrics);
  const setCampaigns = useTickerStoreImmer(state => state.setCampaigns);
  const connect = useTickerStoreImmer(state => state.connect);
  const isConnected = useTickerStoreImmer(state => state.isConnected);
  const disconnect = useTickerStoreImmer(state => state.disconnect);

  const campaignsQuery = useCampaignsQuery();
  const createCampaign = useCreateCampaignMutation();
  const [newCampaignName, setNewCampaignName] = useState('');

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
  const [sortBy, setSortBy] = useState<SortMetric>('revenue');

  const filteredAllCampaigns = useMemo(
    () => filterCampaigns(allCampaigns, search, filterMode, activeIds),
    [allCampaigns, search, filterMode, activeIds],
  );

  // metrics is a dependency here too, so this recomputes every tick same as
  // filteredAllCampaigns's own consumers already do — see the comment on
  // sortCampaignsByMetric in utils.ts for why that's fine at this scale.
  const sortedAllCampaigns = useMemo(
    () => sortCampaignsByMetric(filteredAllCampaigns, metrics, sortBy),
    [filteredAllCampaigns, metrics, sortBy],
  );

  const filteredWatchlistSorted = useMemo(
    () => filterCampaigns(watchlistSorted, search, filterMode, activeIds),
    [watchlistSorted, search, filterMode, activeIds],
  );

  const handleAdd = () => {
    const trimmed = newCampaignName.trim();
    if (!trimmed) return;
    createCampaign.mutate(trimmed);
    setNewCampaignName('');
  };

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
    <ScreenWrapper
      title="Ticker"
      scrollable={false}
      form
      loading={campaignsQuery.isLoading}
      error={allCampaigns.length === 0 ? campaignsQuery.error : null}
      onRetry={campaignsQuery.refetch}
      footer={
        <AddCampaignFooter
          value={newCampaignName}
          onChangeText={setNewCampaignName}
          onSubmit={handleAdd}
        />
      }
    >
      <StatCard
        label="Active Users"
        value={204}
        variant="warning"
        trend="up"
        trendText={2.4}
      />
      <View style={styles.total}>
        <CircleCheckIcon color={isConnected ? colors.success : colors.error} />
        <Text
          style={[styles.title, { color: colors.text, padding: spacing.md }]}
        >{`Total Spend Today: ${totalSpendToday}`}</Text>
      </View>

      <CampaignSearchBar value={search} onChangeText={setSearch} />
      <FilterChips filterMode={filterMode} onChange={setFilterMode} />
      <SortDropdown value={sortBy} onChange={setSortBy} />
      <SectionList
        keyExtractor={keyExtractor}
        sections={[
          {
            title: 'Watchlist (by ROAS)',
            data: filteredWatchlistSorted,
            renderItem: renderItemSort,
          },
          {
            title: 'All Campaigns',
            data: sortedAllCampaigns,
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
  total: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LiveTicker;

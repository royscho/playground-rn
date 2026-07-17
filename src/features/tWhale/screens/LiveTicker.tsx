import { ScreenWrapper } from '@/shared/components';
import {
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTickerStore } from '../store/tickerStore';
import { useAppTheme } from '@/shared/hooks';
import TickerRow from '../components/TickerRow';
import { Campaign } from '../types';
import {
  useCampaignsQuery,
  useCreateCampaignMutation,
} from '../hooks/useCampaigns';
import { useEffect, useMemo, useState } from 'react';

const LiveTicker = () => {
  const { colors, spacing, typography } = useAppTheme();
  const watchlistSorted = useTickerStore(state => state.watchlistSorted);
  const totalSpendToday = useTickerStore(state => state.totalSpendToday);
  const allCampaigns = useTickerStore(state => state.allCampaigns);
  const activeCampaigns = useTickerStore(state => state.activeCampaigns);
  const setCampaigns = useTickerStore(state => state.setCampaigns);
  const connect = useTickerStore(state => state.connect);
  const disconnect = useTickerStore(state => state.disconnect);

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
        <View style={styles.footerRow}>
          <TextInput
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text },
            ]}
            value={newCampaignName}
            onChangeText={setNewCampaignName}
            placeholder="New campaign name"
            placeholderTextColor={colors.textSecondary}
            onSubmitEditing={handleAdd}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAdd}
          >
            <Text
              style={{ color: colors.primaryForeground, ...typography.label }}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>
      }
    >
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
  footerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 40,
  },
  addButton: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 4,
  },
});

export default LiveTicker;

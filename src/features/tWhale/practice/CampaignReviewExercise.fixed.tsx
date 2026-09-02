// FIXED VERSION — for diffing against CampaignReviewExercise.tsx.
// Not imported anywhere, not wired into navigation.
//
// Architecture note: the original review file streamed WebSocket updates
// straight into the `campaigns` Query cache. Real campaign objects (name,
// status, budget) are REST-shaped — fetched once, mutated rarely, belong in
// Query. What a live socket actually carries is METRICS (spend/revenue/roas)
// — high-frequency, numeric, keyed by campaignId, no natural staleTime or
// queryFn to refetch. That's exactly the shape useTickerStore already
// exists for (see ../store/tickerStore.ts) — reused here instead of
// reinventing a second live-data store.

import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { client } from '@/shared/api/client';
import { useTickerStore } from '../store/tickerStore';
import type { MetricTick } from '../types';

// status matches tickerStore's own Campaign type ('pause', not 'paused') —
// campaigns get pushed into that store via setCampaigns below, so the two
// shapes have to agree.
type Campaign = {
  campaignId: string;
  name: string;
  status: 'active' | 'pause';
  budget: number;
};

const CAMPAIGNS_KEY = ['campaigns'] as const;

// Was raw fetch() to a hardcoded URL — bypassed the shared client, so no
// auth token injection and no 401->refresh->retry queue. client.get already
// prefixes Config.API_BASE_URL and throws ApiError on non-2xx.
const fetchCampaigns = () => client.get<Campaign[]>('/campaigns');

const updateBudget = (campaignId: string, budget: number) =>
  client.patch<Campaign>(`/campaigns/${campaignId}`, { budget });

type CampaignRowProps = {
  campaign: Campaign;
  metric: MetricTick | undefined;
  onSelect: (id: string) => void;
  onLoadHistory: (id: string) => void;
  onBumpBudget: (id: string, nextBudget: number) => void;
};

// Was an inline renderItem — new function + new closures for every row on
// every parent render. Extracted + memoized so a row only re-renders when
// ITS OWN props change, not on every filter keystroke or ticker update.
const CampaignRow = React.memo(
  ({
    campaign,
    metric,
    onSelect,
    onLoadHistory,
    onBumpBudget,
  }: CampaignRowProps) => (
    <TouchableOpacity onPress={() => onSelect(campaign.campaignId)}>
      <Text>{campaign.name}</Text>
      <Text>{campaign.status === 'active' ? 'Active' : 'Pause'}</Text>
      {metric ? (
        <Text>
          spend {metric.spend.toFixed(2)} / revenue {metric.revenue.toFixed(2)}{' '}
          / roas {metric.roas.toFixed(2)}
        </Text>
      ) : null}
      <TouchableOpacity onPress={() => onLoadHistory(campaign.campaignId)}>
        <Text>Spend history</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onBumpBudget(campaign.campaignId, campaign.budget + 100)}
      >
        <Text>+100 budget</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  ),
);

export const CampaignReviewExerciseFixed = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const campaignsQuery = useQuery({
    queryKey: CAMPAIGNS_KEY,
    queryFn: fetchCampaigns,
  });
  const campaigns = campaignsQuery.data ?? [];

  // Live metrics only — campaign objects themselves never flow through the
  // ticker store here, that'd re-create the original bug one layer down.
  const metrics = useTickerStore(useShallow(s => s.metrics));
  const setStoreCampaigns = useTickerStore(s => s.setCampaigns);
  const connect = useTickerStore(s => s.connect);
  const disconnect = useTickerStore(s => s.disconnect);

  // One-directional handoff, same as LiveTicker.tsx: push the fetched list
  // into the store once it resolves, the store never reaches back into
  // Query's cache itself.
  useEffect(() => {
    if (campaignsQuery.isSuccess) {
      setStoreCampaigns(campaigns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignsQuery.isSuccess]);

  useEffect(() => {
    if (!campaignsQuery.isSuccess) return;
    connect();
    return () => disconnect();
  }, [campaignsQuery.isSuccess, connect, disconnect]);

  const budgetMutation = useMutation({
    mutationFn: ({ id, budget }: { id: string; budget: number }) =>
      updateBudget(id, budget),
    onMutate: async ({ id, budget }) => {
      await queryClient.cancelQueries({ queryKey: CAMPAIGNS_KEY });
      const previous = queryClient.getQueryData<Campaign[]>(CAMPAIGNS_KEY);
      queryClient.setQueryData<Campaign[]>(CAMPAIGNS_KEY, old =>
        old?.map(c => (c.campaignId === id ? { ...c, budget } : c)),
      );
      // Was missing — nothing to roll back to on failure, optimistic
      // write stood permanently even after a failed request.
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CAMPAIGNS_KEY, context.previous);
      }
    },
    // Real server, server-computed budget could differ from the optimistic
    // guess (rounding, currency rules) — reconcile either way.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEY });
    },
  });

  // Was fire-and-forget: fetched, logged, discarded — never touched the
  // cache, so "load more" visibly did nothing. Now actually appends into
  // the query cache under a per-campaign history key.
  //
  // Wrapped in useCallback (along with onSelect/onBumpBudget below) because
  // CampaignRow is React.memo'd — a plain const here is a new function
  // reference every parent render, which defeats the memo just as surely as
  // not memoizing the row at all would have.
  const loadSpendHistory = useCallback(
    async (campaignId: string) => {
      const history = await client.get<unknown[]>(
        `/campaigns/${campaignId}/spend-history`,
      );
      queryClient.setQueryData(
        ['campaigns', campaignId, 'spend-history'],
        history,
      );
    },
    [queryClient],
  );

  const filtered = campaigns.filter(c => c.name.includes(filter));

  // Was: setSelectedId(id) then immediately console.log(selectedId) —
  // logged the PREVIOUS value, since state updates aren't applied
  // synchronously. Removed the log; if you need to observe the new value,
  // log the id you're about to set, not the stale state variable.
  const onSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  // Depend on .mutate itself, not the whole budgetMutation result object —
  // that object's reference changes on every isPending/isError transition,
  // which would recreate this callback (and re-break the memo) mid-mutation.
  const onBumpBudget = useCallback(
    (id: string, nextBudget: number) => {
      budgetMutation.mutate({ id, budget: nextBudget });
    },
    [budgetMutation],
  );

  const renderItem: ListRenderItem<Campaign> = useCallback(
    ({ item }) => (
      <CampaignRow
        campaign={item}
        metric={metrics[item.campaignId]}
        onSelect={onSelect}
        onLoadHistory={loadSpendHistory}
        onBumpBudget={onBumpBudget}
      />
    ),
    [metrics, loadSpendHistory, onBumpBudget, onSelect],
  );

  return (
    <View style={styles.flex}>
      <TextInput
        placeholder="Filter campaigns"
        value={filter}
        onChangeText={setFilter}
        style={styles.filterInput}
      />
      <FlatList
        data={filtered}
        keyExtractor={c => c.campaignId}
        renderItem={renderItem}
      />
      {selectedId ? <Text>Selected: {selectedId}</Text> : null}
    </View>
  );
};

// Was style={{ flex: 1 }} inline — CLAUDE.md: never hardcode via inline
// styles, values should come from useAppTheme in real screens. Using
// StyleSheet.create here as the minimal fix for this practice file.
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  filterInput: {
    padding: 8,
  },
});

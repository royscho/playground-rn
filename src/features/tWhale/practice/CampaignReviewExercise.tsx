// PRACTICE FILE — not imported anywhere, not wired into navigation.
// Review this like a PR at Triple Whale. Several bugs planted on purpose.
// Don't fix inline — talk through what you'd flag and why, then we compare.

import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTickerStore } from '../store/tickerStore';
import { useShallow } from 'zustand/react/shallow';

type Campaign = {
  campaignId: string;
  name: string;
  status: 'active' | 'paused';
  budget: number;
};

const fetchCampaigns = async (): Promise<Campaign[]> => {
  const res = await fetch('https://api.example.com/campaigns');
  return res.json();
};

const updateBudget = async (campaignId: string, budget: number) => {
  const res = await fetch(`https://api.example.com/campaigns/${campaignId}`, {
    method: 'PATCH',
    body: JSON.stringify({ budget }),
  });
  return res.json();
};

export const CampaignReviewExercise = () => {
  const queryClient = useQueryClient();
  const [filter, _setFilter] = useState('');
  const [_selectedId, setSelectedId] = useState<string | null>(null);

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
  });

  const activeCampaignIds = useTickerStore(
    useShallow(s =>
      s.allCampaigns.filter(c => c.status === 'active').map(c => c.campaignId),
    ),
  );

  useEffect(() => {
    const socket = new WebSocket('wss://stream.example.com/campaigns');
    socket.onmessage = event => {
      const update = JSON.parse(event.data);
      queryClient.setQueryData<Campaign[]>(['campaigns'], old =>
        old?.map(c =>
          c.campaignId === update.campaignId ? { ...c, ...update } : c,
        ),
      );
    };
  }, [queryClient]);

  const budgetMutation = useMutation({
    mutationFn: ({ id, budget }: { id: string; budget: number }) =>
      updateBudget(id, budget),
    onMutate: async ({ id, budget }) => {
      queryClient.setQueryData<Campaign[]>(['campaigns'], old =>
        old?.map(c => (c.campaignId === id ? { ...c, budget } : c)),
      );
    },
  });

  const loadMoreSpend = async () => {
    const res = await fetch('https://api.example.com/campaigns/spend-history');
    const data = await res.json();
    console.log(data);
  };

  const filtered = campaigns.filter(c => c.name.includes(filter));

  const onSelect = (id: string) => {
    setSelectedId(id);
    // console.log('selected', selectedId);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(item.campaignId)}
            onLongPress={loadMoreSpend}
          >
            <Text>{item.name}</Text>
            <Text>
              {activeCampaignIds.includes(item.campaignId)
                ? 'Active'
                : 'Paused'}
            </Text>
            <TouchableOpacity
              onPress={() =>
                budgetMutation.mutate({
                  id: item.campaignId,
                  budget: item.budget + 100,
                })
              }
            >
              <Text>+100 budget</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

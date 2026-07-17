import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCampaign, fetchCampaigns } from '../api/campaigns.api';
import { useTickerStore } from '../store/tickerStore';
import type { Campaign } from '../types';

const CAMPAIGNS_KEY = ['tWhale', 'campaigns'] as const;

// The one genuinely request/response-shaped piece of this feature — the
// initial campaign list, separate from the live tick stream. Everything
// downstream of this (the store's allCampaigns/activeCampaigns) is seeded
// from this query's result via setCampaigns, once, in the screen.
export const useCampaignsQuery = () =>
  useQuery({ queryKey: CAMPAIGNS_KEY, queryFn: fetchCampaigns });

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampaign,
    onMutate: async (name: string) => {
      await queryClient.cancelQueries({ queryKey: CAMPAIGNS_KEY });
      const previous = queryClient.getQueryData<Campaign[]>(CAMPAIGNS_KEY);
      // Random suffix, not just Date.now(): JSONPlaceholder's fake
      // POST /posts always returns the same next-id (101) for every
      // request in a session — it doesn't persist anything server-side, so
      // its "real" id isn't unique or trustworthy. This tempId stays the
      // PERMANENT campaignId; we never adopt the server's id (see onSuccess
      // below — there isn't one, deliberately).
      const tempId = `campaign-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const optimisticCampaign: Campaign = { campaignId: tempId, name };

      queryClient.setQueryData<Campaign[]>(CAMPAIGNS_KEY, old => [
        ...(old ?? []),
        optimisticCampaign,
      ]);

      // The ticker store needs to know about this campaign too, immediately
      // — it's what the mock stream's getCampaignIds() reads on every tick.
      // Without this, the campaign would show up in the list but never
      // actually start ticking.
      useTickerStore.getState().addCampaign(optimisticCampaign);

      return { previous, tempId };
    },
    // No onSuccess id-swap and no invalidateQueries: JSONPlaceholder doesn't
    // persist writes (a refetch would silently drop this campaign again),
    // AND its returned id collides across creates in the same session (see
    // the tempId comment above). The optimistic entry is already correct
    // and permanent — the request is fire-and-confirm, not fire-and-adopt.
    onError: (_err, _name, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CAMPAIGNS_KEY, context.previous);
      }
      if (context?.tempId) {
        useTickerStore.getState().removeCampaignId(context.tempId);
      }
    },
  });
};

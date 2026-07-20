import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCampaign,
  fetchCampaigns,
  updateCampaignFavorite,
} from '../api/campaigns.api';
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
      const tempId = `campaign-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;
      const status = 'active';
      const optimisticCampaign: Campaign = { campaignId: tempId, name, status };

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

// Favorite lives on the Campaign itself (server metadata), not a separate
// client-side Set — see the immer store variant. The store's allCampaigns
// isn't written to directly here: LiveTicker's existing Query→store handoff
// effect re-syncs it whenever campaignsQuery.data changes, same path the
// initial fetch already uses.
export const useToggleFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      campaignId,
      isFavorite,
    }: {
      campaignId: string;
      isFavorite: boolean;
    }) => updateCampaignFavorite(campaignId, isFavorite),
    onMutate: async ({ campaignId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: CAMPAIGNS_KEY });
      const previous = queryClient.getQueryData<Campaign[]>(CAMPAIGNS_KEY);

      queryClient.setQueryData<Campaign[]>(CAMPAIGNS_KEY, old =>
        (old ?? []).map(c =>
          c.campaignId === campaignId ? { ...c, isFavorite } : c,
        ),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CAMPAIGNS_KEY, context.previous);
      }
    },
  });
};

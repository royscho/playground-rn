import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { MetricStreamClient, Campaign, MetricTick } from '../types';

import { createMockMetricStreamClient } from '../api/tickerStream';
import { ImmerTickerState } from './types';

// Module-level, not in state — an instance reference, not reactive data.
let streamClient: MetricStreamClient | null = null;

export const useTickerStoreImmer = create<ImmerTickerState>()(
  devtools(
    immer((set, get) => ({
      metrics: {},
      allCampaigns: [],
      isConnected: false,

      connect: () => {
        if (get().isConnected) return; // idempotent guard
        streamClient = createMockMetricStreamClient(() =>
          get().allCampaigns.map(c => c.campaignId),
        );
        streamClient.connect(tick => get()._applyTick(tick));
        set(
          state => {
            state.isConnected = true;
          },
          false,
          'ticker/connect',
        );
      },

      disconnect: () => {
        streamClient?.disconnect();
        streamClient = null;
        set(
          state => {
            state.isConnected = false;
          },
          false,
          'ticker/disconnect',
        );
      },

      // No toggleWatchlist action here — favorite is server-owned metadata
      // on Campaign now (see useToggleFavoriteMutation), not local store
      // state. Toggling flips the Query cache; this store's allCampaigns
      // picks it up via LiveTicker's existing Query→store handoff effect.

      // Dramatically simpler than the manual-guard version in
      // tickerStore.ts: just write the tick. No affectsSpend/
      // affectsWatchlist relevance checks needed — there's nothing derived
      // living in state to keep in sync anymore.
      _applyTick: (tick: MetricTick) =>
        set(
          state => {
            state.metrics[tick.campaignId] = tick;
          },
          false,
          'ticker/applyTick',
        ),

      setCampaigns: (campaigns: Campaign[]) =>
        set(
          state => {
            state.allCampaigns = campaigns;
          },
          false,
          'ticker/setCampaigns',
        ),

      addCampaign: (campaign: Campaign) =>
        set(
          state => {
            state.allCampaigns.push(campaign);
          },
          false,
          'ticker/addCampaign',
        ),

      removeCampaignId: (campaignId: string) =>
        set(
          state => {
            state.allCampaigns = state.allCampaigns.filter(
              c => c.campaignId !== campaignId,
            );
          },
          false,
          'ticker/removeCampaignId',
        ),
    })),
    { name: 'TickerStoreImmer' },
  ),
);

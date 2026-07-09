import { create } from 'zustand';
import { MetricStreamClient, TickerStoreState } from '../types';
import { devtools } from 'zustand/middleware';
import { computeTotalSpend, computeWatchlistSorted } from '../utils';
import { createMockMetricStreamClient } from '../api/tickerStream';
import { ALL_CAMPAIGNS } from '../constants';

// Module-level, not in state — an instance reference, not reactive data.
let streamClient: MetricStreamClient | null = null;

export const useTickerStore = create<TickerStoreState>()(
  devtools((set, get) => ({
    metrics: {},
    allCampaigns: ALL_CAMPAIGNS,
    activeCampaigns: ALL_CAMPAIGNS.slice(0, 2), // only these count toward totalSpendToday
    watchlist: new Set(),
    totalSpendToday: 0,
    watchlistSorted: [],
    isConnected: false,
    connect: () => {
      if (get().isConnected) return; // idempotent guard
      streamClient = createMockMetricStreamClient();
      streamClient?.connect(tick => get()._applyTick(tick));
      set({ isConnected: true }, false, 'ticker/connect');
    },

    disconnect: () => {
      streamClient?.disconnect();
      streamClient = null;
      set({ isConnected: false }, false, 'ticker/disconnect');
    },

    toggleWatchlist: (campaignId: string) =>
      set(
        s => {
          const watchlist = new Set(s.watchlist); // new Set — don't mutate s.watchlist in place
          if (watchlist.has(campaignId)) {
            watchlist.delete(campaignId);
          } else {
            watchlist.add(campaignId);
          }
          return {
            watchlist,
            watchlistSorted: computeWatchlistSorted(
              watchlist,
              s.metrics,
              s.allCampaigns,
            ),
          };
        },
        false,
        'ticker/toggleWatchlist',
      ),
    _applyTick: tick =>
      set(
        s => {
          const metrics = { ...s.metrics, [tick.campaignId]: tick };
          const affectsSpend = s.activeCampaigns.some(
            c => c.campaignId === tick.campaignId,
          );
          const affectsWatchlist = s.watchlist.has(tick.campaignId);
          return {
            metrics,
            totalSpendToday: affectsSpend
              ? computeTotalSpend(s.activeCampaigns, metrics)
              : s.totalSpendToday,
            watchlistSorted: affectsWatchlist
              ? computeWatchlistSorted(s.watchlist, metrics, s.allCampaigns)
              : s.watchlistSorted,
          };
        },
        false,
        'ticker/applyTick',
      ),
  })),
);

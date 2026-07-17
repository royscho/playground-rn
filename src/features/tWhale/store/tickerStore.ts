import { create } from 'zustand';
import { MetricStreamClient, TickerStoreState, Campaign } from '../types';
import { devtools } from 'zustand/middleware';
import { computeTotalSpend, computeWatchlistSorted } from '../utils';
import { createMockMetricStreamClient } from '../api/tickerStream';

// Module-level, not in state — an instance reference, not reactive data.
let streamClient: MetricStreamClient | null = null;

export const useTickerStore = create<TickerStoreState>()(
  devtools((set, get) => ({
    metrics: {},
    // Empty until the initial campaigns Query resolves — see setCampaigns.
    // No hardcoded seed data here anymore; that's now a server concern.
    allCampaigns: [],
    activeCampaigns: [], // only these count toward totalSpendToday
    watchlist: new Set(),
    totalSpendToday: 0,
    watchlistSorted: [],
    isConnected: false,
    connect: () => {
      if (get().isConnected) return; // idempotent guard
      // getCampaignIds is called on every tick, not just once here — reads
      // the CURRENT allCampaigns each time, so a campaign added later (via
      // addCampaign) starts appearing in ticks without reconnecting.
      streamClient = createMockMetricStreamClient(() =>
        get().allCampaigns.map(c => c.campaignId),
      );
      streamClient.connect(tick => get()._applyTick(tick));
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

    // One-directional handoff from TanStack Query: called once, when the
    // initial campaigns fetch resolves. The store never reaches back into
    // Query's cache itself — it only ever receives data pushed to it.
    setCampaigns: (campaigns: Campaign[]) =>
      set(
        {
          allCampaigns: campaigns,
          activeCampaigns: campaigns.slice(0, 2),
        },
        false,
        'ticker/setCampaigns',
      ),

    addCampaign: (campaign: Campaign) =>
      set(
        s => ({ allCampaigns: [...s.allCampaigns, campaign] }),
        false,
        'ticker/addCampaign',
      ),

    removeCampaignId: (campaignId: string) =>
      set(
        s => {
          const allCampaigns = s.allCampaigns.filter(
            c => c.campaignId !== campaignId,
          );
          const watchlist = new Set(s.watchlist);
          const wasWatchlisted = watchlist.delete(campaignId);
          const wasActive = s.activeCampaigns.some(
            c => c.campaignId === campaignId,
          );
          const activeCampaigns = wasActive
            ? s.activeCampaigns.filter(c => c.campaignId !== campaignId)
            : s.activeCampaigns;
          return {
            allCampaigns,
            watchlist,
            activeCampaigns,
            watchlistSorted: wasWatchlisted
              ? computeWatchlistSorted(watchlist, s.metrics, allCampaigns)
              : s.watchlistSorted,
            totalSpendToday: wasActive
              ? computeTotalSpend(activeCampaigns, s.metrics)
              : s.totalSpendToday,
          };
        },
        false,
        'ticker/removeCampaignId',
      ),
  })),
);

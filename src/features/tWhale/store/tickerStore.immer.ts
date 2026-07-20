import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';
import { createSelector } from 'reselect';
import { MetricStreamClient, Campaign, MetricTick } from '../types';
import { computeTotalSpend, computeWatchlistSorted } from '../utils';
import { createMockMetricStreamClient } from '../api/tickerStream';

// Immer doesn't support Set/Map mutation by default — watchlist needs this
// enabled once, at module load, before any producer touches a Set/Map.
enableMapSet();

// totalSpendToday/watchlistSorted are deliberately NOT part of this state
// shape at all — createSelector below derives them on read, memoized.
// Nothing here can go stale, because nothing here stores a value that could
// drift out of sync with its own dependencies. Compare to tickerStore.ts's
// _applyTick, which has to remember an affectsSpend/affectsWatchlist guard
// for every derived field — this version has no such bookkeeping to forget.
interface ImmerTickerState {
  metrics: Record<string, MetricTick>;
  allCampaigns: Campaign[];
  activeCampaigns: Campaign[]; // the smaller subset counted toward totalSpend
  watchlist: Set<string>;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  toggleWatchlist: (campaignId: string) => void;
  _applyTick: (tick: MetricTick) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  removeCampaignId: (campaignId: string) => void;
}

// Module-level, not in state — an instance reference, not reactive data.
let streamClient: MetricStreamClient | null = null;

export const useTickerStoreImmer = create<ImmerTickerState>()(
  devtools(
    immer((set, get) => ({
      metrics: {},
      allCampaigns: [],
      activeCampaigns: [],
      watchlist: new Set(),
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

      toggleWatchlist: (campaignId: string) =>
        set(
          state => {
            // Direct mutation — state.watchlist is an Immer draft, not the
            // real Set. No new Set(...) copy needed; Immer produces the
            // correct immutable update from these calls.
            if (state.watchlist.has(campaignId)) {
              state.watchlist.delete(campaignId);
            } else {
              state.watchlist.add(campaignId);
            }
            // No watchlistSorted update here at all — it's derived below,
            // not stored, so there's nothing to keep in sync.
          },
          false,
          'ticker/toggleWatchlist',
        ),

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
            state.activeCampaigns = campaigns.slice(0, 2);
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
            state.watchlist.delete(campaignId);
            state.activeCampaigns = state.activeCampaigns.filter(
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

// --- Derived state via createSelector — computed on read, memoized ---
// createSelector's return value is just a plain (state) => result function,
// which is already a valid Zustand selector — no adapter needed:
//   const totalSpendToday = useTickerStoreImmer(selectTotalSpendToday);

const selectMetrics = (state: ImmerTickerState) => state.metrics;
const selectActiveCampaigns = (state: ImmerTickerState) => state.activeCampaigns;
const selectAllCampaigns = (state: ImmerTickerState) => state.allCampaigns;
const selectWatchlist = (state: ImmerTickerState) => state.watchlist;

export const selectTotalSpendToday = createSelector(
  [selectActiveCampaigns, selectMetrics],
  (activeCampaigns, metrics) => computeTotalSpend(activeCampaigns, metrics),
);

export const selectWatchlistSorted = createSelector(
  [selectWatchlist, selectMetrics, selectAllCampaigns],
  (watchlist, metrics, allCampaigns) =>
    computeWatchlistSorted(watchlist, metrics, allCampaigns),
);

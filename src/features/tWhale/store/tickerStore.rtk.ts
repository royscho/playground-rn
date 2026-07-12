import {
  configureStore,
  createSlice,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';
import { MetricStreamClient, MetricTick, Campaign } from '../types';
import { createMockMetricStreamClient } from '../api/tickerStream';
import { ALL_CAMPAIGNS } from '../constants';

// Redux's core rule: state must be plain, serializable data (DevTools,
// persistence, and time-travel debugging all depend on this). A `Set`
// (fine in Zustand/MobX) isn't serializable — the idiomatic Redux stand-in
// is a Record<string, true>, same O(1) membership check, plain JSON shape.
interface TickerState {
  metrics: Record<string, MetricTick>;
  allCampaigns: Campaign[];
  activeCampaigns: Campaign[];
  watchlist: Record<string, true>;
  isConnected: boolean;
}

const initialState: TickerState = {
  metrics: {},
  allCampaigns: ALL_CAMPAIGNS,
  activeCampaigns: ALL_CAMPAIGNS.slice(0, 2),
  watchlist: {},
  isConnected: false,
};

const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {
    // RTK wraps every reducer in Immer — this LOOKS like direct mutation
    // (`state.metrics[...] = tick`) but Immer records the edits and
    // produces a real new immutable state object under the hood. This is
    // why RTK reducers can use mutating syntax when Zustand/plain Redux
    // reducers can't — Immer is the difference, not a relaxed rule.
    applyTick(state, action: PayloadAction<MetricTick>) {
      state.metrics[action.payload.campaignId] = action.payload;
    },
    toggleWatchlist(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.watchlist[id]) {
        delete state.watchlist[id];
      } else {
        state.watchlist[id] = true;
      }
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
  },
});

export const { applyTick, toggleWatchlist, setConnected } =
  tickerSlice.actions;

// Idiomatic Redux does NOT store derived values in the slice itself (unlike
// the Zustand version's precomputed `totalSpendToday`/`watchlistSorted`
// fields, manually kept in sync inside `_applyTick`). Instead: memoized
// selectors via `createSelector` (reselect, bundled in RTK). Selector only
// recomputes when its INPUT selectors' return values actually change by
// reference — same "don't recompute on every irrelevant tick" property, but
// achieved by memoizing the READ instead of precomputing on WRITE.
const selectMetrics = (state: { ticker: TickerState }) => state.ticker.metrics;
const selectActiveCampaigns = (state: { ticker: TickerState }) =>
  state.ticker.activeCampaigns;
const selectAllCampaigns = (state: { ticker: TickerState }) =>
  state.ticker.allCampaigns;
const selectWatchlist = (state: { ticker: TickerState }) =>
  state.ticker.watchlist;

export const selectTotalSpendToday = createSelector(
  [selectActiveCampaigns, selectMetrics],
  (activeCampaigns, metrics) =>
    activeCampaigns.reduce(
      (sum, c) => sum + (metrics[c.campaignId]?.spend ?? 0),
      0,
    ),
);

export const selectWatchlistSorted = createSelector(
  [selectWatchlist, selectMetrics, selectAllCampaigns],
  (watchlist, metrics, allCampaigns) =>
    Object.keys(watchlist)
      .filter((id) => id in metrics)
      .sort((a, b) => metrics[b].roas - metrics[a].roas)
      .map((id) => allCampaigns.find((c) => c.campaignId === id))
      .filter((c): c is Campaign => c !== undefined),
);

// Reducers must stay pure — no side effects, no async, no calling into a
// stream client. The idiomatic place for that is a thunk (bundled into
// configureStore's default middleware). `createAsyncThunk` is the wrong
// tool here — it models one-shot request/response, not a long-lived
// subscription; a plain thunk function is the correct fit.
let streamClient: MetricStreamClient | null = null;

export const connectStream = () => (dispatch: AppDispatch, getState: () => RootState) => {
  if (getState().ticker.isConnected) return; // same idempotency guard as Zustand/MobX
  streamClient = createMockMetricStreamClient();
  streamClient.connect((tick) => dispatch(applyTick(tick)));
  dispatch(setConnected(true));
};

export const disconnectStream = () => (dispatch: AppDispatch) => {
  streamClient?.disconnect();
  streamClient = null;
  dispatch(setConnected(false));
};

export const tickerStore = configureStore({
  reducer: { ticker: tickerSlice.reducer },
});

export type RootState = ReturnType<typeof tickerStore.getState>;
export type AppDispatch = typeof tickerStore.dispatch;

import { computeFavoritesSorted, computeTotalSpend } from '../utils';
import { createSelector } from 'reselect';
import { ImmerTickerState } from './types';
// --- Derived state via createSelector — computed on read, memoized ---
// createSelector's return value is just a plain (state) => result function,
// which is already a valid Zustand selector — no adapter needed:
//   const totalSpendToday = useTickerStoreImmer(selectTotalSpendToday);

const selectMetrics = (state: ImmerTickerState) => state.metrics;
const selectAllCampaigns = (state: ImmerTickerState) => state.allCampaigns;

export const selectActiveCampaigns = createSelector(
  [selectAllCampaigns],
  allCampaigns => allCampaigns.filter(cam => cam.status === 'active'),
);

export const selectTotalSpendToday = createSelector(
  [selectActiveCampaigns, selectMetrics],
  (activeCampaigns, metrics) => computeTotalSpend(activeCampaigns, metrics),
);

// Favorite is server metadata on Campaign (isFavorite), not a local Set —
// same filter-then-memoize recipe as selectActiveCampaigns above.
const selectFavoriteCampaigns = createSelector(
  [selectAllCampaigns],
  allCampaigns => allCampaigns.filter(c => c.isFavorite),
);

export const selectWatchlistSorted = createSelector(
  [selectFavoriteCampaigns, selectMetrics],
  (favorites, metrics) => computeFavoritesSorted(favorites, metrics),
);

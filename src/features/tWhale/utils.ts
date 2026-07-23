import { Campaign, MetricTick } from './types';
import { SpendHistoryPoint } from './api/spendHistory.api';

export const computeWatchlistSorted = (
  watchlist: Set<string>,
  metrics: Record<string, MetricTick>,
  activeCampaigns: Campaign[],
): Campaign[] => {
  const sorted = Array.from(watchlist)
    .filter(id => id in metrics)
    .sort((a, b) => metrics[b].roas - metrics[a].roas);
  return sorted
    .map(id => activeCampaigns.find(c => c.campaignId === id))
    .filter((c): c is Campaign => c !== undefined);
};

// Immer-variant counterpart to computeWatchlistSorted above — favorites are
// a field on Campaign itself here, not a separate Set, so there's no id
// list to intersect with metrics first.
export const computeFavoritesSorted = (
  favorites: Campaign[],
  metrics: Record<string, MetricTick>,
): Campaign[] =>
  favorites
    .filter(c => c.campaignId in metrics)
    .sort((a, b) => metrics[b.campaignId].roas - metrics[a.campaignId].roas);

export const computeTotalSpend = (
  actives: Campaign[],
  metrics: Record<string, MetricTick>,
) => {
  return actives.reduce(
    (sum, cur) => (metrics[cur.campaignId]?.spend ?? 0) + sum,
    0,
  );
};

// search/filterMode are local UI state that change on every keystroke —
// createSelector's reference-based memoization wouldn't save meaningful
// work here (a new search string every keystroke defeats the cache
// anyway), so this is a plain function called from useMemo in the
// component instead of a memoized selector.
export const filterCampaigns = (
  campaigns: Campaign[],
  search: string,
  filterMode: 'all' | 'active',
  activeIds: Set<string>,
) => {
  const query = search.trim().toLowerCase();
  return campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(query);
    const matchesFilter = filterMode === 'all' || activeIds.has(c.campaignId);
    return matchesSearch && matchesFilter;
  });
};

// Single pass instead of two .map + two .reduce over the same array — the
// chart needs the per-day series, the stat cards need the aggregate, both
// built while iterating once.
export const computeSpendChartData = (history: SpendHistoryPoint[]) => {
  const spendData: number[] = history.map(h => h.spend);
  const revenueData: number[] = history.map(h => h.revenue);
  const labels: string[] = history.map(h => h.date);
  const spend = history.reduce((sum, h) => h.spend + sum, 0);
  const revenue = history.reduce((sum, h) => h.revenue + sum, 0);

  return {
    spendData,
    revenueData,
    labels,
    totals: { spend, revenue, roas: spend > 0 ? revenue / spend : 0 },
  };
};

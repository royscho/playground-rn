import { Campaign, MetricTick } from './types';

export const computeWatchlistSorted = (
  watchlist: Set<string>,
  metrics: Record<string, MetricTick>,
  activeCampaigns: Campaign[],
) => {
  const sorted = Array.from(watchlist)
    .filter(id => id in metrics)
    .sort((a, b) => metrics[b].roas - metrics[a].roas);
  return sorted
    .map(id => activeCampaigns.find(c => c.campaignId === id))
    .filter((c): c is Campaign => c !== undefined);
};

export const computeTotalSpend = (
  actives: Campaign[],
  metrics: Record<string, MetricTick>,
) => {
  return actives.reduce(
    (sum, cur) => (metrics[cur.campaignId]?.spend ?? 0) + sum,
    0,
  );
};

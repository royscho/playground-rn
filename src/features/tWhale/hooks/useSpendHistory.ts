import { useQuery } from '@tanstack/react-query';
import { fetchSpendHistory } from '../api/spendHistory.api';
import { computeSpendChartData } from '../utils';

const SPEND_HISTORY_KEY = ['tWhale', 'spendHistory'] as const;

// computeSpendChartData is module-level (defined in utils.ts, imported, not
// redefined inline here) — Query's own select cache keys off (data
// reference, select reference); an inline arrow would be a new reference
// every render and defeat that check. No createSelector needed either:
// Query already skips re-running select when `data` hasn't changed
// reference (see QueryObserver's internal _selectFn/_selectResult cache).

// refetchInterval matches how often a real aggregation backend would
// re-crunch (minutes), not a socket — spend/revenue history is polled,
// never streamed. See tickerStore.immer.ts for the genuinely-live case.
export const useSpendHistoryQuery = () =>
  useQuery({
    queryKey: SPEND_HISTORY_KEY,
    queryFn: fetchSpendHistory,
    refetchInterval: 5 * 60_000,
    select: computeSpendChartData,
  });

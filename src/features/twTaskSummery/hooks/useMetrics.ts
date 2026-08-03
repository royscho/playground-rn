import { useQuery } from '@tanstack/react-query';
import { getMetrics } from '../api/metricApi';
import { subDays, isToday, isWithinInterval } from 'date-fns';
import { SummaryMetric } from '../types';
import { useCallback } from 'react';

const filterData = (
  data: SummaryMetric[],
  search?: string,
  filter?: string,
): SummaryMetric[] =>
  data
    .filter(m => {
      switch (filter) {
        case 'Today':
          return isToday(m.time);
        case '7d':
          const pastWeekStart = subDays(new Date(), 7);

          return isWithinInterval(m.time, {
            start: pastWeekStart,
            end: new Date(),
          });
        case '10d':
          const past10dStart = subDays(new Date(), 10);

          return isWithinInterval(m.time, {
            start: past10dStart,
            end: new Date(),
          });
        default:
          return true;
      }
    })
    .filter(d =>
      search && search !== ''
        ? d.label.toLowerCase().includes(search.toLowerCase())
        : true,
    );

export const useMetrics = (search?: string, filter?: string) => {
  const selectFn = useCallback(
    (data: SummaryMetric[]) => filterData(data, search, filter),
    [filter, search],
  );
  return useQuery({
    queryKey: ['metrics'],
    queryFn: getMetrics,
    select: selectFn,
  });
};

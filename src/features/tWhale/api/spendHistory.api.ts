export interface SpendHistoryPoint {
  date: string;
  spend: number;
  revenue: number;
}

// Mock, deliberately NOT a stream: a real backend aggregates this from
// ad-platform + store revenue data on its own schedule (spend is
// platform-delayed, never truly real-time — see tickerStream.ts for the
// contrasting genuinely-live case). The client just polls this on an
// interval matched to that cadence.
export const fetchSpendHistory = async (): Promise<SpendHistoryPoint[]> => {
  await new Promise<void>(resolve => setTimeout(resolve, 400));

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let spend = 800;
  let revenue = 2400;

  return days.map(date => {
    spend = Math.max(100, spend + Math.round((Math.random() - 0.4) * 150));
    revenue = Math.max(
      200,
      revenue + Math.round((Math.random() - 0.4) * 400),
    );
    return { date, spend, revenue };
  });
};

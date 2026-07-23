import { ScreenWrapper } from '@/shared/components';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/shared/hooks';
import StatCard from '../components/StatCard';
import LineChart from '../components/LineChart';
import { useSpendHistoryQuery } from '../hooks/useSpendHistory';

const SpendChartScreen = () => {
  const { colors, spacing } = useAppTheme();
  const query = useSpendHistoryQuery();
  // No local useMemo needed — Query's own select cache (see useSpendHistory.ts)
  // already only recomputes this when `data` actually changed reference.
  const { spendData, revenueData, labels, totals } = query.data ?? {
    spendData: [],
    revenueData: [],
    labels: [],
    totals: { spend: 0, revenue: 0, roas: 0 },
  };

  return (
    <ScreenWrapper
      title="Spend & Revenue"
      loading={query.isLoading}
      error={query.isError ? query.error : null}
      onRetry={query.refetch}
    >
      <View style={[styles.row, { gap: spacing.sm, padding: spacing.md }]}>
        <View style={styles.card}>
          <StatCard label="Spend (7d)" value={`$${totals.spend}`} />
        </View>
        <View style={styles.card}>
          <StatCard label="Revenue (7d)" value={`$${totals.revenue}`} />
        </View>
        <View style={styles.card}>
          <StatCard label="ROAS" value={totals.roas.toFixed(2)} />
        </View>
      </View>
      <View style={{ paddingHorizontal: spacing.md }}>
        <LineChart
          series={[
            { label: 'Spend', values: spendData, color: colors.warning },
            { label: 'Revenue', values: revenueData, color: colors.success },
          ]}
          labels={labels}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  card: {
    flex: 1,
  },
});

export default SpendChartScreen;

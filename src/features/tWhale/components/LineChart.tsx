import { useAppTheme } from '@/shared/hooks';
import React, { FC, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

interface Series {
  label: string;
  values: number[];
  color?: string;
}

interface Props {
  series: Series[];
  labels: string[];
}

const CHART_HEIGHT = 160;
const PADDING = 12;
const Y_AXIS_WIDTH = 40;

const LineChart: FC<Props> = ({ series, labels }) => {
  const { colors, spacing, typography } = useAppTheme();
  // Measured, not derived from useWindowDimensions() minus a guessed
  // padding total — this component has no way to know how many padded
  // wrappers sit above it (ScreenWrapper's own default padding, plus
  // whatever the screen adds locally), so guessing caused the chart to be
  // computed wider than its real container and overflow past the right
  // edge. onLayout gives the actual available width regardless.
  const [containerWidth, setContainerWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) =>
    setContainerWidth(e.nativeEvent.layout.width);
  const chartWidth = Math.max(containerWidth - Y_AXIS_WIDTH, 0);

  // Container-return-type computation (per-series arrays of {x,y}, plus the
  // shared min/max for the y-axis labels) from props that only change on
  // refetch/rotation, not on every render — useMemo is the right call here,
  // same reasoning as the search-filter case: cheap to recompute, but no
  // reason to redo it when nothing moved. Scale is shared across all series
  // so multiple lines stay comparable on one axis, not each normalized
  // independently.
  const chart = useMemo(() => {
    const allValues = series.flatMap(s => s.values);
    if (allValues.length === 0) return null;

    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    const range = max - min || 1; // avoid divide-by-zero when every value is equal
    const usableHeight = CHART_HEIGHT - PADDING * 2;
    const pointCount = series[0]?.values.length ?? 0;
    const step = pointCount > 1 ? chartWidth / (pointCount - 1) : 0;

    const seriesPoints = series.map(s => ({
      label: s.label,
      color: s.color ?? colors.primary,
      points: s.values.map((value, i) => ({
        x: step * i,
        y: PADDING + usableHeight - ((value - min) / range) * usableHeight,
      })),
    }));

    return { seriesPoints, max, min, mid: (max + min) / 2 };
  }, [series, chartWidth, colors.primary]);

  if (chart === null) return null;

  const formatTick = (n: number) => Math.round(n).toLocaleString();

  return (
    <View onLayout={onLayout}>
      <View style={styles.chartRow}>
        <View
          style={[
            styles.yAxis,
            {
              height: CHART_HEIGHT,
              width: Y_AXIS_WIDTH,
              paddingRight: spacing.xs,
            },
          ]}
        >
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {formatTick(chart.max)}
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {formatTick(chart.mid)}
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {formatTick(chart.min)}
          </Text>
        </View>
        <Svg width={chartWidth} height={CHART_HEIGHT}>
          <Line
            x1={0}
            y1={CHART_HEIGHT - PADDING}
            x2={chartWidth}
            y2={CHART_HEIGHT - PADDING}
            stroke={colors.border}
            strokeWidth={1}
          />
          {chart.seriesPoints.map(s => (
            <React.Fragment key={s.label}>
              <Polyline
                points={s.points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
              />
              {s.points.map((p, i) => (
                <Circle key={i} cx={p.x} cy={p.y} r={3} fill={s.color} />
              ))}
            </React.Fragment>
          ))}
        </Svg>
      </View>
      <View
        style={[
          styles.labelRow,
          { marginTop: spacing.xs, marginLeft: Y_AXIS_WIDTH },
        ]}
      >
        {labels.map((label, i) => (
          <Text
            key={i}
            style={[typography.caption, { color: colors.textSecondary }]}
          >
            {label}
          </Text>
        ))}
      </View>
      <View
        style={[
          styles.legendRow,
          { marginTop: spacing.sm, marginLeft: Y_AXIS_WIDTH, gap: spacing.md },
        ]}
      >
        {chart.seriesPoints.map(s => (
          <View key={s.label} style={[styles.legendItem, { gap: spacing.xs }]}>
            <View style={[styles.swatch, { backgroundColor: s.color }]} />
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartRow: {
    flexDirection: 'row',
  },
  yAxis: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendRow: {
    flexDirection: 'row',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swatch: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default React.memo(LineChart);

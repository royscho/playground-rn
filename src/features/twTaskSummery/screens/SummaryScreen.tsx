import { useAppTheme } from '@/shared/hooks';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Filters from '../components/Filters';
import { useCallback, useState } from 'react';
import { SummaryMetric } from '../types';
import { useMetrics } from '../hooks/useMetrics';
import CardMetric from '../components/CardMetric';

const SummaryScreen = () => {
  const { spacing, colors, typography } = useAppTheme();
  const [selected, setSelected] = useState('No Comparison');
  const { data, isPending, isError } = useMetrics(selected);

  const onPress = useCallback((title: string) => setSelected(title), []);

  const renderItem: ListRenderItem<SummaryMetric> = useCallback(
    ({ item }) => <CardMetric item={item} />,
    [],
  );

  const renderError = () =>
    isError ? (
      <Text
        style={[styles.error, { ...typography.h2 }, { color: colors.error }]}
      >
        Error
      </Text>
    ) : null;

  const renderList = () =>
    isPending ? (
      <ActivityIndicator style={styles.list} />
    ) : (
      <FlatList
        ListHeaderComponent={<Filters selected={selected} onPress={onPress} />}
        keyExtractor={item => item.id}
        data={data}
        renderItem={renderItem}
        style={styles.list}
      />
    );

  return (
    <SafeAreaView style={[styles.container, { paddingHorizontal: spacing.sm }]}>
      <Header count={data?.length} />
      {renderError()}
      {!isError && renderList()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  error: {
    textAlign: 'center',
  },
});

export default SummaryScreen;

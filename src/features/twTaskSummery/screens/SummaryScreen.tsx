import { useAppTheme } from '@/shared/hooks';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Filters from '../components/Filters';
import { useCallback, useState } from 'react';
import { SummaryMetric } from '../types';
import { useMetrics } from '../hooks/useMetrics';
import CardMetric from '../components/CardMetric';
import { useDebounce } from '../hooks/useDebounce';
import PinnedList from '../components/PinnedList';

const SummaryScreen = () => {
  const { spacing, colors, typography } = useAppTheme();
  const [selected, setSelected] = useState('No Comparison');
  const [text, setText] = useState('');
  const search = useDebounce(text);
  const { data, isLoading, isError } = useMetrics(search, selected);

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
    isLoading ? (
      <ActivityIndicator style={styles.list} />
    ) : (
      <FlatList
        ListHeaderComponent={
          <>
            <PinnedList />
            <Filters selected={selected} onPress={onPress} />
          </>
        }
        keyExtractor={item => item.id}
        data={data}
        renderItem={renderItem}
        style={styles.list}
      />
    );

  return (
    <SafeAreaView style={[styles.container, { paddingHorizontal: spacing.sm }]}>
      <Header count={data?.length} search={search} />
      {renderError()}
      <TextInput
        onChangeText={val => setText(val)}
        style={[
          styles.search,
          {
            color: colors.text,
            borderColor: colors.border,
            marginVertical: spacing.sm,
            padding: spacing.sm,
          },
        ]}
      />
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
  search: {
    borderWidth: 1,
    height: 40,
    borderRadius: 10,
  },
});

export default SummaryScreen;

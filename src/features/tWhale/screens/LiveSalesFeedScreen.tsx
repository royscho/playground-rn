import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';
import { CircleCheckIcon } from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import SaleRow from '../components/SaleRow';
import { useSalesFeedStore } from '../store/salesFeedStore';
import { Sale } from '../types';

const LiveSalesFeedScreen = () => {
  const { colors, spacing } = useAppTheme();
  const sales = useSalesFeedStore(state => state.sales);
  const isConnected = useSalesFeedStore(state => state.isConnected);
  const connect = useSalesFeedStore(state => state.connect);
  const disconnect = useSalesFeedStore(state => state.disconnect);

  // No initial fetch to wait for here (unlike the campaign ticker) — this
  // is a pure live feed, nothing to seed from Query first.
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const renderItem = useCallback(
    ({ item }: { item: Sale }) => <SaleRow sale={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Sale) => item.id, []);

  return (
    <ScreenWrapper title="Live Sales">
      <View style={[styles.status, { marginBottom: spacing.md }]}>
        <CircleCheckIcon color={isConnected ? colors.success : colors.error} />
        <Text style={{ color: colors.text, marginLeft: spacing.sm }}>
          {isConnected ? 'Live' : 'Disconnected'}
        </Text>
      </View>
      <FlatList
        data={sales}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ color: colors.textSecondary }}>
            Waiting for sales…
          </Text>
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LiveSalesFeedScreen;

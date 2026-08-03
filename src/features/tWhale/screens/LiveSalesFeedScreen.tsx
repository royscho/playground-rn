import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';
import { CircleCheckIcon } from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import SaleRow from '../components/SaleRow';
import { MAX_SALES, useSalesFeedStore } from '../store/salesFeedStore';
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

  const toggleConnect = () => (isConnected ? disconnect() : connect());

  // sales[0] is the newest entry (the list is newest-first, see
  // salesFeedStore's unshift) — it doubles as "last update" for free, no
  // separate timestamp needs tracking.
  const lastUpdate = new Date(sales[0]?.timestamp);

  return (
    <ScreenWrapper title="Live Sales" scrollable={false}>
      <View style={[styles.status, { marginBottom: spacing.md }]}>
        <View style={styles.status}>
          <Pressable onPress={toggleConnect}>
            <CircleCheckIcon
              color={isConnected ? colors.success : colors.error}
            />
          </Pressable>
          <Text style={{ color: colors.text, marginLeft: spacing.sm }}>
            {isConnected ? 'Live' : 'Disconnected'}
          </Text>
        </View>
        <Text style={{ color: colors.textSecondary }}>
          {`${sales.length} / ${MAX_SALES}`}
        </Text>
      </View>

      {!isConnected && lastUpdate && (
        <Text
          style={{
            color: colors.textSecondary,
            marginBottom: spacing.md,
          }}
        >
          {`Last update:  ${lastUpdate.toLocaleDateString()} · ${lastUpdate.toLocaleTimeString()}`}
        </Text>
      )}
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
    justifyContent: 'space-between',
  },
});

export default LiveSalesFeedScreen;

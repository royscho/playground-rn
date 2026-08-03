import { useAppTheme } from '@/shared/hooks';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Sale } from '../types';

interface Props {
  sale: Sale;
}

const SaleRow: FC<Props> = ({ sale }) => {
  const { colors, spacing, typography } = useAppTheme();
  const date = new Date(sale.timestamp);

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          padding: spacing.md,
          marginBottom: spacing.sm,
          borderRadius: spacing.sm,
        },
      ]}
    >
      <View>
        <Text style={{ color: colors.text, ...typography.body }}>
          {sale.productName}
        </Text>
        <Text style={{ color: colors.textSecondary, ...typography.caption }}>
          {sale.customerName}
        </Text>
        <Text style={{ color: colors.textSecondary, ...typography.caption }}>
          {`${date.toLocaleDateString()} · ${date.toLocaleTimeString()}`}
        </Text>
      </View>
      <Text style={{ color: colors.success, ...typography.h3 }}>
        {`$${sale.amount}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default React.memo(SaleRow);

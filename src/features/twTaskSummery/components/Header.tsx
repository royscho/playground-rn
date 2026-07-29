import { useAppTheme } from '@/shared/hooks';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RefreshCcwIcon } from 'lucide-react-native';
import { useMetrics } from '../hooks/useMetrics';
import { FC } from 'react';

type Props = {
  count?: number;
};
const Header: FC<Props> = ({ count }) => {
  const { colors, spacing, typography } = useAppTheme();
  const { refetch, isFetching, isError } = useMetrics();

  const onPress = () => refetch();

  return (
    <View style={styles.header}>
      <Text
        style={[
          {
            color: colors.text,
          },
          { ...typography.h1 },
        ]}
      >
        {`Summary (${count ?? 0})`}
      </Text>
      {isFetching && <ActivityIndicator />}
      <TouchableOpacity
        onPress={onPress}
        disabled={isError}
        style={[
          styles.button,
          {
            backgroundColor: colors.surface,
            borderColor: colors.text,
            padding: spacing.xs,
          },
        ]}
      >
        <RefreshCcwIcon color={colors.text} width={16} height={16} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default Header;

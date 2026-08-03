import { useAppTheme } from '@/shared/hooks';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowBigLeft, RefreshCcwIcon } from 'lucide-react-native';
import { useMetrics } from '../hooks/useMetrics';
import { FC } from 'react';
import { useNavigation } from '@react-navigation/native';

type Props = {
  count?: number;
  search: string;
};
const Header: FC<Props> = ({ count, search }) => {
  const { colors, spacing, typography } = useAppTheme();
  const { refetch, isFetching, isError } = useMetrics(search);
  const { goBack } = useNavigation();
  const onPress = () => refetch();

  return (
    <View style={styles.header}>
      <Pressable onPress={goBack}>
        <ArrowBigLeft color={colors.text} />
      </Pressable>
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

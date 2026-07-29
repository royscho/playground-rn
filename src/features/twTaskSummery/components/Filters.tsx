import { useAppTheme } from '@/shared/hooks';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { CalendarCheckIcon } from 'lucide-react-native';
import { FC } from 'react';

interface Props {
  selected: string;
  onPress: (title: string) => void;
}
type Item = {
  title: string;
};

const ITEMS = [
  { title: 'Today' },
  { title: '7d' },
  { title: '10d' },
  { title: 'No Comparison' },
] as const;

const Filters: FC<Props> = ({ selected, onPress }) => {
  const { colors, spacing, typography } = useAppTheme();

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <Pressable
      onPress={() => onPress(item.title)}
      style={({ pressed }) => [
        styles.item,
        {
          backgroundColor:
            selected === item.title ? colors.success : colors.surface,
          borderColor: pressed ? colors.success : colors.text,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: spacing.sm,
          marginHorizontal: spacing.sm,
        },
        { ...typography.body },
      ]}
    >
      {item.title === 'Today' && (
        <CalendarCheckIcon color={colors.text} width={18} />
      )}
      <Text style={{ color: colors.text }}>{item.title}</Text>
    </Pressable>
  );

  return (
    <FlatList
      data={ITEMS}
      keyExtractor={item => item.title}
      renderItem={renderItem}
      horizontal
      style={{ paddingVertical: spacing.lg }}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default Filters;

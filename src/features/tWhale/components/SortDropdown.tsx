import { useAppTheme } from '@/shared/hooks';
import { ChevronDown } from 'lucide-react-native';
import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SortMetric } from '../types';

interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Props {
  value: SortMetric;
  onChange: (value: SortMetric) => void;
}

interface Option {
  value: SortMetric;
  label: string;
}

const OPTIONS: Option[] = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'spend', label: 'Spend' },
  { value: 'roas', label: 'ROAS' },
];

interface SortMenuOptionProps {
  option: Option;
  selected: boolean;
  onSelect: (value: SortMetric) => void;
}

// Extracted so its own onPress can be a stable useCallback (curried with
// this item's value) instead of a fresh closure created inside the
// parent's .map() on every SortDropdown render.
const SortMenuOption: FC<SortMenuOptionProps> = React.memo(
  ({ option, selected, onSelect }) => {
    const { colors, spacing, typography } = useAppTheme();
    const handlePress = useCallback(
      () => onSelect(option.value),
      [onSelect, option.value],
    );

    return (
      <Pressable
        onPress={handlePress}
        style={[
          { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
          selected ? { backgroundColor: colors.primary } : styles.menuItem,
        ]}
      >
        <Text
          style={{
            color: selected ? colors.primaryForeground : colors.text,
            ...typography.body,
          }}
        >
          {`${option.label} ↓`}
        </Text>
      </Pressable>
    );
  },
);

const SortDropdown: FC<Props> = ({ value, onChange }) => {
  const { colors, spacing, typography } = useAppTheme();
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const triggerRef = useRef<View>(null);
  const currentLabel = useMemo(
    () => OPTIONS.find(o => o.value === value)?.label ?? value,
    [value],
  );

  // Measure the trigger's on-screen position right before opening, so the
  // menu can be placed directly below it instead of centered on screen —
  // measureInWindow only works on an already-mounted native view, hence
  // capturing this at open time rather than up front.
  const openMenu = useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  }, []);
  const closeMenu = useCallback(() => setOpen(false), []);

  const handleSelect = useCallback(
    (selected: SortMetric) => {
      onChange(selected);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <View style={[{ marginHorizontal: spacing.md, marginBottom: spacing.sm }]}>
      <Pressable
        ref={triggerRef}
        onPress={openMenu}
        accessibilityRole="button"
        style={[
          styles.trigger,
          {
            borderColor: colors.border,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            gap: spacing.xs,
          },
        ]}
      >
        <Text style={{ color: colors.textSecondary, ...typography.caption }}>
          Sort by:
        </Text>
        <Text style={{ color: colors.text, ...typography.label }}>
          {`${currentLabel} ↓`}
        </Text>
        <ChevronDown size={16} color={colors.textSecondary} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.backdrop} onPress={closeMenu}>
          <View
            style={[
              styles.menu,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                top: (anchor?.y ?? 0) + (anchor?.height ?? 0) + spacing.xs,
                left: anchor?.x ?? 0,
                width: anchor?.width,
              },
            ]}
          >
            {OPTIONS.map(option => (
              <SortMenuOption
                key={option.value}
                option={option}
                selected={option.value === value}
                onSelect={handleSelect}
              />
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 4,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  menu: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 180,
  },
  menuItem: {
    backgroundColor: 'transparent',
  },
});

export default React.memo(SortDropdown);

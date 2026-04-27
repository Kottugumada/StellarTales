import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CultureKey } from '../data/anchorObjects';
import { Space } from '../constants/Colors';

const CULTURE_LABELS: Record<CultureKey, string> = {
  greek: 'Greek',
  arabic: 'Arabic',
  babylonian: 'Babylonian',
  chinese: 'Chinese',
  indian: 'Indian',
  indigenous: 'Indigenous',
};

interface Props {
  available: CultureKey[];
  selected: CultureKey;
  onSelect: (culture: CultureKey) => void;
}

export function CultureSelector({ available, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {available.map((culture) => {
        const active = culture === selected;
        return (
          <TouchableOpacity
            key={culture}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(culture)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {CULTURE_LABELS[culture]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 2,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Space.chip,
    borderWidth: 1,
    borderColor: Space.cardBorder,
  },
  chipActive: {
    backgroundColor: Space.chipActive,
    borderColor: Space.accent,
  },
  label: {
    color: Space.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  labelActive: {
    color: Space.accentBright,
  },
});

import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ANCHOR_OBJECTS, ObjectCategory, SkyObject } from '../../data/anchorObjects';
import { Space } from '../../constants/Colors';

// ── Constants ──────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<ObjectCategory, string> = {
  constellation: '✦',
  star: '★',
  deep_sky: '◎',
  planet: '◉',
};

const CATEGORY_LABELS: Record<ObjectCategory, string> = {
  constellation: 'Constellations',
  star: 'Stars',
  deep_sky: 'Deep Sky',
  planet: 'Planets',
};

type FilterKey = 'all' | ObjectCategory;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'constellation', label: 'Constellations' },
  { key: 'star', label: 'Stars' },
  { key: 'deep_sky', label: 'Deep Sky' },
  { key: 'planet', label: 'Planets' },
];

// ── Components ─────────────────────────────────────────────────────────────

function ObjectRow({ item }: { item: SkyObject }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/object/${item.id}`)}
      activeOpacity={0.75}
    >
      <View style={styles.iconBadge}>
        <Text style={styles.categoryIcon}>{CATEGORY_ICONS[item.category]}</Text>
      </View>
      <View style={styles.rowBody}>
        <View style={styles.rowTitleRow}>
          <Text style={styles.rowName}>{item.name}</Text>
          <Text style={styles.cultureCount}>{item.cultures.length} cultures</Text>
        </View>
        <Text style={styles.rowSubtitle} numberOfLines={1}>{item.subtitle}</Text>
        <Text style={styles.rowHook} numberOfLines={2}>{item.hookText}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function SectionHeader({ category }: { category: ObjectCategory }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{CATEGORY_ICONS[category]}</Text>
      <Text style={styles.sectionLabel}>{CATEGORY_LABELS[category]}</Text>
    </View>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────

type ListItem =
  | { type: 'header'; category: ObjectCategory; key: string }
  | { type: 'object'; data: SkyObject; key: string };

export default function ExploreScreen() {
  const [filter, setFilter] = useState<FilterKey>('all');

  const listItems = useMemo<ListItem[]>(() => {
    if (filter !== 'all') {
      return ANCHOR_OBJECTS.filter((o) => o.category === filter).map((o) => ({
        type: 'object',
        data: o,
        key: o.id,
      }));
    }

    // Grouped view — one section header per category, in display order
    const order: ObjectCategory[] = ['planet', 'constellation', 'star', 'deep_sky'];
    const items: ListItem[] = [];
    for (const cat of order) {
      const objs = ANCHOR_OBJECTS.filter((o) => o.category === cat);
      if (!objs.length) continue;
      items.push({ type: 'header', category: cat, key: `header-${cat}` });
      for (const o of objs) {
        items.push({ type: 'object', data: o, key: o.id });
      }
    }
    return items;
  }, [filter]);

  const counts = useMemo(() => ({
    all: ANCHOR_OBJECTS.length,
    constellation: ANCHOR_OBJECTS.filter((o) => o.category === 'constellation').length,
    star: ANCHOR_OBJECTS.filter((o) => o.category === 'star').length,
    deep_sky: ANCHOR_OBJECTS.filter((o) => o.category === 'deep_sky').length,
    planet: ANCHOR_OBJECTS.filter((o) => o.category === 'planet').length,
  }), []);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Space.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.starDecor}>✦ ✧ ✦ ✧ ✦</Text>
        <Text style={styles.screenTitle}>Explore</Text>
        <Text style={styles.screenSubtitle}>The complete sky catalogue</Text>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersScroll}
      >
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setFilter(key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                {label}
              </Text>
              <Text style={[styles.filterCount, active && styles.filterCountActive]}>
                {counts[key]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Object list */}
      <FlatList<ListItem>
        data={listItems}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) =>
          item.type === 'header' ? (
            <SectionHeader category={item.category} />
          ) : (
            <ObjectRow item={item.data} />
          )
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={({ leadingItem }) =>
          leadingItem?.type === 'header' ? null : <View style={styles.separator} />
        }
      />
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Space.background,
  },

  // Header
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 4,
  },
  starDecor: {
    color: Space.accent,
    fontSize: 11,
    letterSpacing: 4,
    marginBottom: 2,
  },
  screenTitle: {
    color: Space.text,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 1,
  },
  screenSubtitle: {
    color: Space.textSecondary,
    fontSize: 13,
  },

  // Filters
  filtersScroll: {
    flexGrow: 0,
    marginBottom: 4,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Space.chip,
    borderWidth: 1,
    borderColor: Space.cardBorder,
  },
  filterChipActive: {
    backgroundColor: Space.chipActive,
    borderColor: Space.accent,
  },
  filterLabel: {
    color: Space.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  filterLabelActive: {
    color: Space.accentBright,
  },
  filterCount: {
    color: Space.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  filterCountActive: {
    color: Space.accent,
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  separator: {
    height: 1,
    backgroundColor: Space.cardBorder,
    marginLeft: 68,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 20,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  sectionIcon: {
    color: Space.accent,
    fontSize: 14,
  },
  sectionLabel: {
    color: Space.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // Object row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Space.card,
    borderWidth: 1,
    borderColor: Space.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  categoryIcon: {
    color: Space.accent,
    fontSize: 18,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rowName: {
    color: Space.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  cultureCount: {
    color: Space.textMuted,
    fontSize: 11,
    flexShrink: 0,
  },
  rowSubtitle: {
    color: Space.accent,
    fontSize: 11,
    fontWeight: '500',
  },
  rowHook: {
    color: Space.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  chevron: {
    color: Space.textMuted,
    fontSize: 22,
    flexShrink: 0,
  },
});

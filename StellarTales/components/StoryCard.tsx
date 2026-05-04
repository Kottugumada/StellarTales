import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CultureKey } from '../data/anchorObjects';
import { VisibleSkyObject } from '../services/skyEngine';
import { useStory } from '../hooks/useStory';
import { CultureSelector } from './CultureSelector';
import { AudioPlayer } from './AudioPlayer';
import { Space } from '../constants/Colors';

const CATEGORY_ICONS: Record<string, string> = {
  constellation: '✦',
  star: '★',
  deep_sky: '◎',
  planet: '◉',
};

// Approx characters that fit in 6 lines at font-size 14 / line-height 22
const PREVIEW_LENGTH = 380;

interface Props {
  object: VisibleSkyObject;
  onDeepDive?: (objectId: string) => void;
}

export function StoryCard({ object, onDeepDive }: Props) {
  const router = useRouter();
  const [selectedCulture, setSelectedCulture] = useState<CultureKey>(
    object.cultures[0],
  );
  const [expanded, setExpanded] = useState(false);
  const { stories, loading, fetching, getOrFetchStory } = useStory(object);

  const story = stories[selectedCulture];

  function handleCultureSelect(culture: CultureKey) {
    setSelectedCulture(culture);
    setExpanded(false); // collapse when switching culture
    getOrFetchStory(culture);
  }

  const prominenceDots = '★'.repeat(object.prominenceStars) + '☆'.repeat(5 - object.prominenceStars);

  const bodyText = story?.body ?? '';
  const isTruncatable = bodyText.length > PREVIEW_LENGTH;
  const displayBody = expanded || !isTruncatable
    ? bodyText
    : bodyText.slice(0, PREVIEW_LENGTH).trimEnd() + '…';

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.categoryIcon}>{CATEGORY_ICONS[object.category]}</Text>
          <View>
            <Text style={styles.objectName}>{object.name}</Text>
            <Text style={styles.subtitle}>{object.subtitle}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.prominence}>{prominenceDots}</Text>
          <Text style={styles.direction}>{object.directionLabel}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Story body */}
      <View style={styles.storyContainer}>
        {loading ? (
          <ActivityIndicator color={Space.accent} style={styles.loader} />
        ) : story ? (
          <>
            <Text style={styles.storyTitle}>{story.title}</Text>
            <Text style={styles.storyBody}>{displayBody}</Text>
            {isTruncatable && (
              <TouchableOpacity
                onPress={() => setExpanded((e) => !e)}
                activeOpacity={0.7}
                style={styles.expandButton}
              >
                <Text style={styles.expandLabel}>
                  {expanded ? 'Show less ↑' : 'Read more ↓'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <Text style={styles.hookText}>{object.hookText}</Text>
            {fetching && (
              <View style={styles.fetchingRow}>
                <ActivityIndicator size="small" color={Space.accent} />
                <Text style={styles.fetchingLabel}>Fetching story…</Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Audio player */}
      <View style={styles.audioRow}>
        <AudioPlayer text={story?.body ?? null} />
      </View>

      {/* Culture selector */}
      <CultureSelector
        available={object.cultures}
        selected={selectedCulture}
        onSelect={handleCultureSelect}
      />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            onDeepDive?.(object.id);
            router.push(`/object/${object.id}`);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.actionLabel}>Go deeper ↗</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/ar/${object.id}`)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionLabel}>Point at sky ▲</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Space.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Space.cardBorder,
    padding: 20,
    gap: 16,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  categoryIcon: {
    fontSize: 22,
    color: Space.accent,
  },
  objectName: {
    color: Space.text,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: Space.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  prominence: {
    color: Space.accent,
    fontSize: 11,
    letterSpacing: 1,
  },
  direction: {
    color: Space.aurora,
    fontSize: 11,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Space.cardBorder,
  },
  storyContainer: {
    minHeight: 120,
  },
  loader: {
    marginTop: 20,
  },
  storyTitle: {
    color: Space.accentBright,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  storyBody: {
    color: Space.text,
    fontSize: 14,
    lineHeight: 22,
  },
  expandButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  expandLabel: {
    color: Space.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  hookText: {
    color: Space.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  fetchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  fetchingLabel: {
    color: Space.textSecondary,
    fontSize: 12,
  },
  audioRow: {
    paddingVertical: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Space.chipActive,
    borderWidth: 1,
    borderColor: Space.accent,
    alignItems: 'center',
  },
  actionButtonMuted: {
    backgroundColor: Space.chip,
    borderColor: Space.cardBorder,
  },
  actionLabel: {
    color: Space.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  actionLabelMuted: {
    color: Space.textMuted,
  },
});

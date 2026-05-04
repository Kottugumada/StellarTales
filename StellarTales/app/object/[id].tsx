import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ANCHOR_OBJECTS, CultureKey } from '../../data/anchorObjects';
import { useStory } from '../../hooks/useStory';
import { CultureSelector } from '../../components/CultureSelector';
import { AudioPlayer } from '../../components/AudioPlayer';
import { Space } from '../../constants/Colors';

const CATEGORY_ICONS: Record<string, string> = {
  constellation: '✦',
  star: '★',
  deep_sky: '◎',
  planet: '◉',
};

const CATEGORY_LABELS: Record<string, string> = {
  constellation: 'Constellation',
  star: 'Star',
  deep_sky: 'Deep Sky Object',
  planet: 'Planet',
};

export default function ObjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const object = ANCHOR_OBJECTS.find((o) => o.id === id);

  const [selectedCulture, setSelectedCulture] = useState<CultureKey>(
    object ? object.cultures[0] : 'greek',
  );

  const { stories, loading, fetching, getOrFetchStory } = useStory(object ?? ANCHOR_OBJECTS[0]);

  if (!object) {
    return (
      <View style={styles.screen}>
        <Text style={styles.errorText}>Object not found</Text>
      </View>
    );
  }

  const story = stories[selectedCulture];

  function handleCultureSelect(culture: CultureKey) {
    setSelectedCulture(culture);
    getOrFetchStory(culture);
  }

  const prominenceDots =
    '★'.repeat(object.magnitude !== null
      ? (object.magnitude < 0.5 ? 5 : object.magnitude < 1.5 ? 4 : object.magnitude < 2.5 ? 3 : object.magnitude < 4.0 ? 2 : 1)
      : (object.category === 'planet' ? 5 : 4))
    + '☆'.repeat(5 - (object.magnitude !== null
      ? (object.magnitude < 0.5 ? 5 : object.magnitude < 1.5 ? 4 : object.magnitude < 2.5 ? 3 : object.magnitude < 4.0 ? 2 : 1)
      : (object.category === 'planet' ? 5 : 4)));

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Space.background} />

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.backIcon}>←</Text>
        <Text style={styles.backLabel}>Back</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero header */}
        <View style={styles.hero}>
          <Text style={styles.categoryIcon}>{CATEGORY_ICONS[object.category]}</Text>
          <Text style={styles.objectName}>{object.name}</Text>
          <Text style={styles.subtitle}>{object.subtitle}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>{CATEGORY_LABELS[object.category]}</Text>
            </View>
            <Text style={styles.prominenceDots}>{prominenceDots}</Text>
          </View>
        </View>

        {/* Facts card */}
        {(object.magnitude !== null || object.ra !== null || object.hemisphere !== undefined) && (
          <View style={styles.factsCard}>
            <Text style={styles.sectionLabel}>OBJECT FACTS</Text>
            <View style={styles.factsGrid}>
              {object.magnitude !== null && (
                <FactItem label="Magnitude" value={String(object.magnitude)} />
              )}
              {object.ra !== null && (
                <FactItem label="Right Ascension" value={`${object.ra.toFixed(2)}h`} />
              )}
              {object.dec !== null && (
                <FactItem label="Declination" value={`${object.dec > 0 ? '+' : ''}${object.dec}°`} />
              )}
              <FactItem label="Hemisphere" value={
                object.hemisphere === 'both' ? 'Both' :
                object.hemisphere === 'northern' ? 'Northern' : 'Southern'
              } />
              <FactItem label="Cultures" value={`${object.cultures.length} traditions`} />
            </View>
          </View>
        )}

        {/* Hook text */}
        <View style={styles.hookCard}>
          <Text style={styles.sectionLabel}>DID YOU KNOW</Text>
          <Text style={styles.hookText}>{object.hookText}</Text>
        </View>

        {/* Culture selector */}
        <View style={styles.cultureSection}>
          <Text style={styles.sectionLabel}>MYTH &amp; LEGEND</Text>
          <CultureSelector
            available={object.cultures}
            selected={selectedCulture}
            onSelect={handleCultureSelect}
          />
        </View>

        {/* Story */}
        <View style={styles.storyCard}>
          {loading ? (
            <ActivityIndicator color={Space.accent} style={styles.loader} />
          ) : story ? (
            <>
              <Text style={styles.storyTitle}>{story.title}</Text>
              <Text style={styles.storyBody}>{story.body}</Text>
            </>
          ) : (
            <View style={styles.noStoryContainer}>
              <Text style={styles.noStoryText}>{object.hookText}</Text>
              {fetching && (
                <View style={styles.fetchingRow}>
                  <ActivityIndicator size="small" color={Space.accent} />
                  <Text style={styles.fetchingLabel}>Fetching story…</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Audio player */}
        <View style={styles.audioCard}>
          <Text style={styles.sectionLabel}>LISTEN</Text>
          <AudioPlayer text={story?.body ?? null} />
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

function FactItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.factItem}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Space.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 56,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  backIcon: {
    color: Space.accent,
    fontSize: 20,
    lineHeight: 22,
  },
  backLabel: {
    color: Space.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: Space.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 80,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 28,
    gap: 6,
  },
  categoryIcon: {
    fontSize: 44,
    color: Space.accent,
    marginBottom: 4,
  },
  objectName: {
    color: Space.text,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    color: Space.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  metaBadge: {
    backgroundColor: Space.chipActive,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Space.accent,
  },
  metaBadgeText: {
    color: Space.accent,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  prominenceDots: {
    color: Space.accent,
    fontSize: 13,
    letterSpacing: 2,
  },

  // Section label
  sectionLabel: {
    color: Space.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  // Facts card
  factsCard: {
    backgroundColor: Space.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Space.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  factsGrid: {
    gap: 10,
  },
  factItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  factLabel: {
    color: Space.textSecondary,
    fontSize: 13,
  },
  factValue: {
    color: Space.text,
    fontSize: 13,
    fontWeight: '600',
  },

  // Hook card
  hookCard: {
    backgroundColor: Space.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Space.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  hookText: {
    color: Space.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // Culture section
  cultureSection: {
    marginBottom: 12,
  },

  // Story card
  storyCard: {
    backgroundColor: Space.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Space.cardBorder,
    padding: 16,
    minHeight: 120,
    marginBottom: 12,
  },
  loader: {
    marginVertical: 20,
  },
  storyTitle: {
    color: Space.accentBright,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  storyBody: {
    color: Space.text,
    fontSize: 15,
    lineHeight: 24,
  },
  noStoryContainer: {
    gap: 12,
  },
  noStoryText: {
    color: Space.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  fetchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fetchingLabel: {
    color: Space.textSecondary,
    fontSize: 12,
  },

  // Audio card
  audioCard: {
    backgroundColor: Space.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Space.cardBorder,
    padding: 16,
    marginBottom: 12,
  },

  bottomPad: {
    height: 40,
  },
});

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSkyObjects } from '../../hooks/useSkyObjects';
import { StoryCard } from '../../components/StoryCard';
import { VisibleSkyObject } from '../../services/skyEngine';
import { Space } from '../../constants/Colors';

function Header({ date, locationDenied }: { date: Date; locationDenied: boolean }) {
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.header}>
      <Text style={styles.starDecor}>✦ ✧ ✦ ✧ ✦</Text>
      <Text style={styles.screenTitle}>Tonight's Sky</Text>
      <Text style={styles.dateLabel}>{dateStr}</Text>
      {locationDenied && (
        <Text style={styles.locationNote}>
          Using default location · Allow location for your sky
        </Text>
      )}
    </View>
  );
}

function LoadingView() {
  return (
    <View style={styles.center}>
      <Text style={styles.loadingStars}>✦</Text>
      <ActivityIndicator color={Space.accent} style={{ marginTop: 16 }} />
      <Text style={styles.loadingLabel}>Scanning the sky…</Text>
    </View>
  );
}

function EmptyView() {
  return (
    <View style={styles.center}>
      <Text style={styles.emptyIcon}>☁</Text>
      <Text style={styles.emptyTitle}>Nothing visible right now</Text>
      <Text style={styles.emptyBody}>
        The sky may be empty from your location at this hour. Try again after sunset, or browse all objects in the Explore tab.
      </Text>
    </View>
  );
}

export default function TonightScreen() {
  const { objects, loading, locationDenied } = useSkyObjects();
  const now = new Date();

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Space.background} />

      {loading ? (
        <LoadingView />
      ) : (
        <FlatList<VisibleSkyObject>
          data={objects}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<Header date={now} locationDenied={locationDenied} />}
          ListEmptyComponent={<EmptyView />}
          renderItem={({ item }) => (
            <StoryCard
              object={item}
              onDeepDive={(id) => {
                // TODO: navigate to deep-dive screen in Phase 2
                console.log('Deep dive:', id);
              }}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Space.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 80,
  },
  listContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 6,
  },
  starDecor: {
    color: Space.accent,
    fontSize: 12,
    letterSpacing: 4,
    marginBottom: 4,
  },
  screenTitle: {
    color: Space.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1,
  },
  dateLabel: {
    color: Space.textSecondary,
    fontSize: 13,
  },
  locationNote: {
    color: Space.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  loadingStars: {
    fontSize: 40,
    color: Space.accent,
  },
  loadingLabel: {
    color: Space.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    color: Space.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyBody: {
    color: Space.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  separator: {
    height: 16,
  },
});

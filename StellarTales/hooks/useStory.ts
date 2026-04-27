import { useEffect, useState } from 'react';
import { CultureKey, SkyObject } from '../data/anchorObjects';
import { getAllStoriesForObject, saveStory, StoryRow } from '../services/database';
import { fetchFromFirebase, generateWithAI } from '../services/storyCache';

// TODO: store the API key in a .env file and expose via expo-constants
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';

interface StoryState {
  stories: Partial<Record<CultureKey, StoryRow>>;
  loading: boolean;
  fetching: boolean; // true while network-fetching a missing story
}

export function useStory(obj: SkyObject): StoryState & {
  getOrFetchStory: (culture: CultureKey) => Promise<void>;
} {
  const [state, setState] = useState<StoryState>({
    stories: {},
    loading: true,
    fetching: false,
  });

  // Load all available stories from local DB on mount
  useEffect(() => {
    const rows = getAllStoriesForObject(obj.id);
    const stories: Partial<Record<CultureKey, StoryRow>> = {};
    for (const row of rows) {
      stories[row.culture as CultureKey] = row;
    }
    setState({ stories, loading: false, fetching: false });
  }, [obj.id]);

  // Called when the user switches to a culture that has no cached story
  async function getOrFetchStory(culture: CultureKey): Promise<void> {
    if (state.stories[culture]) return; // already have it

    setState((s) => ({ ...s, fetching: true }));

    // 1. Try Firebase shared cache
    let result = await fetchFromFirebase(obj.id, culture);

    // 2. Fall back to GPT-4o-mini generation
    if (!result && OPENAI_API_KEY) {
      result = await generateWithAI(obj.id, obj.name, culture, OPENAI_API_KEY);
    }

    if (result) {
      const newRow: StoryRow = { objectId: obj.id, culture, ...result };
      setState((s) => ({
        ...s,
        fetching: false,
        stories: { ...s.stories, [culture]: newRow },
      }));
    } else {
      setState((s) => ({ ...s, fetching: false }));
    }
  }

  return { ...state, getOrFetchStory };
}

import { CultureKey } from '../data/anchorObjects';
import { saveStory } from './database';

// ── Shared Firebase cache ──────────────────────────────────────────────────
// When one user generates a story, all users benefit on next request.
// TODO: Initialize Firebase app in app/_layout.tsx and wire up these calls.

export async function fetchFromFirebase(
  objectId: string,
  culture: CultureKey,
): Promise<{ title: string; body: string } | null> {
  // TODO: implement with Firebase Firestore
  // const doc = await firestore().collection('stories').doc(`${objectId}_${culture}`).get();
  // if (doc.exists) return doc.data() as { title: string; body: string };
  return null;
}

// ── GPT-4o-mini generation ─────────────────────────────────────────────────
// Called only on a cache miss (not in local DB, not in Firebase).
// Result is saved locally AND uploaded to Firebase so other users get it cached.

const CULTURE_CONTEXT: Record<CultureKey, string> = {
  greek: 'ancient Greek and Roman mythology, including relevant gods, heroes, and cosmological beliefs',
  arabic: 'medieval Islamic Golden Age astronomy (850–1200 CE), Arabic star names and their etymologies, and Arab astronomical contributions',
  babylonian: 'Babylonian and Mesopotamian astronomy and mythology (2000–500 BCE), including their gods, omens, and astronomical records',
  chinese: 'classical Chinese astronomy, the 28 lunar mansions, and Daoist and Confucian cosmological traditions',
  indian: 'Vedic and Jyotisha (Indian astronomical) traditions, including relevant Sanskrit names, nakshatras, and Hindu mythological figures',
  indigenous: 'Indigenous astronomical traditions — specifically Aboriginal Australian sky knowledge, which is the oldest continuous astronomical tradition on Earth',
};

export async function generateWithAI(
  objectId: string,
  objectName: string,
  culture: CultureKey,
  apiKey: string,
): Promise<{ title: string; body: string } | null> {
  try {
    const cultureDesc = CULTURE_CONTEXT[culture];
    const prompt = `You are writing for StellarTales, an astronomy app for people who love the mythology, history, and stories behind objects in the night sky.

Write a story about "${objectName}" from the perspective of ${cultureDesc}.

Requirements:
- 3 paragraphs, each 4–6 sentences
- Open with a hook that surprises or delights the reader
- Include specific details: names, dates, etymology, cultural practices
- Connect the astronomical object to human meaning — navigation, agriculture, religion, story
- Write in a voice that is thoughtful, evocative, and respectful
- Do not use bullet points or headers — flowing prose only

Return a JSON object with exactly two fields:
- "title": a short evocative title (4–7 words)
- "body": the full three-paragraph story as a single string with paragraphs separated by \\n\\n`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    if (!content.title || !content.body) return null;

    // Save locally so we never generate twice
    saveStory(objectId, culture, content.title, content.body);

    // TODO: upload to Firebase so other users benefit
    // await uploadToFirebase(objectId, culture, content);

    return { title: content.title, body: content.body };
  } catch {
    return null;
  }
}

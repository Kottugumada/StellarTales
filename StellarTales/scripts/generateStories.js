/**
 * Pre-generation script: generates mythology stories for all 60 anchor objects
 * across 6 cultural traditions using GPT-4o-mini, then writes them to a JSON
 * file that can be imported as an extended seed (or directly loaded into SQLite
 * via a migration).
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generateStories.js
 *
 * Output:
 *   scripts/generatedStories.json
 *
 * Cost estimate: ~$0.70 total (360 stories × ~300 words × GPT-4o-mini rates)
 * Runtime: ~15–20 minutes (rate-limited to 3 req/s)
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error('Set OPENAI_API_KEY environment variable before running.');
  process.exit(1);
}

// Inline the object list to keep this script self-contained
const OBJECTS = [
  // Constellations
  { id: 'orion', name: 'Orion', category: 'constellation' },
  { id: 'ursa_major', name: 'Ursa Major', category: 'constellation' },
  { id: 'ursa_minor', name: 'Ursa Minor', category: 'constellation' },
  { id: 'cassiopeia', name: 'Cassiopeia', category: 'constellation' },
  { id: 'leo', name: 'Leo', category: 'constellation' },
  { id: 'scorpius', name: 'Scorpius', category: 'constellation' },
  { id: 'taurus', name: 'Taurus', category: 'constellation' },
  { id: 'gemini', name: 'Gemini', category: 'constellation' },
  { id: 'cygnus', name: 'Cygnus', category: 'constellation' },
  { id: 'perseus', name: 'Perseus', category: 'constellation' },
  { id: 'bootes', name: 'Boötes', category: 'constellation' },
  { id: 'hercules', name: 'Hercules', category: 'constellation' },
  { id: 'lyra', name: 'Lyra', category: 'constellation' },
  { id: 'aquila', name: 'Aquila', category: 'constellation' },
  { id: 'andromeda', name: 'Andromeda', category: 'constellation' },
  { id: 'crux', name: 'Crux (Southern Cross)', category: 'constellation' },
  { id: 'centaurus', name: 'Centaurus', category: 'constellation' },
  { id: 'carina', name: 'Carina', category: 'constellation' },
  { id: 'eridanus', name: 'Eridanus', category: 'constellation' },
  { id: 'puppis', name: 'Puppis', category: 'constellation' },
  { id: 'vela', name: 'Vela', category: 'constellation' },
  { id: 'lupus', name: 'Lupus', category: 'constellation' },
  { id: 'piscis_austrinus', name: 'Piscis Austrinus', category: 'constellation' },
  // Stars
  { id: 'polaris', name: 'Polaris (North Star)', category: 'star' },
  { id: 'betelgeuse', name: 'Betelgeuse', category: 'star' },
  { id: 'rigel', name: 'Rigel', category: 'star' },
  { id: 'aldebaran', name: 'Aldebaran', category: 'star' },
  { id: 'algol', name: 'Algol (the Demon Star)', category: 'star' },
  { id: 'vega', name: 'Vega', category: 'star' },
  { id: 'deneb', name: 'Deneb', category: 'star' },
  { id: 'altair', name: 'Altair', category: 'star' },
  { id: 'arcturus', name: 'Arcturus', category: 'star' },
  { id: 'regulus', name: 'Regulus', category: 'star' },
  { id: 'antares', name: 'Antares', category: 'star' },
  { id: 'castor', name: 'Castor', category: 'star' },
  { id: 'pollux', name: 'Pollux', category: 'star' },
  { id: 'spica', name: 'Spica', category: 'star' },
  { id: 'alpha_centauri', name: 'Alpha Centauri (Rigil Kentaurus)', category: 'star' },
  { id: 'hadar', name: 'Hadar (Beta Centauri)', category: 'star' },
  { id: 'canopus', name: 'Canopus', category: 'star' },
  { id: 'fomalhaut', name: 'Fomalhaut', category: 'star' },
  { id: 'achernar', name: 'Achernar', category: 'star' },
  { id: 'acrux', name: 'Acrux (Alpha Crucis)', category: 'star' },
  // Deep sky
  { id: 'orion_nebula', name: 'Orion Nebula (M42)', category: 'deep sky object' },
  { id: 'andromeda_galaxy', name: 'Andromeda Galaxy (M31)', category: 'deep sky object' },
  { id: 'pleiades', name: 'the Pleiades (Seven Sisters, M45)', category: 'star cluster' },
  { id: 'hyades', name: 'the Hyades star cluster', category: 'star cluster' },
  { id: 'm13', name: 'the Hercules Cluster (M13)', category: 'globular cluster' },
  { id: 'm44', name: 'the Beehive Cluster (M44, Praesepe)', category: 'star cluster' },
  { id: 'omega_centauri', name: 'Omega Centauri (NGC 5139)', category: 'globular cluster' },
  { id: 'lmc', name: 'the Large Magellanic Cloud', category: 'satellite galaxy' },
  { id: 'smc', name: 'the Small Magellanic Cloud', category: 'satellite galaxy' },
  { id: 'eta_carinae', name: 'the Eta Carinae Nebula (NGC 3372)', category: 'nebula' },
  { id: 'lagoon_nebula', name: 'the Lagoon Nebula (M8)', category: 'nebula' },
  { id: 'orions_belt', name: "Orion's Belt (the three belt stars of Orion)", category: 'asterism' },
  // Planets
  { id: 'saturn', name: 'the planet Saturn', category: 'planet' },
  { id: 'jupiter', name: 'the planet Jupiter', category: 'planet' },
  { id: 'mars', name: 'the planet Mars', category: 'planet' },
  { id: 'venus', name: 'the planet Venus', category: 'planet' },
  { id: 'mercury', name: 'the planet Mercury', category: 'planet' },
];

const CULTURES = [
  { key: 'greek', desc: 'ancient Greek and Roman mythology, including relevant gods, heroes, and cosmological beliefs' },
  { key: 'arabic', desc: 'medieval Islamic Golden Age astronomy (850–1200 CE), Arabic star names and their etymologies, and Arab astronomical contributions preserved in texts like al-Sufi\'s Book of Fixed Stars' },
  { key: 'babylonian', desc: 'Babylonian and Mesopotamian astronomy and mythology (2000–500 BCE), including their gods, astronomical records, and the origins of astrology' },
  { key: 'chinese', desc: 'classical Chinese astronomy, the 28 lunar mansions (Xiu), and Daoist and Confucian cosmological traditions' },
  { key: 'indian', desc: 'Vedic and Jyotisha (Indian astronomical) traditions, including relevant Sanskrit names, nakshatras, and Hindu mythological figures' },
  { key: 'indigenous', desc: 'Indigenous astronomical traditions — prioritize Aboriginal Australian sky knowledge, the oldest continuous astronomical tradition on Earth, supplemented by Māori, Polynesian, or Lakota traditions where relevant' },
];

async function generateStory(objectName, objectCategory, culture) {
  const prompt = `You are writing for StellarTales, an astronomy app for people who love the mythology, history, and stories behind objects in the night sky.

Write a story about "${objectName}" (a ${objectCategory}) from the perspective of ${culture.desc}.

Requirements:
- 3 paragraphs, each 4–6 sentences
- Open with a hook that surprises or delights the reader
- Include specific details: names, dates, etymology, cultural practices, historical figures
- Connect the astronomical object to human meaning — navigation, agriculture, religion, story
- Write in a voice that is thoughtful, evocative, and respectful
- Flowing prose only — no bullet points or headers

Return a JSON object with exactly two fields:
- "title": a short evocative title (4–7 words)
- "body": the full three-paragraph story as a single string with paragraphs separated by \\n\\n`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const outputPath = path.join(__dirname, 'generatedStories.json');
  let results = {};

  // Resume from previous run if interrupted
  if (fs.existsSync(outputPath)) {
    results = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    console.log(`Resuming — ${Object.keys(results).length} objects already done.`);
  }

  let generated = 0;
  let skipped = 0;

  for (const obj of OBJECTS) {
    if (!results[obj.id]) results[obj.id] = {};

    for (const culture of CULTURES) {
      if (results[obj.id][culture.key]) {
        skipped++;
        continue;
      }

      process.stdout.write(`  ${obj.name} / ${culture.key}… `);
      try {
        const story = await generateStory(obj.name, obj.category, culture);
        results[obj.id][culture.key] = story;
        generated++;
        console.log(`✓ "${story.title}"`);
        fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
        await sleep(340); // ~3 req/s to stay under rate limits
      } catch (err) {
        console.log(`✗ ${err.message}`);
        await sleep(2000);
      }
    }
  }

  console.log(`\nDone. Generated: ${generated}, Skipped (already existed): ${skipped}`);
  console.log(`Output: ${outputPath}`);
  console.log('\nNext step: import generatedStories.json into your SQLite seed via a migration script.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

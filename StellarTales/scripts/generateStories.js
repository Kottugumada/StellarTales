#!/usr/bin/env node
// Generates mythology stories for all 60 anchor objects × 6 cultures via GPT-4o-mini.
// Resumes automatically if interrupted. Run from the StellarTales/ directory:
//   node scripts/generateStories.js

const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

// ── API key ────────────────────────────────────────────────────────────────

const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const apiKeyMatch = envContent.match(/EXPO_PUBLIC_OPENAI_API_KEY=(.+)/);
if (!apiKeyMatch) { console.error('EXPO_PUBLIC_OPENAI_API_KEY not found in .env'); process.exit(1); }
const openai = new OpenAI({ apiKey: apiKeyMatch[1].trim() });

// ── Data ───────────────────────────────────────────────────────────────────

const CULTURES = ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'];

const ANCHOR_OBJECTS = [
  // Constellations – Northern
  { id: 'orion',           name: 'Orion',            subtitle: 'The Hunter' },
  { id: 'ursa_major',      name: 'Ursa Major',        subtitle: 'The Great Bear' },
  { id: 'ursa_minor',      name: 'Ursa Minor',        subtitle: 'The Little Bear' },
  { id: 'cassiopeia',      name: 'Cassiopeia',        subtitle: 'The Queen' },
  { id: 'leo',             name: 'Leo',               subtitle: 'The Lion' },
  { id: 'scorpius',        name: 'Scorpius',          subtitle: 'The Scorpion' },
  { id: 'taurus',          name: 'Taurus',            subtitle: 'The Bull' },
  { id: 'gemini',          name: 'Gemini',            subtitle: 'The Twins' },
  { id: 'cygnus',          name: 'Cygnus',            subtitle: 'The Swan' },
  { id: 'perseus',         name: 'Perseus',           subtitle: 'The Hero' },
  { id: 'bootes',          name: 'Boötes',            subtitle: 'The Herdsman' },
  { id: 'hercules',        name: 'Hercules',          subtitle: 'The Hero' },
  { id: 'lyra',            name: 'Lyra',              subtitle: 'The Lyre' },
  { id: 'aquila',          name: 'Aquila',            subtitle: 'The Eagle' },
  { id: 'andromeda',       name: 'Andromeda',         subtitle: 'The Princess' },
  // Constellations – Southern
  { id: 'crux',            name: 'Crux',              subtitle: 'The Southern Cross' },
  { id: 'centaurus',       name: 'Centaurus',         subtitle: 'The Centaur' },
  { id: 'carina',          name: 'Carina',            subtitle: 'The Keel' },
  { id: 'eridanus',        name: 'Eridanus',          subtitle: 'The River' },
  { id: 'puppis',          name: 'Puppis',            subtitle: 'The Stern' },
  { id: 'vela',            name: 'Vela',              subtitle: 'The Sails' },
  { id: 'lupus',           name: 'Lupus',             subtitle: 'The Wolf' },
  { id: 'piscis_austrinus',name: 'Piscis Austrinus',  subtitle: 'The Southern Fish' },
  // Named Stars – Northern
  { id: 'polaris',         name: 'Polaris',           subtitle: 'The North Star' },
  { id: 'betelgeuse',      name: 'Betelgeuse',        subtitle: 'Red Supergiant in Orion' },
  { id: 'rigel',           name: 'Rigel',             subtitle: 'Blue Supergiant in Orion' },
  { id: 'aldebaran',       name: 'Aldebaran',         subtitle: "The Bull's Eye" },
  { id: 'algol',           name: 'Algol',             subtitle: 'The Demon Star' },
  { id: 'vega',            name: 'Vega',              subtitle: 'The Summer Star' },
  { id: 'deneb',           name: 'Deneb',             subtitle: "The Swan's Tail" },
  { id: 'altair',          name: 'Altair',            subtitle: 'The Flying Eagle' },
  { id: 'arcturus',        name: 'Arcturus',          subtitle: 'Guardian of the Bear' },
  { id: 'regulus',         name: 'Regulus',           subtitle: 'The Little King' },
  { id: 'antares',         name: 'Antares',           subtitle: 'Rival of Mars' },
  { id: 'castor',          name: 'Castor',            subtitle: 'The Mortal Twin' },
  { id: 'pollux',          name: 'Pollux',            subtitle: 'The Immortal Twin' },
  { id: 'spica',           name: 'Spica',             subtitle: 'The Grain' },
  // Named Stars – Southern
  { id: 'alpha_centauri',  name: 'Alpha Centauri',    subtitle: 'Nearest Star System' },
  { id: 'hadar',           name: 'Hadar',             subtitle: 'Pointer to the Cross' },
  { id: 'canopus',         name: 'Canopus',           subtitle: 'Second Brightest Star' },
  { id: 'fomalhaut',       name: 'Fomalhaut',         subtitle: 'Mouth of the Fish' },
  { id: 'achernar',        name: 'Achernar',          subtitle: 'End of the River' },
  { id: 'acrux',           name: 'Acrux',             subtitle: 'Foot of the Cross' },
  // Deep Sky
  { id: 'orion_nebula',    name: 'Orion Nebula',      subtitle: 'M42 · Stellar Nursery' },
  { id: 'andromeda_galaxy',name: 'Andromeda Galaxy',  subtitle: 'M31 · Nearest Galaxy' },
  { id: 'pleiades',        name: 'Pleiades',          subtitle: 'The Seven Sisters' },
  { id: 'hyades',          name: 'Hyades',            subtitle: 'Oldest Named Star Cluster' },
  { id: 'm13',             name: 'Hercules Cluster',  subtitle: 'M13 · Great Globular Cluster' },
  { id: 'm44',             name: 'Beehive Cluster',   subtitle: 'M44 · Praesepe' },
  { id: 'omega_centauri',  name: 'Omega Centauri',    subtitle: 'Largest Globular Cluster' },
  { id: 'lmc',             name: 'Large Magellanic Cloud', subtitle: 'Satellite Galaxy' },
  { id: 'smc',             name: 'Small Magellanic Cloud', subtitle: 'Satellite Galaxy' },
  { id: 'eta_carinae',     name: 'Eta Carinae Nebula',subtitle: 'Hypernova Candidate' },
  { id: 'lagoon_nebula',   name: 'Lagoon Nebula',     subtitle: 'M8 · Naked-Eye Nebula' },
  { id: 'orions_belt',     name: "Orion's Belt",      subtitle: 'The Three Kings' },
  // Planets
  { id: 'saturn',          name: 'Saturn',            subtitle: 'Lord of the Rings' },
  { id: 'jupiter',         name: 'Jupiter',           subtitle: 'King of Planets' },
  { id: 'mars',            name: 'Mars',              subtitle: 'The Red Wanderer' },
  { id: 'venus',           name: 'Venus',             subtitle: 'Morning and Evening Star' },
  { id: 'mercury',         name: 'Mercury',           subtitle: 'The Swift Messenger' },
];

const OUTPUT = path.join(__dirname, 'generatedStories.json');

// ── Prompt ─────────────────────────────────────────────────────────────────

function buildPrompt(obj, culture) {
  const cultureLabel = {
    greek: 'ancient Greek', arabic: 'classical Arabic/Islamic', babylonian: 'ancient Babylonian/Mesopotamian',
    chinese: 'classical Chinese', indian: 'ancient Indian/Hindu/Vedic', indigenous: 'Indigenous (Aboriginal Australian, Polynesian, or Native American)',
  }[culture];

  return `You are writing for StellarTales, a mobile app that brings astronomy mythology to life. Write a 3–4 paragraph story (280–380 words) about ${obj.name} (${obj.subtitle}) through the lens of the ${cultureLabel} astronomical tradition.

Style requirements:
- Rich, evocative prose — the tone of a great science writer, not an encyclopedia
- Flow naturally between myth, culture, and one real astronomical fact about the object
- Include something specific: a name etymology, a ritual, a historical figure, a precise observation, or a surprising cross-cultural connection
- Do NOT use bullet points, headers, or "In [culture] tradition..." as an opening
- Do NOT include generic statements like "across cultures" or "many civilizations"
- Match this example tone (Betelgeuse in Arabic): "In Arabic, the star is Ibt al-Jauzah — armpit of the giant. It is a perfectly sensible description: the star sits at the upper-left shoulder of the figure we call Orion, roughly where a giant's armpit would be..."

Return only valid JSON: {"title": "evocative title (3–6 words)", "body": "full story text"}`;
}

// ── Generation ─────────────────────────────────────────────────────────────

async function generateStory(obj, culture) {
  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: buildPrompt(obj, culture) }],
    response_format: { type: 'json_object' },
    temperature: 0.85,
    max_tokens: 650,
  });
  return JSON.parse(resp.choices[0].message.content);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  let data = {};
  try { data = JSON.parse(fs.readFileSync(OUTPUT, 'utf8')); } catch {}

  const total = ANCHOR_OBJECTS.length * CULTURES.length;
  let done = 0, skipped = 0, failed = 0;

  // Count already done
  for (const obj of ANCHOR_OBJECTS)
    for (const c of CULTURES)
      if (data[obj.id]?.[c]) done++;

  console.log(`Starting generation: ${total} stories (${done} already done, ${total - done} remaining)\n`);

  for (const obj of ANCHOR_OBJECTS) {
    for (const culture of CULTURES) {
      if (data[obj.id]?.[culture]) { skipped++; continue; }

      process.stdout.write(`  ${obj.id}/${culture} ... `);
      try {
        const story = await generateStory(obj, culture);
        if (!data[obj.id]) data[obj.id] = {};
        data[obj.id][culture] = story;
        fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
        done++;
        console.log(`✓  "${story.title}"`);
      } catch (err) {
        failed++;
        console.log(`✗  ${err.message}`);
      }
      await sleep(300); // stay well under rate limits
    }
    console.log(`  ── ${obj.name} complete (${done}/${total})\n`);
  }

  console.log(`\n✓ Generation complete.`);
  console.log(`  Generated: ${done - skipped}  |  Skipped (already done): ${skipped}  |  Failed: ${failed}`);
  if (failed > 0) console.log(`  Re-run to retry failed entries.`);
}

main().catch(err => { console.error(err); process.exit(1); });

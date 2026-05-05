#!/usr/bin/env node
// Builds assets/stellartales.db — a pre-populated SQLite file bundled with the app.
// Run: node scripts/buildDatabase.js
// The output file is copied to the device on first launch (see services/database.ts).

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../assets/stellartales.db');
if (fs.existsSync(OUT)) fs.unlinkSync(OUT);

const db = new Database(OUT);

// ── Schema ─────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE sky_objects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    ra REAL,
    dec REAL,
    magnitude REAL,
    hemisphere TEXT NOT NULL,
    hook_text TEXT NOT NULL
  );

  CREATE TABLE stories (
    object_id TEXT NOT NULL,
    culture TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    PRIMARY KEY (object_id, culture)
  );

  CREATE TABLE audio_cache (
    object_id TEXT NOT NULL,
    culture TEXT NOT NULL,
    file_path TEXT NOT NULL,
    PRIMARY KEY (object_id, culture)
  );
`);

// ── Anchor objects ─────────────────────────────────────────────────────────

const ANCHOR_OBJECTS = [
  { id:'orion',            name:'Orion',               category:'constellation', ra:5.58,   dec:-5,      magnitude:null, hemisphere:'both',     hookText:"The greatest hunter in Greek myth, placed in the stars by Zeus. Every star name in this constellation is Arabic — preserved by scholars who kept ancient knowledge alive during Europe's dark ages." },
  { id:'ursa_major',       name:'Ursa Major',           category:'constellation', ra:10.67,  dec:55,      magnitude:null, hemisphere:'northern', hookText:"Callisto, transformed into a bear by Zeus and placed in the stars. The seven brightest stars form the Big Dipper — one of the few star patterns recognized independently by cultures on every inhabited continent." },
  { id:'ursa_minor',       name:'Ursa Minor',           category:'constellation', ra:15.0,   dec:75,      magnitude:null, hemisphere:'northern', hookText:"The Little Bear circles the northern celestial pole. Its tail tip is Polaris — humanity's fixed beacon for navigation across every culture and ocean for five thousand years." },
  { id:'cassiopeia',       name:'Cassiopeia',           category:'constellation', ra:1.0,    dec:60,      magnitude:null, hemisphere:'northern', hookText:"The vain queen of Ethiopia, placed in the sky as punishment — forever spinning around the pole, sometimes upside down, forever paying for her pride." },
  { id:'leo',              name:'Leo',                  category:'constellation', ra:10.67,  dec:15,      magnitude:null, hemisphere:'northern', hookText:"The Nemean Lion, slain by Hercules as his first labor. Its hide was impervious to weapons — Hercules had to strangle it. Zeus honored its ferocity by placing it among the stars." },
  { id:'scorpius',         name:'Scorpius',             category:'constellation', ra:16.88,  dec:-30,     magnitude:null, hemisphere:'southern', hookText:"The scorpion that killed Orion. Zeus placed both in the sky on opposite sides — as Scorpius rises, Orion sets. They have not shared the same sky in four thousand years." },
  { id:'taurus',           name:'Taurus',               category:'constellation', ra:4.7,    dec:15,      magnitude:null, hemisphere:'northern', hookText:"Zeus in disguise, courting Europa. Home to two of the most famous star clusters in the sky — the Pleiades and the Hyades — and the site of the Crab Nebula, remnant of a supernova witnessed in 1054 CE." },
  { id:'gemini',           name:'Gemini',               category:'constellation', ra:7.0,    dec:22,      magnitude:null, hemisphere:'northern', hookText:"Castor and Pollux — one mortal, one immortal. When Castor died, Pollux begged Zeus to share his immortality rather than live without his brother. Zeus gave them the sky together." },
  { id:'cygnus',           name:'Cygnus',               category:'constellation', ra:20.68,  dec:44,      magnitude:null, hemisphere:'northern', hookText:"Zeus as a swan, or perhaps Orpheus transformed after death. The swan flies down the Milky Way. Its brightest star, Deneb, is so luminous its light left the star around 1,500 years ago — before Rome fell." },
  { id:'perseus',          name:'Perseus',              category:'constellation', ra:3.17,   dec:45,      magnitude:null, hemisphere:'northern', hookText:"Perseus holds the severed head of Medusa — represented by Algol, the Demon Star, which dims every 2.87 days as a dark companion eclipses it. Arab astronomers observed this variability centuries before the telescope." },
  { id:'bootes',           name:'Boötes',               category:'constellation', ra:14.7,   dec:31,      magnitude:null, hemisphere:'northern', hookText:"The Herdsman drives the Great Bear around the pole. His brightest star, Arcturus, is the third-brightest in the night sky — an orange giant 37 light-years away whose light you see tonight left just before you were born." },
  { id:'hercules',         name:'Hercules',             category:'constellation', ra:17.23,  dec:27,      magnitude:null, hemisphere:'northern', hookText:"The greatest hero of Greek myth contains one of the finest sights in the sky — M13, a ball of 300,000 stars. In 1974 humanity aimed the Arecibo telescope at it and beamed a message that will arrive in 25,000 years." },
  { id:'lyra',             name:'Lyra',                 category:'constellation', ra:18.85,  dec:36,      magnitude:null, hemisphere:'northern', hookText:"The lyre of Orpheus, whose music could move stones and trees. Its brightest star, Vega, will become the North Star in 13,000 years as Earth's axis slowly wobbles through space." },
  { id:'aquila',           name:'Aquila',               category:'constellation', ra:19.67,  dec:3,       magnitude:null, hemisphere:'both',     hookText:"Zeus's eagle, carrier of thunderbolts. In Chinese astronomy, its bright star Altair is the Cowherd — separated from the Weaver Girl (Vega) by the Silver River of the Milky Way, allowed to meet just once a year." },
  { id:'andromeda',        name:'Andromeda',            category:'constellation', ra:0.8,    dec:38,      magnitude:null, hemisphere:'northern', hookText:"The princess chained to a rock as sacrifice, rescued by Perseus. Within this constellation lies the Andromeda Galaxy — a faint smudge visible to the naked eye containing a trillion stars, 2.5 million light-years away." },
  { id:'crux',             name:'Crux',                 category:'constellation', ra:12.43,  dec:-60,     magnitude:null, hemisphere:'southern', hookText:"The smallest constellation but the most recognized in the southern sky, on five national flags. To Aboriginal Australians, the dark cloud beside it forms the head of the Emu in the Sky — a figure traced in darkness, not stars." },
  { id:'centaurus',        name:'Centaurus',            category:'constellation', ra:13.07,  dec:-47,     magnitude:null, hemisphere:'southern', hookText:"Chiron, the wise centaur and tutor of heroes. Contains both the nearest star system to our Sun — Alpha Centauri, 4.37 light-years away — and Omega Centauri, the largest globular cluster in our galaxy." },
  { id:'carina',           name:'Carina',               category:'constellation', ra:8.68,   dec:-65,     magnitude:null, hemisphere:'southern', hookText:"The keel of the Argo, Jason's ship that sailed for the Golden Fleece. Contains Canopus, second-brightest star in the night sky, and Eta Carinae — a hypernova candidate, one of the most luminous stars known." },
  { id:'eridanus',         name:'Eridanus',             category:'constellation', ra:3.25,   dec:-29,     magnitude:null, hemisphere:'both',     hookText:"The great celestial river stretching from Orion to the southern horizon — where Phaethon fell after crashing the sun-chariot. Its southernmost star, Achernar, means 'end of the river' in Arabic." },
  { id:'puppis',           name:'Puppis',               category:'constellation', ra:7.83,   dec:-35,     magnitude:null, hemisphere:'southern', hookText:"The stern of the Argo — once part of the massive Argo Navis constellation, broken into three by astronomers in 1752. The Milky Way runs through it, making Puppis rich with clusters and nebulae." },
  { id:'vela',             name:'Vela',                 category:'constellation', ra:9.5,    dec:-47,     magnitude:null, hemisphere:'southern', hookText:"The sails of the Argo. Contains a pulsar — the collapsed remnant of a star that exploded 11,000 years ago, now spinning 11 times per second, a lighthouse in the wreckage of a stellar death." },
  { id:'lupus',            name:'Lupus',                category:'constellation', ra:15.22,  dec:-42,     magnitude:null, hemisphere:'southern', hookText:"Near here in 1006 CE blazed the brightest supernova in recorded human history — observed by astronomers in China, Egypt, Iraq, Switzerland, and Japan. Lupus holds the memory of that ancient stellar death." },
  { id:'piscis_austrinus', name:'Piscis Austrinus',     category:'constellation', ra:22.28,  dec:-30,     magnitude:null, hemisphere:'southern', hookText:"The fish that drinks the water poured by Aquarius. Its only named star is Fomalhaut — but that star has proven to have a dramatic debris disk and one of the most complex directly imaged planetary systems." },
  { id:'polaris',          name:'Polaris',              category:'star',          ra:2.52,   dec:89.26,   magnitude:1.98, hemisphere:'northern', hookText:"Humanity's fixed point in a turning sky — virtually every northern culture built navigation, myth, and calendar around this star. In 13,000 years, as Earth's axis wobbles, Vega will take its place." },
  { id:'betelgeuse',       name:'Betelgeuse',           category:'star',          ra:5.92,   dec:7.41,    magnitude:0.5,  hemisphere:'both',     hookText:"Its name is Arabic for 'armpit of the giant,' corrupted by a medieval scribe misreading the letter I as B. A red supergiant 700 times the size of our Sun — when it explodes, it will outshine the full moon." },
  { id:'rigel',            name:'Rigel',                category:'star',          ra:5.24,   dec:-8.2,    magnitude:0.13, hemisphere:'both',     hookText:"Arabic for 'the left leg of the giant.' Rigel is a blue supergiant 120,000 times more luminous than our Sun. Despite being labeled beta, it is usually brighter than Betelgeuse." },
  { id:'aldebaran',        name:'Aldebaran',            category:'star',          ra:4.6,    dec:16.5,    magnitude:0.86, hemisphere:'northern', hookText:"Arabic for 'the follower' — it follows the Pleiades across the sky. The fiery red eye of Taurus, one of the four Royal Stars of Babylon, used to mark the spring equinox and the beginning of the planting season." },
  { id:'algol',            name:'Algol',                category:'star',          ra:3.13,   dec:40.96,   magnitude:2.12, hemisphere:'northern', hookText:"Arabic for 'the demon's head' — the winking eye of Medusa. Arab astronomers noticed centuries ago that it dims every 2.87 days, making it the first eclipsing binary ever recognized, long before the telescope." },
  { id:'vega',             name:'Vega',                 category:'star',          ra:18.6,   dec:38.78,   magnitude:0.03, hemisphere:'northern', hookText:"Arabic for 'the swooping eagle.' Vega was humanity's pole star 14,000 years ago and will be again in 13,000. In Carl Sagan's Contact, it is the origin of the first message from intelligent life." },
  { id:'deneb',            name:'Deneb',                category:'star',          ra:20.68,  dec:45.28,   magnitude:1.25, hemisphere:'northern', hookText:"Arabic for 'tail of the hen.' Deneb's light left the star around 1,500 years ago — before the fall of Rome was complete. It is one of the most luminous stars in our galaxy, distance still not precisely known." },
  { id:'altair',           name:'Altair',               category:'star',          ra:19.83,  dec:8.87,    magnitude:0.77, hemisphere:'both',     hookText:"In Chinese legend, the Cowherd separated from the Weaver Girl (Vega) by the Silver River of the Milky Way. On the seventh night of the seventh month, magpies form a bridge so the lovers can meet — still celebrated as Tanabata in Japan." },
  { id:'arcturus',         name:'Arcturus',             category:'star',          ra:14.27,  dec:19.18,   magnitude:-0.05,hemisphere:'northern', hookText:"Greek for 'guardian of the bear' — it chases Ursa Major around the pole. The fourth-brightest star in the sky, its light powered the opening ceremony of the 1933 Chicago World's Fair via photoelectric cell." },
  { id:'regulus',          name:'Regulus',              category:'star',          ra:10.13,  dec:11.97,   magnitude:1.35, hemisphere:'northern', hookText:"The heart of Leo the Lion. One of the four Royal Stars of Babylon, guarding the sky at a cardinal point. Regulus sits so close to the ecliptic that the Moon occasionally passes in front of it — and rarely, so does Venus." },
  { id:'antares',          name:'Antares',              category:'star',          ra:16.48,  dec:-26.43,  magnitude:1.09, hemisphere:'southern', hookText:"Greek for 'rival of Mars' — its deep red rivals the planet in color and brightness. A red supergiant so enormous that if placed at our Sun's position, it would engulf everything out to the orbit of Jupiter." },
  { id:'castor',           name:'Castor',               category:'star',          ra:7.57,   dec:31.89,   magnitude:1.58, hemisphere:'northern', hookText:"The mortal of the divine twins. What appears as one star is actually six — three pairs of binary stars locked in a complex gravitational dance, all slowly orbiting each other over thousands of years." },
  { id:'pollux',           name:'Pollux',               category:'star',          ra:7.75,   dec:28.03,   magnitude:1.14, hemisphere:'northern', hookText:"The immortal twin who begged Zeus to share his immortality with his dying mortal brother. Pollux has a confirmed exoplanet — a gas giant orbiting in the habitable zone of this orange giant star." },
  { id:'spica',            name:'Spica',                category:'star',          ra:13.42,  dec:-11.16,  magnitude:0.97, hemisphere:'both',     hookText:"The ear of grain held by Virgo the harvest goddess. In 127 BCE, the astronomer Hipparchus used Spica to discover the precession of the equinoxes — the 26,000-year wobble of Earth's axis that shifts the entire night sky." },
  { id:'alpha_centauri',   name:'Alpha Centauri',       category:'star',          ra:14.65,  dec:-60.83,  magnitude:-0.27,hemisphere:'southern', hookText:"Our nearest stellar neighbor at 4.37 light-years. The light you see tonight left just before the 2020s began. One of its three stars, Proxima Centauri, may host a rocky planet in the habitable zone." },
  { id:'hadar',            name:'Hadar',                category:'star',          ra:14.05,  dec:-60.37,  magnitude:0.61, hemisphere:'southern', hookText:"Arabic for 'the ground.' Hadar and Alpha Centauri are the two pointer stars that guide navigators to the Southern Cross. Though adjacent in the sky, Hadar is 100 times farther from us than Alpha Centauri." },
  { id:'canopus',          name:'Canopus',              category:'star',          ra:6.4,    dec:-52.7,   magnitude:-0.74,hemisphere:'southern', hookText:"Named for the navigator of Menelaus's fleet in the Trojan War. So bright and steady that NASA uses Canopus as a navigational reference for spacecraft — it appears in the star trackers of many planetary probes." },
  { id:'fomalhaut',        name:'Fomalhaut',            category:'star',          ra:22.95,  dec:-29.62,  magnitude:1.16, hemisphere:'southern', hookText:"Arabic for 'mouth of the fish.' One of the four Royal Stars of Babylon. One of the first stars with a directly imaged planetary system — a young world dramatically plowing through a vast ring of debris." },
  { id:'achernar',         name:'Achernar',             category:'star',          ra:1.62,   dec:-57.24,  magnitude:0.46, hemisphere:'southern', hookText:"Arabic for 'end of the river' — where Phaethon fell. One of the most oblate stars known: rotating so fast that its equatorial diameter is 56% wider than its poles, giving it a pronounced spinning-top bulge." },
  { id:'acrux',            name:'Acrux',                category:'star',          ra:12.44,  dec:-63.1,   magnitude:0.77, hemisphere:'southern', hookText:"The brightest star in the Southern Cross, invisible from most of Europe and unknown to Western astronomy until the Age of Exploration. It guided southern navigators the way Polaris guides northern sailors." },
  { id:'orion_nebula',     name:'Orion Nebula',         category:'deep_sky',      ra:5.58,   dec:-5.39,   magnitude:4.0,  hemisphere:'both',     hookText:"Visible to the naked eye as a fuzzy patch in Orion's sword, this is one of the most photographed objects in the sky — a vast nursery where new stars and planetary systems are forming, right now, 1,344 light-years away." },
  { id:'andromeda_galaxy', name:'Andromeda Galaxy',     category:'deep_sky',      ra:0.7,    dec:41.27,   magnitude:3.44, hemisphere:'northern', hookText:"The farthest object visible to the naked eye. Every photon you see left Andromeda 2.5 million years ago — before our species existed. In 4.5 billion years it will collide and merge with our Milky Way." },
  { id:'pleiades',         name:'Pleiades',             category:'deep_sky',      ra:3.78,   dec:24.11,   magnitude:1.6,  hemisphere:'northern', hookText:"The Seven Sisters appear in Greek, Aboriginal Australian, Japanese, Norse, and Aztec mythology independently. Their logo is Subaru — six of the seven sisters. The Aboriginal seven-sisters story may be the oldest continuously told narrative in human history." },
  { id:'hyades',           name:'Hyades',               category:'deep_sky',      ra:4.45,   dec:15.87,   magnitude:0.5,  hemisphere:'northern', hookText:"The nearest star cluster to Earth and the oldest named in history — Homer mentions them in the Iliad. Half-sisters of the Pleiades, daughters of Atlas who wept for their lost brother Hyas until Zeus placed them in the stars." },
  { id:'m13',              name:'Hercules Cluster',     category:'deep_sky',      ra:16.7,   dec:36.46,   magnitude:5.8,  hemisphere:'northern', hookText:"A ball of 300,000 stars compressed into 145 light-years of space. In 1974, humanity aimed the Arecibo radio telescope at M13 and transmitted a message encoding our location, biology, and mathematics. It will arrive in 25,000 years." },
  { id:'m44',              name:'Beehive Cluster',      category:'deep_sky',      ra:8.67,   dec:19.98,   magnitude:3.7,  hemisphere:'northern', hookText:"To ancient Greeks and Romans this fuzzy patch was 'the manger' — Praesepe — with the two nearby stars as donkeys feeding at it. When it was visible but clouded over, Romans took it as a storm warning before battle." },
  { id:'omega_centauri',   name:'Omega Centauri',       category:'deep_sky',      ra:13.43,  dec:-47.48,  magnitude:3.9,  hemisphere:'southern', hookText:"The largest globular cluster in our galaxy — ten million stars packed into a sphere 150 light-years wide. It may be the stripped core of a dwarf galaxy the Milky Way consumed billions of years ago." },
  { id:'lmc',              name:'Large Magellanic Cloud',category:'deep_sky',     ra:5.38,   dec:-69.75,  magnitude:0.9,  hemisphere:'southern', hookText:"A satellite galaxy visible as a detached piece of the Milky Way. In 1987, a supernova here was the first naked-eye supernova since 1604 — and the first from which neutrinos were detected on Earth." },
  { id:'smc',              name:'Small Magellanic Cloud',category:'deep_sky',     ra:0.87,   dec:-72.8,   magnitude:2.7,  hemisphere:'southern', hookText:"Named for Magellan's crew who described them to European audiences in 1519 — though Pacific Islander and Indigenous Australian navigators had known them for thousands of years before any European set sail." },
  { id:'eta_carinae',      name:'Eta Carinae Nebula',   category:'deep_sky',      ra:10.75,  dec:-59.87,  magnitude:4.0,  hemisphere:'southern', hookText:"One of the most massive stars known — five million times brighter than our Sun — wrapped in the nebula of material it has already ejected. When it explodes, it may be the most spectacular event in all of recorded human history." },
  { id:'lagoon_nebula',    name:'Lagoon Nebula',        category:'deep_sky',      ra:18.05,  dec:-24.37,  magnitude:6.0,  hemisphere:'southern', hookText:"A glowing cloud where new stars are forming, visible to the naked eye from dark skies as a patch in Sagittarius. The turbulent Hourglass Nebula sits within it, sculpted by the stellar winds of a young, hot star." },
  { id:'orions_belt',      name:"Orion's Belt",         category:'deep_sky',      ra:5.53,   dec:-0.3,    magnitude:1.7,  hemisphere:'both',     hookText:"Three perfectly aligned stars that have captivated every culture. The Arabs called them Al-Mizan, the scales. Norse mythology made them Frigg's distaff. Medieval Christians called them the Three Kings. The Egyptians aligned the Great Pyramids with them." },
  { id:'saturn',           name:'Saturn',               category:'planet',        ra:null,   dec:null,    magnitude:null, hemisphere:'both',     hookText:"To the Babylonians, Ninurta — god of war, agriculture, and the south wind. Saturday takes Saturn's name directly from them, via Rome. Its 29.5-year orbit was tracked with astonishing precision 2,500 years ago. Its rings are visible in any small telescope." },
  { id:'jupiter',          name:'Jupiter',              category:'planet',        ra:null,   dec:null,    magnitude:null, hemisphere:'both',     hookText:"King of the gods in nearly every culture that saw it. Thursday takes its name from Jupiter — Thor's day, the Germanic sky father standing in for Roman Jove. Its four largest moons, discovered by Galileo in 1610, proved Earth is not the center of everything." },
  { id:'mars',             name:'Mars',                 category:'planet',        ra:null,   dec:null,    magnitude:null, hemisphere:'both',     hookText:"Its blood-red color made it the war god in every culture that observed it. Babylonian astronomers tracked its retrograde motion — the mysterious backward loop it traces in the sky — for centuries before anyone understood why." },
  { id:'venus',            name:'Venus',                category:'planet',        ra:null,   dec:null,    magnitude:null, hemisphere:'both',     hookText:"The brightest natural object in the night sky after the Moon. Ancient astronomers thought the morning and evening apparitions were two different objects. The Babylonians were first to recognize they were one. The Maya built entire temples aligned to Venus." },
  { id:'mercury',          name:'Mercury',              category:'planet',        ra:null,   dec:null,    magnitude:null, hemisphere:'both',     hookText:"The most elusive of the naked-eye planets — never far from the Sun. Its speed, completing an orbit in 88 days, made it the messenger god in Greece, Rome, and Egypt alike. Copernicus allegedly never saw it in his lifetime." },
];

const insertObj = db.prepare(
  'INSERT INTO sky_objects (id, name, category, ra, dec, magnitude, hemisphere, hook_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
);
for (const o of ANCHOR_OBJECTS) {
  insertObj.run(o.id, o.name, o.category, o.ra, o.dec, o.magnitude, o.hemisphere, o.hookText);
}
console.log(`✓ Inserted ${ANCHOR_OBJECTS.length} sky objects`);

// ── Stories ────────────────────────────────────────────────────────────────

const insertStory = db.prepare(
  'INSERT OR REPLACE INTO stories (object_id, culture, title, body) VALUES (?, ?, ?, ?)'
);

// 1. Generated stories (all 360)
const generated = JSON.parse(fs.readFileSync(path.join(__dirname, 'generatedStories.json'), 'utf8'));
let genCount = 0;
for (const [objectId, cultures] of Object.entries(generated)) {
  for (const [culture, story] of Object.entries(cultures)) {
    insertStory.run(objectId, culture, story.title, story.body);
    genCount++;
  }
}
console.log(`✓ Inserted ${genCount} generated stories`);

// 2. Hand-crafted stories — INSERT OR REPLACE so they override generated ones
const HAND_CRAFTED = {
  orion: {
    greek: {
      title: 'The Greatest Hunter',
      body: `Orion was the son of Poseidon and the gorgon Euryale — inheriting from his father the gift of walking upon the sea. He was, by all accounts of the ancient world, the greatest hunter who ever lived. His companions were the goddess Artemis herself, and his hunting dogs Canis Major and Canis Minor still follow him across the sky.

The stories of his death are as numerous as the cultures that told them. The most enduring: Gaia, angered by Orion's boast that he would hunt every creature on earth, sent a giant scorpion to kill him. Zeus placed them both in the sky on opposite sides — as Scorpius rises in the east, Orion sets in the west. They have not shared the sky in four thousand years, and they never will.

Another tradition says it was Artemis herself who killed him, tricked by her brother Apollo into shooting an arrow at a distant shape in the sea — not knowing it was Orion swimming. Her grief was so profound that she placed him in the most prominent position in the winter sky, where he will shine until the stars themselves burn out.`,
    },
    arabic: {
      title: 'Al-Jabbar, The Giant',
      body: `Arab astronomers of the ninth and tenth centuries — working in Baghdad, Samarkand, and Cordoba — preserved the Greek knowledge of Orion and made it their own. They called the constellation Al-Jabbar, "the Giant," and his stars became the foundation of the Arabic star-naming tradition that persists to this day.

Every star name in Orion is Arabic. Betelgeuse — Ibt al-Jauzah — means "armpit of the giant." Rigel — Rijl Jauzah al-Yusra — means "the left leg of the giant." Bellatrix means "the female warrior," Mintaka means "the belt," Alnitak means "the girdle," Alnilam means "the string of pearls." These names entered European astronomy in the 12th and 13th centuries through Latin translations of Arabic star catalogues, particularly al-Sufi's Book of Fixed Stars, written in 964 CE.

When you say the name "Betelgeuse" tonight, you are speaking Arabic, through a medieval scribe's error, filtered through five centuries of European astronomy. The name is a living artifact of the Islamic Golden Age's rescue of human knowledge.`,
    },
    babylonian: {
      title: 'The True Shepherd of Anu',
      body: `Three thousand years before Greek astronomers named this constellation Orion, the Babylonians called it MUL.SIPA.ZI.AN.NA — "the True Shepherd of Anu," the sky god. It is one of the oldest recorded constellation names in human history, appearing in Babylonian star catalogues from 1200 BCE and possibly far older in oral tradition.

In Babylonian cosmology, Anu was the king of the gods and the personification of the sky itself. The constellation we call Orion marked his favored shepherd — a figure of order and protection in the celestial realm. The Babylonians tracked this constellation carefully because it helped them navigate the agricultural calendar and predict the seasons their civilization depended upon.

When the Greeks later told their stories of Orion the hunter, they were inheriting a tradition already two thousand years old. The stars had been mapped, named, and storied long before Homer composed a single line.`,
    },
    indigenous: {
      title: 'The Sky Stories of the First Astronomers',
      body: `Aboriginal Australians have been observing and naming the stars for at least 65,000 years — making their sky knowledge the oldest continuous astronomical tradition on Earth. The stars of what Western astronomy calls Orion carry different meanings in different Aboriginal nations, reflecting the enormous cultural diversity of the continent.

In some traditions, the belt stars and sword of Orion represent a fishing line or a canoe. In others, Betelgeuse is a significant wayfinding star used for navigation across country. In the Yolŋu tradition of Arnhem Land, the stars have complex relationships to clan systems, ceremony, and the management of seasonal resources.

What is remarkable is not just the age of these traditions but their sophistication — Aboriginal astronomical knowledge included understanding of star rising times as seasonal calendars, the use of celestial navigation across thousands of kilometers, and in some regions, recognition of variable stars like Betelgeuse and Antares, whose color changes were noted and incorporated into story.`,
    },
  },
  pleiades: {
    greek: {
      title: 'The Seven Sisters',
      body: `The Pleiades were the seven daughters of the Titan Atlas and the ocean-nymph Pleione. Their names were Maia, Electra, Taygete, Alcyone, Celaeno, Sterope, and Merope — and their stories were woven through Greek literature from Hesiod to Homer to Ovid.

Orion the hunter pursued them for seven years across the earth. Zeus, taking pity, transformed them first into doves, then into stars. But Orion was also placed in the sky, and he still pursues them across the winter heavens as he always has. The sisters cluster together, forever on the run from the great hunter below them.

The tradition that one sister is hidden — that only six are visible to the naked eye, not seven — has a dozen explanations in Greek myth. Most say Merope hides her face in shame for having married a mortal man, Sisyphus, while her sisters married gods. Others say Electra covers her face in grief after the fall of Troy, whose kings were her descendants.`,
    },
    indigenous: {
      title: 'The Oldest Story Ever Told',
      body: `The Pleiades appear in the mythologies of cultures separated by oceans and millennia: Greek, Babylonian, Hindu, Aboriginal Australian, Māori, Lakota, Aztec, and dozens more. In almost every tradition, they are a group of women — and in a striking number of traditions, a male figure pursues them.

In Aboriginal Australian traditions across multiple nations, the Pleiades are the Seven Sisters, chased through the sky by a man represented by the stars of Orion. The stories vary in detail from nation to nation across the continent, but the central narrative — women pursued by a man — appears with astonishing consistency in traditions that have had no contact with each other for tens of thousands of years.

Researchers have proposed that this story originated in a single ancestral tradition before the ancestors of Aboriginal Australians left Africa, over 100,000 years ago. If true, this would make the Seven Sisters story the oldest continuously told narrative in human history — predating the pyramids by a factor of twenty, predating writing by a factor of fifteen. When you look at the Pleiades tonight, you may be looking at the oldest story ever told.`,
    },
  },
  polaris: {
    greek: {
      title: 'The Unmoving Star',
      body: `In Greek myth, Polaris marks the tail of Ursa Minor, the Little Bear — which is Arcas, the son of Zeus and Callisto. Callisto was a nymph devoted to Artemis, the goddess of the hunt. Zeus fell in love with her and, according to some versions, deceived her by disguising himself as Artemis. She became pregnant.

When Callisto gave birth to Arcas, the gods' anger ignited. Some say it was Artemis who transformed Callisto into a bear in punishment for breaking her vow of chastity. Some say it was Hera, Zeus's wife, consumed by jealousy. Callisto wandered the forests as a bear for years, unable to speak or make herself known.

Years later, Arcas grew up to become a hunter — and almost killed his own mother, not recognizing the bear she had become. Zeus intervened at the last moment, transformed Arcas into a bear as well, and hurled them both into the sky where they would be safe forever. There, Callisto became Ursa Major, the Great Bear. Arcas became Ursa Minor, the Little Bear — his tail tip reaching up to the still point of the northern sky.`,
    },
    indigenous: {
      title: 'The Star That Does Not Walk',
      body: `For Indigenous peoples across the northern hemisphere, the North Star was not primarily a navigational tool — it was a cosmological anchor. If all other stars walk in circles through the night, the North Star stands still at the center of everything. It is the star around which the universe rotates. It is the axis of the world.

In Lakota tradition, Polaris is the star at the center of the great circle, with the entire night sky rotating around it. The ability to find north from Polaris was essential for navigation across the plains, but the star's significance went far deeper than practical navigation — it was the pivot of creation.

Among some Inuit peoples, the North Star was the Fixed Star around which all celestial motion occurred. The stars were ancestors, the sky was alive, and Polaris was the eternal still point. In many traditions, the northern celestial pole was the hole in the sky through which souls passed to the afterworld — Polaris marking the entry point.`,
    },
  },
  crux: {
    indigenous: {
      title: 'The Emu in the Sky',
      body: `Western astronomy connects dots of light to draw figures — bears, hunters, scorpions. Aboriginal Australians of many nations developed a parallel tradition of equal sophistication, but inverted: they traced figures in the dark spaces between stars, the dark nebulae and voids in the Milky Way.

The most celebrated of these dark-sky constellations is the Emu in the Sky. Its head is formed by the Coalsack — the dark nebula immediately adjacent to the Southern Cross. Its long neck stretches along the Milky Way. Its body extends across Centaurus and Norma. Its legs reach to Scorpius. Depending on the season, the emu appears in different positions — standing upright, running, or lying down — and each position carries meaning.

When the Emu's head (the Coalsack) is high in the eastern sky after sunset in autumn, it is time to collect emu eggs from nesting females. When the Emu appears to lie on its back in winter, the eggs have hatched and the season has passed. The sky emu is a seasonal calendar, precise enough to coordinate resource management across vast territories.

The Southern Cross — in Western astronomy the primary figure in this part of the sky — is not the main event in this tradition. It is simply the head-feathers of the emu, and the emu's meaning comes not from the bright stars but from the darkness between them.`,
    },
  },
  saturn: {
    babylonian: {
      title: 'Ninurta, Lord of the Black Headed People',
      body: `To the Babylonians of the second millennium BCE, Saturn was the star of Ninurta — one of the most powerful gods in the Mesopotamian pantheon. Ninurta was the god of war, agriculture, hunting, and the south wind. He was the patron of farmers and soldiers simultaneously, embodying both the creative and destructive aspects of civilization.

The Babylonians tracked Saturn's 29.5-year orbit with extraordinary precision, noting that it returned to the same position in the zodiac in almost exactly 29 years. This was the foundation of their seven-day week — each day ruled by one of the seven wandering bodies they could see: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn. Saturday is Saturn's day, a name that has survived intact for 2,500 years from Babylon through Rome to every language that inherited the Latin calendar.

When the Babylonian astronomers watched Saturn's slow progress through the zodiac, they were building the astrological system that would eventually spread across the ancient world. Their belief that the planets influenced human affairs was not superstition by the standards of their knowledge — it was an attempt to find pattern and predictability in a world that offered little of either. Saturn's slow, reliable orbit made it the planet of time, patience, and the long arc of consequence.`,
    },
  },
  betelgeuse: {
    arabic: {
      title: "The Armpit's Long Journey to Your Tongue",
      body: `In Arabic, the star is Ibt al-Jauzah — "armpit of the giant." It is a perfectly sensible description: the star sits at the upper-left shoulder of the figure we call Orion, roughly where a giant's armpit would be. Arab astronomers of the ninth and tenth centuries catalogued thousands of stars by name, and their naming conventions were systematic and often anatomical.

The name entered European astronomy in the twelfth century, when Arabic astronomical texts were translated into Latin in Toledo, Spain. The translator — probably working quickly with unfamiliar Arabic script — misread the letter yā' (ي) as bā' (ب). The Arabic "Ibt" became "Betelgeuse" through that single scribal error, passed from manuscript to manuscript for nine centuries until it became the official name endorsed by the International Astronomical Union.

The star itself is extraordinary. A red supergiant 700 times the diameter of our Sun, it is so large that if placed at our Sun's position, it would engulf Mercury, Venus, Earth, Mars, and extend to the orbit of Jupiter. In 2019 and 2020, it dramatically dimmed, and astronomers worldwide speculated it might be about to explode. It wasn't — the dimming was caused by a vast cloud of dust it had expelled. But the dimming reminded everyone that Betelgeuse is at the end of its life. When it finally explodes as a supernova, it will be visible in daylight for weeks — the most spectacular celestial event since humanity began watching the sky.`,
    },
  },
};

let handCraftedCount = 0;
for (const [objectId, cultures] of Object.entries(HAND_CRAFTED)) {
  for (const [culture, story] of Object.entries(cultures)) {
    insertStory.run(objectId, culture, story.title, story.body);
    handCraftedCount++;
  }
}
console.log(`✓ Inserted ${handCraftedCount} hand-crafted stories (overriding generated)`);

// ── Done ───────────────────────────────────────────────────────────────────

db.close();
const sizeKB = (fs.statSync(OUT).size / 1024).toFixed(0);
const storyCount = db.prepare ? 0 : 0; // closed, just use totals
console.log(`\n✓ Database built: assets/stellartales.db (${sizeKB} KB)`);
console.log(`  Objects: ${ANCHOR_OBJECTS.length}  |  Stories: ${genCount} generated + ${handCraftedCount} hand-crafted overrides`);

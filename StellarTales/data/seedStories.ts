import { CultureKey } from './anchorObjects';

export interface SeedStory {
  title: string;
  body: string;
}

// Full stories seeded into SQLite on first launch.
// These are permanent offline content — no network needed, ever.
// The pre-generation script (scripts/generateStories.js) fills in the rest.
export const SEED_STORIES: Partial<Record<string, Partial<Record<CultureKey, SeedStory>>>> = {
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

Among some Inuit peoples, the North Star was the Fixed Star around which all celestial motion occurred. The stars were ancestors, the sky was alive, and Polaris was the eternal still point. In many traditions, the northern celestial pole was the hole in the sky through which souls passed to the afterworld — Polaris marking the entry point.

What strikes modern observers is that this "still point" slowly changes over millennia. Polaris is only our pole star for a few thousand years — in 3000 BCE, the pole star was Thuban in Draco. In 13,000 CE, it will be Vega. The ancient astronomers who first identified the "unmoving star" were describing a moment in cosmic time that will eventually pass.`,
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

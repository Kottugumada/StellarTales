export type CultureKey = 'greek' | 'arabic' | 'babylonian' | 'chinese' | 'indian' | 'indigenous';
export type ObjectCategory = 'constellation' | 'star' | 'deep_sky' | 'planet';

export interface SkyObject {
  id: string;
  name: string;
  category: ObjectCategory;
  subtitle: string;
  ra: number | null;   // right ascension in hours; null for planets (computed dynamically)
  dec: number | null;  // declination in degrees; null for planets
  magnitude: number | null;
  hemisphere: 'northern' | 'southern' | 'both';
  cultures: CultureKey[];
  hookText: string; // 1-2 sentence teaser shown before full story loads
}

export const ANCHOR_OBJECTS: SkyObject[] = [
  // ── CONSTELLATIONS · NORTHERN ──────────────────────────────────────────────

  { id: 'orion', name: 'Orion', category: 'constellation', subtitle: 'The Hunter',
    ra: 5.58, dec: -5, magnitude: null, hemisphere: 'both',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The greatest hunter in Greek myth, placed in the stars by Zeus. Every star name in this constellation is Arabic — preserved by scholars who kept ancient knowledge alive during Europe's dark ages." },

  { id: 'ursa_major', name: 'Ursa Major', category: 'constellation', subtitle: 'The Great Bear',
    ra: 10.67, dec: 55, magnitude: null, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Callisto, transformed into a bear by Zeus and placed in the stars. The seven brightest stars form the Big Dipper — one of the few star patterns recognized independently by cultures on every inhabited continent." },

  { id: 'ursa_minor', name: 'Ursa Minor', category: 'constellation', subtitle: 'The Little Bear',
    ra: 15.0, dec: 75, magnitude: null, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The Little Bear circles the northern celestial pole. Its tail tip is Polaris — humanity's fixed beacon for navigation across every culture and ocean for five thousand years." },

  { id: 'cassiopeia', name: 'Cassiopeia', category: 'constellation', subtitle: 'The Queen',
    ra: 1.0, dec: 60, magnitude: null, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The vain queen of Ethiopia, placed in the sky as punishment — forever spinning around the pole, sometimes upside down, forever paying for her pride." },

  { id: 'leo', name: 'Leo', category: 'constellation', subtitle: 'The Lion',
    ra: 10.67, dec: 15, magnitude: null, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The Nemean Lion, slain by Hercules as his first labor. Its hide was impervious to weapons — Hercules had to strangle it. Zeus honored its ferocity by placing it among the stars." },

  { id: 'scorpius', name: 'Scorpius', category: 'constellation', subtitle: 'The Scorpion',
    ra: 16.88, dec: -30, magnitude: null, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The scorpion that killed Orion. Zeus placed both in the sky on opposite sides — as Scorpius rises, Orion sets. They have not shared the same sky in four thousand years." },

  { id: 'taurus', name: 'Taurus', category: 'constellation', subtitle: 'The Bull',
    ra: 4.7, dec: 15, magnitude: null, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Zeus in disguise, courting Europa. Home to two of the most famous star clusters in the sky — the Pleiades and the Hyades — and the site of the Crab Nebula, remnant of a supernova witnessed in 1054 CE." },

  { id: 'gemini', name: 'Gemini', category: 'constellation', subtitle: 'The Twins',
    ra: 7.0, dec: 22, magnitude: null, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Castor and Pollux — one mortal, one immortal. When Castor died, Pollux begged Zeus to share his immortality rather than live without his brother. Zeus gave them the sky together." },

  { id: 'cygnus', name: 'Cygnus', category: 'constellation', subtitle: 'The Swan',
    ra: 20.68, dec: 44, magnitude: null, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Zeus as a swan, or perhaps Orpheus transformed after death. The swan flies down the Milky Way. Its brightest star, Deneb, is so luminous its light left the star around 1,500 years ago — before Rome fell." },

  { id: 'perseus', name: 'Perseus', category: 'constellation', subtitle: 'The Hero',
    ra: 3.17, dec: 45, magnitude: null, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Perseus holds the severed head of Medusa — represented by Algol, the Demon Star, which dims every 2.87 days as a dark companion eclipses it. Arab astronomers observed this variability centuries before the telescope." },

  { id: 'bootes', name: 'Boötes', category: 'constellation', subtitle: 'The Herdsman',
    ra: 14.7, dec: 31, magnitude: null, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The Herdsman drives the Great Bear around the pole. His brightest star, Arcturus, is the third-brightest in the night sky — an orange giant 37 light-years away whose light you see tonight left just before you were born." },

  { id: 'hercules', name: 'Hercules', category: 'constellation', subtitle: 'The Hero',
    ra: 17.23, dec: 27, magnitude: null, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The greatest hero of Greek myth contains one of the finest sights in the sky — M13, a ball of 300,000 stars. In 1974 humanity aimed the Arecibo telescope at it and beamed a message that will arrive in 25,000 years." },

  { id: 'lyra', name: 'Lyra', category: 'constellation', subtitle: 'The Lyre',
    ra: 18.85, dec: 36, magnitude: null, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The lyre of Orpheus, whose music could move stones and trees. Its brightest star, Vega, will become the North Star in 13,000 years as Earth's axis slowly wobbles through space." },

  { id: 'aquila', name: 'Aquila', category: 'constellation', subtitle: 'The Eagle',
    ra: 19.67, dec: 3, magnitude: null, hemisphere: 'both',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Zeus's eagle, carrier of thunderbolts. In Chinese astronomy, its bright star Altair is the Cowherd — separated from the Weaver Girl (Vega) by the Silver River of the Milky Way, allowed to meet just once a year." },

  { id: 'andromeda', name: 'Andromeda', category: 'constellation', subtitle: 'The Princess',
    ra: 0.8, dec: 38, magnitude: null, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The princess chained to a rock as sacrifice, rescued by Perseus. Within this constellation lies the Andromeda Galaxy — a faint smudge visible to the naked eye containing a trillion stars, 2.5 million light-years away." },

  // ── CONSTELLATIONS · SOUTHERN ──────────────────────────────────────────────

  { id: 'crux', name: 'Crux', category: 'constellation', subtitle: 'The Southern Cross',
    ra: 12.43, dec: -60, magnitude: null, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The smallest constellation but the most recognized in the southern sky, on five national flags. To Aboriginal Australians, the dark cloud beside it forms the head of the Emu in the Sky — a figure traced in darkness, not stars." },

  { id: 'centaurus', name: 'Centaurus', category: 'constellation', subtitle: 'The Centaur',
    ra: 13.07, dec: -47, magnitude: null, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Chiron, the wise centaur and tutor of heroes. Contains both the nearest star system to our Sun — Alpha Centauri, 4.37 light-years away — and Omega Centauri, the largest globular cluster in our galaxy." },

  { id: 'carina', name: 'Carina', category: 'constellation', subtitle: 'The Keel',
    ra: 8.68, dec: -65, magnitude: null, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The keel of the Argo, Jason's ship that sailed for the Golden Fleece. Contains Canopus, second-brightest star in the night sky, and Eta Carinae — a hypernova candidate, one of the most luminous stars known." },

  { id: 'eridanus', name: 'Eridanus', category: 'constellation', subtitle: 'The River',
    ra: 3.25, dec: -29, magnitude: null, hemisphere: 'both',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The great celestial river stretching from Orion to the southern horizon — where Phaethon fell after crashing the sun-chariot. Its southernmost star, Achernar, means 'end of the river' in Arabic." },

  { id: 'puppis', name: 'Puppis', category: 'constellation', subtitle: 'The Stern',
    ra: 7.83, dec: -35, magnitude: null, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The stern of the Argo — once part of the massive Argo Navis constellation, broken into three by astronomers in 1752. The Milky Way runs through it, making Puppis rich with clusters and nebulae." },

  { id: 'vela', name: 'Vela', category: 'constellation', subtitle: 'The Sails',
    ra: 9.5, dec: -47, magnitude: null, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The sails of the Argo. Contains a pulsar — the collapsed remnant of a star that exploded 11,000 years ago, now spinning 11 times per second, a lighthouse in the wreckage of a stellar death." },

  { id: 'lupus', name: 'Lupus', category: 'constellation', subtitle: 'The Wolf',
    ra: 15.22, dec: -42, magnitude: null, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Near here in 1006 CE blazed the brightest supernova in recorded human history — observed by astronomers in China, Egypt, Iraq, Switzerland, and Japan. Lupus holds the memory of that ancient stellar death." },

  { id: 'piscis_austrinus', name: 'Piscis Austrinus', category: 'constellation', subtitle: 'The Southern Fish',
    ra: 22.28, dec: -30, magnitude: null, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The fish that drinks the water poured by Aquarius. Its only named star is Fomalhaut — but that star has proven to have a dramatic debris disk and one of the most complex directly imaged planetary systems." },

  // ── NAMED STARS · NORTHERN ─────────────────────────────────────────────────

  { id: 'polaris', name: 'Polaris', category: 'star', subtitle: 'The North Star · α Ursae Minoris',
    ra: 2.52, dec: 89.26, magnitude: 1.98, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Humanity's fixed point in a turning sky — virtually every northern culture built navigation, myth, and calendar around this star. In 13,000 years, as Earth's axis wobbles, Vega will take its place." },

  { id: 'betelgeuse', name: 'Betelgeuse', category: 'star', subtitle: 'α Orionis · Red Supergiant',
    ra: 5.92, dec: 7.41, magnitude: 0.5, hemisphere: 'both',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Its name is Arabic for 'armpit of the giant,' corrupted by a medieval scribe misreading the letter I as B. A red supergiant 700 times the size of our Sun — when it explodes, it will outshine the full moon." },

  { id: 'rigel', name: 'Rigel', category: 'star', subtitle: 'β Orionis · Blue Supergiant',
    ra: 5.24, dec: -8.2, magnitude: 0.13, hemisphere: 'both',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Arabic for 'the left leg of the giant.' Rigel is a blue supergiant 120,000 times more luminous than our Sun. Despite being labeled beta, it is usually brighter than Betelgeuse." },

  { id: 'aldebaran', name: 'Aldebaran', category: 'star', subtitle: "α Tauri · The Bull's Eye",
    ra: 4.6, dec: 16.5, magnitude: 0.86, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Arabic for 'the follower' — it follows the Pleiades across the sky. The fiery red eye of Taurus, one of the four Royal Stars of Babylon, used to mark the spring equinox and the beginning of the planting season." },

  { id: 'algol', name: 'Algol', category: 'star', subtitle: 'β Persei · The Demon Star',
    ra: 3.13, dec: 40.96, magnitude: 2.12, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Arabic for 'the demon's head' — the winking eye of Medusa. Arab astronomers noticed centuries ago that it dims every 2.87 days, making it the first eclipsing binary ever recognized, long before the telescope." },

  { id: 'vega', name: 'Vega', category: 'star', subtitle: 'α Lyrae · The Summer Star',
    ra: 18.6, dec: 38.78, magnitude: 0.03, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Arabic for 'the swooping eagle.' Vega was humanity's pole star 14,000 years ago and will be again in 13,000. In Carl Sagan's Contact, it is the origin of the first message from intelligent life." },

  { id: 'deneb', name: 'Deneb', category: 'star', subtitle: "α Cygni · The Swan's Tail",
    ra: 20.68, dec: 45.28, magnitude: 1.25, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Arabic for 'tail of the hen.' Deneb's light left the star around 1,500 years ago — before the fall of Rome was complete. It is one of the most luminous stars in our galaxy, distance still not precisely known." },

  { id: 'altair', name: 'Altair', category: 'star', subtitle: 'α Aquilae · The Flying Eagle',
    ra: 19.83, dec: 8.87, magnitude: 0.77, hemisphere: 'both',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "In Chinese legend, the Cowherd separated from the Weaver Girl (Vega) by the Silver River of the Milky Way. On the seventh night of the seventh month, magpies form a bridge so the lovers can meet — still celebrated as Tanabata in Japan." },

  { id: 'arcturus', name: 'Arcturus', category: 'star', subtitle: 'α Boötis · Guardian of the Bear',
    ra: 14.27, dec: 19.18, magnitude: -0.05, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Greek for 'guardian of the bear' — it chases Ursa Major around the pole. The fourth-brightest star in the sky, its light powered the opening ceremony of the 1933 Chicago World's Fair via photoelectric cell." },

  { id: 'regulus', name: 'Regulus', category: 'star', subtitle: 'α Leonis · The Little King',
    ra: 10.13, dec: 11.97, magnitude: 1.35, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The heart of Leo the Lion. One of the four Royal Stars of Babylon, guarding the sky at a cardinal point. Regulus sits so close to the ecliptic that the Moon occasionally passes in front of it — and rarely, so does Venus." },

  { id: 'antares', name: 'Antares', category: 'star', subtitle: 'α Scorpii · Rival of Mars',
    ra: 16.48, dec: -26.43, magnitude: 1.09, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Greek for 'rival of Mars' — its deep red rivals the planet in color and brightness. A red supergiant so enormous that if placed at our Sun's position, it would engulf everything out to the orbit of Jupiter." },

  { id: 'castor', name: 'Castor', category: 'star', subtitle: 'α Geminorum · The Mortal Twin',
    ra: 7.57, dec: 31.89, magnitude: 1.58, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The mortal of the divine twins. What appears as one star is actually six — three pairs of binary stars locked in a complex gravitational dance, all slowly orbiting each other over thousands of years." },

  { id: 'pollux', name: 'Pollux', category: 'star', subtitle: 'β Geminorum · The Immortal Twin',
    ra: 7.75, dec: 28.03, magnitude: 1.14, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The immortal twin who begged Zeus to share his immortality with his dying mortal brother. Pollux has a confirmed exoplanet — a gas giant orbiting in the habitable zone of this orange giant star." },

  { id: 'spica', name: 'Spica', category: 'star', subtitle: 'α Virginis · The Grain',
    ra: 13.42, dec: -11.16, magnitude: 0.97, hemisphere: 'both',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The ear of grain held by Virgo the harvest goddess. In 127 BCE, the astronomer Hipparchus used Spica to discover the precession of the equinoxes — the 26,000-year wobble of Earth's axis that shifts the entire night sky." },

  // ── NAMED STARS · SOUTHERN ─────────────────────────────────────────────────

  { id: 'alpha_centauri', name: 'Alpha Centauri', category: 'star', subtitle: 'Rigil Kentaurus · Nearest Star System',
    ra: 14.65, dec: -60.83, magnitude: -0.27, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Our nearest stellar neighbor at 4.37 light-years. The light you see tonight left just before the 2020s began. One of its three stars, Proxima Centauri, may host a rocky planet in the habitable zone." },

  { id: 'hadar', name: 'Hadar', category: 'star', subtitle: 'β Centauri · Pointer to the Cross',
    ra: 14.05, dec: -60.37, magnitude: 0.61, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Arabic for 'the ground.' Hadar and Alpha Centauri are the two pointer stars that guide navigators to the Southern Cross. Though adjacent in the sky, Hadar is 100 times farther from us than Alpha Centauri." },

  { id: 'canopus', name: 'Canopus', category: 'star', subtitle: 'α Carinae · Second Brightest Star',
    ra: 6.4, dec: -52.7, magnitude: -0.74, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Named for the navigator of Menelaus's fleet in the Trojan War. So bright and steady that NASA uses Canopus as a navigational reference for spacecraft — it appears in the star trackers of many planetary probes." },

  { id: 'fomalhaut', name: 'Fomalhaut', category: 'star', subtitle: 'α Piscis Austrini · Mouth of the Fish',
    ra: 22.95, dec: -29.62, magnitude: 1.16, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Arabic for 'mouth of the fish.' One of the four Royal Stars of Babylon. One of the first stars with a directly imaged planetary system — a young world dramatically plowing through a vast ring of debris." },

  { id: 'achernar', name: 'Achernar', category: 'star', subtitle: 'α Eridani · End of the River',
    ra: 1.62, dec: -57.24, magnitude: 0.46, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Arabic for 'end of the river' — where Phaethon fell. One of the most oblate stars known: rotating so fast that its equatorial diameter is 56% wider than its poles, giving it a pronounced spinning-top bulge." },

  { id: 'acrux', name: 'Acrux', category: 'star', subtitle: 'α Crucis · Foot of the Cross',
    ra: 12.44, dec: -63.1, magnitude: 0.77, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The brightest star in the Southern Cross, invisible from most of Europe and unknown to Western astronomy until the Age of Exploration. It guided southern navigators the way Polaris guides northern sailors." },

  // ── DEEP SKY OBJECTS ───────────────────────────────────────────────────────

  { id: 'orion_nebula', name: 'Orion Nebula', category: 'deep_sky', subtitle: 'M42 · Stellar Nursery',
    ra: 5.58, dec: -5.39, magnitude: 4.0, hemisphere: 'both',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Visible to the naked eye as a fuzzy patch in Orion's sword, this is one of the most photographed objects in the sky — a vast nursery where new stars and planetary systems are forming, right now, 1,344 light-years away." },

  { id: 'andromeda_galaxy', name: 'Andromeda Galaxy', category: 'deep_sky', subtitle: 'M31 · Our Nearest Galaxy',
    ra: 0.7, dec: 41.27, magnitude: 3.44, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The farthest object visible to the naked eye. Every photon you see left Andromeda 2.5 million years ago — before our species existed. In 4.5 billion years it will collide and merge with our Milky Way." },

  { id: 'pleiades', name: 'Pleiades', category: 'deep_sky', subtitle: 'M45 · The Seven Sisters',
    ra: 3.78, dec: 24.11, magnitude: 1.6, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The Seven Sisters appear in Greek, Aboriginal Australian, Japanese, Norse, and Aztec mythology independently. Their logo is Subaru — six of the seven sisters. The Aboriginal seven-sisters story may be the oldest continuously told narrative in human history." },

  { id: 'hyades', name: 'Hyades', category: 'deep_sky', subtitle: 'Oldest Named Star Cluster',
    ra: 4.45, dec: 15.87, magnitude: 0.5, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The nearest star cluster to Earth and the oldest named in history — Homer mentions them in the Iliad. Half-sisters of the Pleiades, daughters of Atlas who wept for their lost brother Hyas until Zeus placed them in the stars." },

  { id: 'm13', name: 'Hercules Cluster', category: 'deep_sky', subtitle: 'M13 · Great Globular Cluster',
    ra: 16.7, dec: 36.46, magnitude: 5.8, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "A ball of 300,000 stars compressed into 145 light-years of space. In 1974, humanity aimed the Arecibo radio telescope at M13 and transmitted a message encoding our location, biology, and mathematics. It will arrive in 25,000 years." },

  { id: 'm44', name: 'Beehive Cluster', category: 'deep_sky', subtitle: 'M44 · Praesepe',
    ra: 8.67, dec: 19.98, magnitude: 3.7, hemisphere: 'northern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "To ancient Greeks and Romans this fuzzy patch was 'the manger' — Praesepe — with the two nearby stars as donkeys feeding at it. When it was visible but clouded over, Romans took it as a storm warning before battle." },

  { id: 'omega_centauri', name: 'Omega Centauri', category: 'deep_sky', subtitle: 'NGC 5139 · Largest Globular Cluster',
    ra: 13.43, dec: -47.48, magnitude: 3.9, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The largest globular cluster in our galaxy — ten million stars packed into a sphere 150 light-years wide. It may be the stripped core of a dwarf galaxy the Milky Way consumed billions of years ago." },

  { id: 'lmc', name: 'Large Magellanic Cloud', category: 'deep_sky', subtitle: 'Satellite Galaxy',
    ra: 5.38, dec: -69.75, magnitude: 0.9, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "A satellite galaxy visible as a detached piece of the Milky Way. In 1987, a supernova here was the first naked-eye supernova since 1604 — and the first from which neutrinos were detected on Earth." },

  { id: 'smc', name: 'Small Magellanic Cloud', category: 'deep_sky', subtitle: 'Satellite Galaxy',
    ra: 0.87, dec: -72.8, magnitude: 2.7, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Named for Magellan's crew who described them to European audiences in 1519 — though Pacific Islander and Indigenous Australian navigators had known them for thousands of years before any European set sail." },

  { id: 'eta_carinae', name: 'Eta Carinae Nebula', category: 'deep_sky', subtitle: 'NGC 3372 · Hypernova Candidate',
    ra: 10.75, dec: -59.87, magnitude: 4.0, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "One of the most massive stars known — five million times brighter than our Sun — wrapped in the nebula of material it has already ejected. When it explodes, it may be the most spectacular event in all of recorded human history." },

  { id: 'lagoon_nebula', name: 'Lagoon Nebula', category: 'deep_sky', subtitle: 'M8 · Naked-Eye Nebula',
    ra: 18.05, dec: -24.37, magnitude: 6.0, hemisphere: 'southern',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "A glowing cloud where new stars are forming, visible to the naked eye from dark skies as a patch in Sagittarius. The turbulent Hourglass Nebula sits within it, sculpted by the stellar winds of a young, hot star." },

  { id: 'orions_belt', name: "Orion's Belt", category: 'deep_sky', subtitle: 'The Three Kings',
    ra: 5.53, dec: -0.3, magnitude: 1.7, hemisphere: 'both',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Three perfectly aligned stars that have captivated every culture. The Arabs called them Al-Mizan, the scales. Norse mythology made them Frigg's distaff. Medieval Christians called them the Three Kings. The Egyptians aligned the Great Pyramids with them." },

  // ── PLANETS ────────────────────────────────────────────────────────────────

  { id: 'saturn', name: 'Saturn', category: 'planet', subtitle: 'Lord of the Rings',
    ra: null, dec: null, magnitude: null, hemisphere: 'both',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "To the Babylonians, Ninurta — god of war, agriculture, and the south wind. Saturday takes Saturn's name directly from them, via Rome. Its 29.5-year orbit was tracked with astonishing precision 2,500 years ago. Its rings are visible in any small telescope." },

  { id: 'jupiter', name: 'Jupiter', category: 'planet', subtitle: 'King of Planets',
    ra: null, dec: null, magnitude: null, hemisphere: 'both',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "King of the gods in nearly every culture that saw it. Thursday takes its name from Jupiter — Thor's day, the Germanic sky father standing in for Roman Jove. Its four largest moons, discovered by Galileo in 1610, proved Earth is not the center of everything." },

  { id: 'mars', name: 'Mars', category: 'planet', subtitle: 'The Red Wanderer',
    ra: null, dec: null, magnitude: null, hemisphere: 'both',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "Its blood-red color made it the war god in every culture that observed it. Babylonian astronomers tracked its retrograde motion — the mysterious backward loop it traces in the sky — for centuries before anyone understood why." },

  { id: 'venus', name: 'Venus', category: 'planet', subtitle: 'Morning and Evening Star',
    ra: null, dec: null, magnitude: null, hemisphere: 'both',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The brightest natural object in the night sky after the Moon. Ancient astronomers thought the morning and evening apparitions were two different objects. The Babylonians were first to recognize they were one. The Maya built entire temples aligned to Venus." },

  { id: 'mercury', name: 'Mercury', category: 'planet', subtitle: 'The Swift Messenger',
    ra: null, dec: null, magnitude: null, hemisphere: 'both',
    cultures: ['greek', 'arabic', 'babylonian', 'chinese', 'indian', 'indigenous'],
    hookText: "The most elusive of the naked-eye planets — never far from the Sun. Its speed, completing an orbit in 88 days, made it the messenger god in Greece, Rome, and Egypt alike. Copernicus allegedly never saw it in his lifetime." },
];

export const PLANET_IDS = new Set(['saturn', 'jupiter', 'mars', 'venus', 'mercury']);

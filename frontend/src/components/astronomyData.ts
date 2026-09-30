export interface ConstellationPath {
  name: string;
  path: string;
  labelX: number;
  labelY: number;
}

export interface NeighborDeepSky {
  name: string;
  catalog: string;
  type: string;
  x: number;
  y: number;
}

export interface SectorDefinition {
  id: string;
  name: string;
  centerRa: number;
  centerDec: number;
  zoomDefault: number;
  hazeColor: string;
  hazeOpacity: number;
  constellations: ConstellationPath[];
  neighbors: NeighborDeepSky[];
  isPlanetary?: boolean;
}

export interface ObjectAstrophysics {
  distanceLightYears: string;
  distanceParsecs?: string;
  lookbackTime: string;
  scalePhysical: string;
  constellation: string;
  referenceFrame: string;
  summary: string;
  sector: SectorDefinition;
}

// SECTOR 1: ANDROMEDA & LOCAL GROUP
const SECTOR_ANDROMEDA: SectorDefinition = {
  id: "andromeda",
  name: "Andromeda & Triangulum Sector",
  centerRa: 10.68,
  centerDec: 41.27,
  zoomDefault: 1.8,
  hazeColor: "#38bdf8",
  hazeOpacity: 0.12,
  constellations: [
    {
      name: "Andromeda",
      path: "M 320 220 L 440 250 L 560 300 L 680 340 M 440 250 L 460 180 M 560 300 L 590 230",
      labelX: 470,
      labelY: 170,
    },
    {
      name: "Cassiopeia (W-Asterism)",
      path: "M 220 90 L 290 120 L 370 80 L 450 130 L 530 90",
      labelX: 370,
      labelY: 60,
    },
    {
      name: "Triangulum",
      path: "M 530 380 L 620 400 L 580 430 Z",
      labelX: 580,
      labelY: 370,
    },
    {
      name: "Pegasus (Great Square Edge)",
      path: "M 320 220 L 210 270 L 230 390 L 350 360 L 320 220",
      labelX: 270,
      labelY: 310,
    },
  ],
  neighbors: [
    { name: "M32 Dwarf Elliptical", catalog: "NGC 221", type: "cE2", x: 460, y: 270 },
    { name: "M110 Dwarf Spheroidal", catalog: "NGC 205", type: "dE5", x: 410, y: 220 },
    { name: "M33 Triangulum Galaxy", catalog: "NGC 598", type: "Sc", x: 590, y: 410 },
  ],
};

// SECTOR 2: ORION MOLECULAR COMPLEX & NEBULA
const SECTOR_ORION: SectorDefinition = {
  id: "orion",
  name: "Orion Molecular Cloud Complex",
  centerRa: 83.82,
  centerDec: -5.39,
  zoomDefault: 1.9,
  hazeColor: "#f43f5e", // Ionized H-alpha red/pink
  hazeOpacity: 0.22,
  constellations: [
    {
      name: "Orion (The Hunter)",
      path: "M 340 130 L 540 140 L 490 240 L 440 250 L 390 260 L 330 370 M 540 140 L 560 360 M 390 260 L 440 250 L 490 240",
      labelX: 440,
      labelY: 100,
    },
    {
      name: "Taurus (Hyades & Aldebaran)",
      path: "M 200 120 L 250 160 L 220 200 M 250 160 L 310 170",
      labelX: 230,
      labelY: 90,
    },
    {
      name: "Canis Major (Sirius Vector)",
      path: "M 590 410 L 650 440 L 710 460",
      labelX: 650,
      labelY: 390,
    },
  ],
  neighbors: [
    { name: "Trapezium Star Cluster", catalog: "Theta-1 Orionis", type: "O/B Stars", x: 442, y: 254 },
    { name: "De Mairan's Nebula", catalog: "M43", type: "HII", x: 440, y: 238 },
    { name: "Horsehead Nebula", catalog: "Barnard 33", type: "Dark Nebula", x: 495, y: 242 },
    { name: "Flame Nebula", catalog: "NGC 2024", type: "Emission", x: 505, y: 235 },
  ],
};

// SECTOR 3: VIRGO CLUSTER CORE
const SECTOR_VIRGO: SectorDefinition = {
  id: "virgo",
  name: "Virgo Cluster Galaxy Nexus",
  centerRa: 187.71,
  centerDec: 12.39,
  zoomDefault: 1.8,
  hazeColor: "#a855f7", // Deep extragalactic violet
  hazeOpacity: 0.12,
  constellations: [
    {
      name: "Virgo (The Maiden)",
      path: "M 310 200 L 440 250 L 560 300 L 610 380 M 440 250 L 470 160 M 440 250 L 390 320",
      labelX: 470,
      labelY: 140,
    },
    {
      name: "Leo (Sickle Asterism)",
      path: "M 210 110 L 240 140 L 230 170 L 270 190 M 270 190 L 330 180",
      labelX: 250,
      labelY: 80,
    },
    {
      name: "Coma Berenices Cluster",
      path: "M 480 80 L 540 100 L 520 130",
      labelX: 520,
      labelY: 60,
    },
  ],
  neighbors: [
    { name: "M84 Lenticular", catalog: "NGC 4374", type: "S0", x: 405, y: 245 },
    { name: "M86 Giant Lenticular", catalog: "NGC 4406", type: "E3", x: 420, y: 235 },
    { name: "Markarian's Chain Arc", catalog: "VV 18", type: "Galaxy String", x: 450, y: 215 },
    { name: "M89 Elliptical", catalog: "NGC 4552", type: "E0", x: 480, y: 260 },
  ],
};

// SECTOR 4: JUPITER & SOLAR SYSTEM HELIOCENTRIC ORBITAL PLANE
const SECTOR_JUPITER: SectorDefinition = {
  id: "jupiter",
  name: "Solar System Jovian Orbital Plane",
  centerRa: 0,
  centerDec: 0,
  zoomDefault: 1.0,
  hazeColor: "#f59e0b", // Warm amber solar
  hazeOpacity: 0.18,
  isPlanetary: true,
  constellations: [
    {
      name: "Ecliptic Plane (Planetary Invariable Midplane)",
      path: "M 50 250 Q 440 220 830 250",
      labelX: 440,
      labelY: 210,
    },
    {
      name: "Zodiac Constellation Band (Aries • Taurus • Gemini)",
      path: "M 80 180 L 260 210 L 480 230 L 680 240",
      labelX: 260,
      labelY: 170,
    },
  ],
  neighbors: [
    { name: "Sun (1.0 M☉ Primary)", catalog: "Sol", type: "G2V Star", x: 440, y: 250 },
    { name: "Earth (Observer Habitat)", catalog: "3rd Planet", type: "1.00 AU", x: 380, y: 250 },
    { name: "Mars (Red Planet)", catalog: "4th Planet", type: "1.52 AU", x: 330, y: 240 },
    { name: "Main Asteroid Belt", catalog: "Ceres / Vesta", type: "2.77 AU", x: 270, y: 250 },
  ],
};

// SECTOR 5: MILKY WAY GALACTIC CENTER (SAGITTARIUS CORE)
const SECTOR_MILKY_WAY: SectorDefinition = {
  id: "milkyway",
  name: "Milky Way Galactic Center (Sagittarius A*)",
  centerRa: 266.42,
  centerDec: -29.01,
  zoomDefault: 1.8,
  hazeColor: "#fbbf24", // Golden dense star clouds
  hazeOpacity: 0.28,
  constellations: [
    {
      name: "Sagittarius (Teapot Asterism)",
      path: "M 380 220 L 450 200 L 490 240 L 440 290 L 380 220 M 450 200 L 470 160 L 510 190 M 490 240 L 540 230",
      labelX: 460,
      labelY: 140,
    },
    {
      name: "Scorpius (Heart of Antares)",
      path: "M 280 230 L 320 250 L 300 310 L 280 360 L 320 380",
      labelX: 290,
      labelY: 190,
    },
  ],
  neighbors: [
    { name: "Supermassive Black Hole", catalog: "Sgr A*", type: "4.3M M☉", x: 442, y: 252 },
    { name: "Lagoon Nebula", catalog: "M8", type: "HII Emission", x: 405, y: 215 },
    { name: "Trifid Nebula", catalog: "M20", type: "Emission/Reflection", x: 395, y: 195 },
  ],
};

// SECTOR 6: OMEGA CENTAURI / SOUTHERN SKY
const SECTOR_OMEGA_CENTAURI: SectorDefinition = {
  id: "omega_centauri",
  name: "Centaurus & Southern Cross Realm",
  centerRa: 201.7,
  centerDec: -47.47,
  zoomDefault: 1.8,
  hazeColor: "#06b6d4",
  hazeOpacity: 0.15,
  constellations: [
    {
      name: "Centaurus",
      path: "M 320 180 L 440 240 L 540 280 L 590 350 M 440 240 L 470 170",
      labelX: 440,
      labelY: 140,
    },
    {
      name: "Crux (Southern Cross)",
      path: "M 570 290 L 610 340 M 575 320 L 605 310",
      labelX: 620,
      labelY: 280,
    },
  ],
  neighbors: [
    { name: "Centaurus A Radio Galaxy", catalog: "NGC 5128", type: "Starburst/AGN", x: 490, y: 210 },
    { name: "Alpha Centauri System", catalog: "Rigil Kentaurus", type: "Triple Star (4.37 ly)", x: 580, y: 360 },
  ],
};

export const KNOWN_OBJECT_METRICS: Record<string, ObjectAstrophysics> = {
  m31: {
    distanceLightYears: "2.537 Million Light-Years",
    distanceParsecs: "778 kpc",
    lookbackTime: "2,537,000 Years (Pliocene Epoch on Earth)",
    scalePhysical: "220,000 ly diameter (~1 trillion stars)",
    constellation: "Andromeda (Bounded by Cassiopeia & Triangulum)",
    referenceFrame: "Earth (Solar System) → Local Group → M31",
    summary:
      "Nearest major spiral galaxy to the Milky Way. Approaching our galaxy at approximately 110 km/s in a gravitationally bound mutual orbit, accompanied by dwarf satellites M32 and M110.",
    sector: SECTOR_ANDROMEDA,
  },
  m42: {
    distanceLightYears: "1,344 Light-Years",
    distanceParsecs: "412 pc",
    lookbackTime: "1,344 Years (Late Antiquity on Earth)",
    scalePhysical: "24 ly diameter (mass ~2,000 M☉)",
    constellation: "Orion (South of Orion's Belt)",
    referenceFrame: "Earth (Solar System) → Orion-Cygnus Arm",
    summary:
      "Massive ionized H II stellar nursery visible to the naked eye. Illuminated by four high-mass O/B stars of the central Trapezium cluster within the Orion molecular cloud.",
    sector: SECTOR_ORION,
  },
  jupiter: {
    distanceLightYears: "0.000082 Light-Years (43.2 Light-Minutes)",
    distanceParsecs: "4.2 AU (~628 million km from Earth)",
    lookbackTime: "43.2 Minutes (Real-Time Planetary Transit)",
    scalePhysical: "139,820 km equatorial diameter (318 Earth masses)",
    constellation: "Ecliptic Zodiac Band (Constantly moving)",
    referenceFrame: "Earth (3rd Planet) → Sun → Jupiter (5th Planet)",
    summary:
      "The Solar System's largest planet, possessing 95 recognized moons (including Io, Europa, Ganymede, Callisto), intense radiation belts, and the Great Red Spot anticyclone.",
    sector: SECTOR_JUPITER,
  },
  m87: {
    distanceLightYears: "53.5 Million Light-Years",
    distanceParsecs: "16.4 Mpc",
    lookbackTime: "53,500,000 Years (Early Eocene Warm Epoch)",
    scalePhysical: "120,000 ly stellar halo (~12,000 globular clusters)",
    constellation: "Virgo (Core of Virgo Supercluster)",
    referenceFrame: "Earth (Solar System) → Virgo Supercluster Core",
    summary:
      "Supergiant elliptical galaxy dominating the center of the Virgo Cluster. Anchored by a 6.5-billion-solar-mass central black hole featuring a 5,000-light-year relativistic jet.",
    sector: SECTOR_VIRGO,
  },
  ngc5139: {
    distanceLightYears: "15,800 Light-Years",
    distanceParsecs: "4.85 kpc",
    lookbackTime: "15,800 Years (Upper Paleolithic Glacial Maximum)",
    scalePhysical: "150 ly diameter (~10 million stars)",
    constellation: "Centaurus (Southern Celestial Hemisphere)",
    referenceFrame: "Earth (Solar System) → Milky Way Inner Halo",
    summary:
      "The largest and most luminous globular cluster in the Milky Way galaxy, containing multiple stellar populations; hypothesized to be the stripped core of an ancient disrupted dwarf galaxy.",
    sector: SECTOR_OMEGA_CENTAURI,
  },
  "omega centauri": {
    distanceLightYears: "15,800 Light-Years",
    distanceParsecs: "4.85 kpc",
    lookbackTime: "15,800 Years (Upper Paleolithic Glacial Maximum)",
    scalePhysical: "150 ly diameter (~10 million stars)",
    constellation: "Centaurus (Southern Celestial Hemisphere)",
    referenceFrame: "Earth (Solar System) → Milky Way Inner Halo",
    summary:
      "The largest and most luminous globular cluster in the Milky Way galaxy, containing multiple stellar populations; hypothesized to be the stripped core of an ancient disrupted dwarf galaxy.",
    sector: SECTOR_OMEGA_CENTAURI,
  },
  "milky way": {
    distanceLightYears: "26,000 Light-Years to Galactic Center",
    distanceParsecs: "8.0 kpc to Sgr A*",
    lookbackTime: "26,000 Years (Last Glacial Maximum on Earth)",
    scalePhysical: "100,000 ly galactic disk diameter",
    constellation: "Sagittarius (Galactic Core Direction)",
    referenceFrame: "Earth (Solar System) at ~8.2 kpc Galactocentric Radius",
    summary:
      "Barred spiral galaxy hosting the Solar System within the Orion-Cygnus spur. Centered on the supermassive black hole Sagittarius A*, shrouded by dense interstellar dust lanes.",
    sector: SECTOR_MILKY_WAY,
  },
};

export function getObjectAstrophysics(nameOrId?: string | null, classification?: string | null): ObjectAstrophysics {
  if (!nameOrId && !classification) {
    return {
      distanceLightYears: "Awaiting Observation Resolution",
      lookbackTime: "Real-time intake",
      scalePhysical: "Optical Sensor Resolution",
      constellation: "Celestial Sphere",
      referenceFrame: "Earth / Solar System Observer",
      summary: "Stage an astronomical photograph to compute astrometry, distance estimation, and celestial physical scale.",
      sector: SECTOR_ANDROMEDA,
    };
  }

  const query = (nameOrId || "").toLowerCase();

  for (const [key, val] of Object.entries(KNOWN_OBJECT_METRICS)) {
    if (query.includes(key)) {
      return val;
    }
  }

  // Dynamic sectors based on classification
  const classLower = (classification || "").toLowerCase();
  if (classLower.includes("spiral") || classLower.includes("galaxy")) {
    return {
      distanceLightYears: "~10 to ~800 Million Light-Years",
      distanceParsecs: "3 Mpc – 250 Mpc",
      lookbackTime: "~10 - 800 Million Years",
      scalePhysical: "~50,000 to 200,000 ly galactic disk",
      constellation: "Extragalactic Deep-Sky Field",
      referenceFrame: "Earth (Solar System) → Local Supercluster",
      summary: "Extragalactic stellar system comprising billions of stars, interstellar gas, and dark matter halo.",
      sector: SECTOR_ANDROMEDA,
    };
  }

  if (classLower.includes("nebula")) {
    return {
      distanceLightYears: "~1,000 to ~7,000 Light-Years",
      distanceParsecs: "300 pc – 2.1 kpc",
      lookbackTime: "~1,000 - 7,000 Years",
      scalePhysical: "~10 to 50 ly diffuse cloud",
      constellation: "Milky Way Galactic Plane",
      referenceFrame: "Earth (Solar System) → Galactic Arm",
      summary: "Interstellar cloud of ionized hydrogen gas, cosmic dust, and plasma active in stellar birth or post-supernova dissipation.",
      sector: SECTOR_ORION,
    };
  }

  if (classLower.includes("planet") || classLower.includes("solar")) {
    return {
      distanceLightYears: "< 0.001 Light-Years (< 50 Light-Hours)",
      distanceParsecs: "0.2 to 40 Astronomical Units (AU)",
      lookbackTime: "Minutes to Hours (Planetary Transit)",
      scalePhysical: "5,000 to 140,000 km planetary radius",
      constellation: "Ecliptic Zodiac Band",
      referenceFrame: "Earth (3rd Orbit) → Heliocentric System",
      summary: "Solar system celestial body orbiting the Sun along the ecliptic plane, governed by Keplerian planetary mechanics.",
      sector: SECTOR_JUPITER,
    };
  }

  return {
    distanceLightYears: "Deep-Sky Astrometric Target",
    lookbackTime: "Deep Space Epoch",
    scalePhysical: "Astronomical Scale",
    constellation: "Equatorial Coordinate System",
    referenceFrame: "Earth / Solar System (ICRS J2000.0)",
    summary: "Astronomical object observed on the celestial sphere, cross-referenced with CDS SIMBAD astronomical databases.",
    sector: SECTOR_VIRGO,
  };
}

import { Horse, BloodlineMap } from '@/types/horse';

export const BLOODLINE_COLORS: Record<string, string> = {
  "Star Strider": "#000066",
  "Celestial Grass": "#00FF00", 
  "Thunder Blood": "#ffa621",
  "Frostmane": "#00FFFF", 
  "Emberhoof": "#FF0000", 
  "Slothsoul": "#708090",
  "Unknown": "#444444"
};

// Internal registry to mimic your Python 'data_registry'
const geneticsCache = new Map<string, { dna: BloodlineMap, color: string }>();

/**
 * Pure RGB Mixer based on your Python logic
 */
function mixRgbColors(dna: BloodlineMap): string {
  let r = 0, g = 0, b = 0;
  const entries = Object.entries(dna);
  if (entries.length === 0) return BLOODLINE_COLORS["Unknown"];

  entries.forEach(([bloodline, percentage]) => {
    const hex = (BLOODLINE_COLORS[bloodline] || BLOODLINE_COLORS["Unknown"]).replace('#', '');
    const red = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4, 6), 16);

    r += red * percentage;
    g += green * percentage;
    b += blue * percentage;
  });

  const toHex = (c: number) => Math.round(c).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const calculateHorseGenetics = (
  horse: Horse, 
  allHorses: Horse[], 
  depth = 0
): { dna: BloodlineMap, color: string } => {
  // 1. Base cases for recursion
  if (!horse || depth > 25) {
    return { dna: { "Unknown": 1.0 }, color: BLOODLINE_COLORS["Unknown"] };
  }

  // 2. Check Registry (Cache)
  if (geneticsCache.has(horse.id)) {
    return geneticsCache.get(horse.id)!;
  }

  const findHorse = (id?: string) => id ? allHorses.find(h => h.id === id) : null;
  const p1 = findHorse(horse.sireId);
  const p2 = findHorse(horse.damId);

  let dna: BloodlineMap = {};
  let color: string;

  // 3. Founder Logic (Like your Python: if p1 == "" or p2 == "")
  if (!p1 || !p2) {
    let blood = horse.originBlood || "Unknown";
    // Handle the "Void Born" replacement from your Python script
    if (blood === "Void Born") blood = "Celestial Grass";
    
    dna = { [blood]: 1.0 };
    color = BLOODLINE_COLORS[blood] || BLOODLINE_COLORS["Unknown"];
  } 
  // 4. Descendant Logic (Recursive Mix)
  else {
    const res1 = calculateHorseGenetics(p1, allHorses, depth + 1);
    const res2 = calculateHorseGenetics(p2, allHorses, depth + 1);

    const allKeys = new Set([...Object.keys(res1.dna), ...Object.keys(res2.dna)]);
    
    allKeys.forEach(key => {
      const val = ((res1.dna[key] || 0) + (res2.dna[key] || 0)) / 2;
      if (val > 0) dna[key] = val;
    });

    color = mixRgbColors(dna);
  }

  const result = { dna, color };
  geneticsCache.set(horse.id, result);
  return result;
};
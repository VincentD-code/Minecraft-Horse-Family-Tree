import { BloodlineMap } from "@/types/horse";

export const BLOODLINE_COLORS: Record<string, string> = {
  "Star Strider": "#000066",
  "Celestial Grass": "#00FF00", 
  "Thunder Blood": "#ffa621",
  "Frostmane": "#00FFFF", 
  "Emberhoof": "#FF0000", 
  "Slothsoul": "#708090",
  "Unknown": "#444444"
};

export function mergeDna(sireDna: BloodlineMap, damDna: BloodlineMap): BloodlineMap {
  const dna: BloodlineMap = {};
  const allKeys = new Set([...Object.keys(sireDna), ...Object.keys(damDna)]);

  allKeys.forEach((key) => {
    const val = ((sireDna[key] || 0) + (damDna[key] || 0)) / 2;
    if (val > 0) dna[key] = val;
  });

  return dna;
}

export function calculateColorFromDna(dna: BloodlineMap): string {
  let r = 0, g = 0, b = 0;
  const entries = Object.entries(dna);
  
  if (entries.length === 0) return BLOODLINE_COLORS["Unknown"];

  entries.forEach(([bloodline, weight]) => {
    const hex = (BLOODLINE_COLORS[bloodline] || BLOODLINE_COLORS["Unknown"]).replace('#', '');
    r += parseInt(hex.substring(0, 2), 16) * weight;
    g += parseInt(hex.substring(2, 4), 16) * weight;
    b += parseInt(hex.substring(4, 6), 16) * weight;
  });

  const toHex = (c: number) => Math.round(c).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
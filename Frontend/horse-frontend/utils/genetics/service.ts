import { Horse } from "@/types/horse";
import { BLOODLINE_COLORS, calculateColorFromDna, mergeDna } from "./utils";

export function processNewHorseGenetics(
  sire: Horse | undefined, 
  dam: Horse | undefined, 
  originBlood?: string
) {
  if (!sire || !dam) {
    let blood = originBlood || "Unknown";
    if (blood === "Void Born") blood = "Celestial Grass";

    const dna = { [blood]: 1.0 };
    return {
      dna,
      hexColor: BLOODLINE_COLORS[blood] || BLOODLINE_COLORS["Unknown"],
      generation: 0
    };
  }

  const dna = mergeDna(sire.dna, dam.dna);
  const hexColor = calculateColorFromDna(dna);
  const generation = Math.max(sire.generation, dam.generation) + 1;

  return { dna, hexColor, generation };
}
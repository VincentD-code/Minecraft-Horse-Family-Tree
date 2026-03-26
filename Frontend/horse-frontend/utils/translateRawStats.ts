import { Horse } from "@/types/horse";

export interface RawStats {
    speed: number;
    jump: number;
    health: number;
    variant: number;
}

export interface ProcessedStats {
    speed: number;
    jump: number;
    health: number;
    variant: string;
}

function decodeVariant(variantId: number): string {
  const colors: Record<number, string> = {
    0: "White",
    1: "Creamy",
    2: "Chestnut",
    3: "Brown",
    4: "Black",
    5: "Gray",
    6: "Dark Brown",
  };
  const patterns: Record<number, string> = {
    0: "None",
    1: "White Stockings",
    2: "White Field",
    3: "White Dots",
    4: "Black Dots",
  };
  const color = colors[variantId % 256] ?? "Unknown";
  const pattern = patterns[Math.floor(variantId / 256)] ?? "None";
  return `${color} w/ ${pattern}`;
}

export function translateStatsForDisplay(stats: RawStats): ProcessedStats{
    const speed = Math.round(stats.speed * 42.157 * 2) / 2;
    const jump = Math.round(((7.56889 * (Math.E ** (0.602676*stats.jump))) - 8.59434) * 2) / 2
    // jump = (5.42044 * (stats.jump ** (1.61929))) - 0.13636
    const variant = decodeVariant(stats.variant);
    const health = Math.round((stats.health / 2) * 2) / 2;

    return {speed, jump, variant, health}
}
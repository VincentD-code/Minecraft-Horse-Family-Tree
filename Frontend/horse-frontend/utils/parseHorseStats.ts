export interface HorseStats {
  speed: number;
  health: number;
  temper: number;
  jump: number;
  variant: string;
}

function decodeVariant(variantId: number): string {
  const colors: Record<number, string> = {
    0: "White", 1: "Creamy", 2: "Chestnut",
    3: "Brown", 4: "Black", 5: "Gray", 6: "Dark Brown",
  };
  const patterns: Record<number, string> = {
    0: "None", 1: "White Stockings", 2: "White Field",
    3: "White Dots", 4: "Black Dots",
  };
  const color = colors[variantId % 256] ?? "Unknown";
  const pattern = patterns[Math.floor(variantId / 256)] ?? "None";
  return `${color} w/ ${pattern}`;
}

export function parseHorseStats(raw: string): HorseStats | null {
  try {
    const get = (key: string) => {
      const match = raw.match(new RegExp(`${key}:\\s*([\\d.]+)`));
      return match ? parseFloat(match[1]) : null;
    };

    const getAttr = (id: string) => {
      const match = raw.match(new RegExp(`"${id}",\\s*base:\\s*([\\d.]+)`));
      return match ? parseFloat(match[1]) : null;
    };

    const speed   = getAttr("minecraft:generic.movement_speed");
    const health  = get("Health");
    const temper  = get("Temper");
    const jump    = getAttr("minecraft:generic.jump_strength");
    const rawVariant = get("Variant");

    if (speed == null || health == null || temper == null || jump == null || rawVariant == null) {
      return null;
    }

    return {
      speed,
      health,
      temper,
      jump,
      variant: decodeVariant(rawVariant),
    };
  } catch {
    return null;
  }
}
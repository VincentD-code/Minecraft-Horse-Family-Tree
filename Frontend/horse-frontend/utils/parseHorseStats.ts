export interface HorseStats {
  speed: number;
  health: number;
  jump: number;
  variant: number;
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

    const speed = getAttr("minecraft:generic.movement_speed");
    const health = get("Health");
    const jump = getAttr("minecraft:generic.jump_strength");
    const variant = get("Variant");

    if (speed == null || health == null || jump == null || variant == null) {
      return null;
    }

    return {
      speed,
      health,
      jump,
      variant
    };
  } catch {
    return null;
  }
}

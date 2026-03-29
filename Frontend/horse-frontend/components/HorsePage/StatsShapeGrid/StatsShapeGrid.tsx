import { Horse } from "@/types/horse";
import StatShapeCard from "./StatsShapeCard/StatsShapeCard";
import * as styles from "./StatsShapeGrid.css";
import { ProcessedStats } from "@/utils/translateRawStats";

export default function StatsShapeGrid({
  horse,
  processedStats,
  horseColor,
}: {
  horse: Horse;
  processedStats: ProcessedStats;
  horseColor: string;
}) {
  return (
    <div className={styles.statsShapeGrid}>
      <StatShapeCard
        label="Speed"
        value={processedStats.speed?.toFixed(2)}
        unit="bps"
        shapeId="speed"
        horseColor={horseColor}
      />
      <StatShapeCard
        label="Jump"
        value={processedStats.jump?.toFixed(2)}
        unit="blocks"
        shapeId="jump"
        horseColor={horseColor}
      />
      <StatShapeCard
        label="Health"
        value={processedStats.health?.toFixed(2)}
        unit="hearts"
        shapeId="health"
        horseColor={horseColor}
      />
      <StatShapeCard
        label="Generation"
        value={horse.generation}
        subtext="LINEAGE DEPTH"
        shapeId="generation"
        horseColor={horseColor}
      />
    </div>
  );
}

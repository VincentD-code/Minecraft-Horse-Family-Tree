import { Horse } from "@/types/horse";
import * as styles from "./DetailsCard.css";
import { ProcessedStats } from "@/utils/translateRawStats";
import { BloodlineDisplay } from "@/components/HorsePage/DetailsCard/BloodlineDisplay/BloodlineDisplay";
import getHorseByIdAction from "@/actions/getHorseByIdAction";

interface DetailsCardProps {
  horse: Horse;
  processedStats: ProcessedStats;
  parent1Name: string;
  parent2Name: string;
}

export default function DetailsCard({
  horse,
  processedStats,
  parent1Name,
  parent2Name,
}: DetailsCardProps) {
  return (
    <section className={styles.detailsSection}>
      <div className={styles.detailRow}>
        <strong>Appearance Variant</strong>
        <span>{processedStats.variant || "Standard"}</span>
      </div>

      <div className={styles.lineageSection}>
        <h3 className={styles.sectionTitle}>Parentage</h3>
        <div className={styles.parentGrid}>
          <div className={styles.parentBox}>
            <small className={styles.parentLabel}>Parent 1</small>
            <p className={styles.parentName}> {parent1Name}</p>
          </div>
          <div className={styles.parentBox}>
            <small className={styles.parentLabel}>Parent 2</small>
            <p className={styles.parentName}> {parent2Name}</p>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.bloodlineWrapper}>
        <h3 className={styles.sectionTitle}>Genetic Composition</h3>
        <BloodlineDisplay dna={horse.dna} />
      </div>
    </section>
  );
}

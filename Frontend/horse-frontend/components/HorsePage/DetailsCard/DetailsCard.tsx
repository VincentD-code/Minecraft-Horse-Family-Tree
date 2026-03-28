import { Horse } from "@/types/horse";
import * as styles from "./DetailsCard.css";
import { ProcessedStats } from "@/utils/translateRawStats";
import { BloodlineDisplay } from "@/components/HorsePage/DetailsCard/BloodlineDisplay/BloodlineDisplay";

export default function DetailsCard({
  horse,
  processedStats,
}: {
  horse: Horse;
  processedStats: ProcessedStats;
}) {
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
            <p className={styles.parentName}> {horse.sireName || "Unknown"}</p>
          </div>
          <div className={styles.parentBox}>
            <small className={styles.parentLabel}>Parent 2</small>
            <p className={styles.parentName}> {horse.damName || "Unknown"}</p>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.bloodlineWrapper}>
        <h3 className={styles.sectionTitle}>Genetic Composition</h3>
        <BloodlineDisplay bloodlines={horse.bloodlines} />
      </div>
    </section>
  );
}

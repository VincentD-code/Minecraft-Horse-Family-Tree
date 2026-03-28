"use client";
import { Horse } from "@/types/horse";
import { useRouter } from "next/navigation";
import * as styles from "./HorsePage.css";
import { translateStatsForDisplay } from "@/utils/translateRawStats";
import { BloodlineDisplay } from "../BloodlineDisplay/BloodlineDisplay";


export default function HorsePage({ horse }: { horse: Horse }) {
  const router = useRouter();
  const onBackClick = () => {router.back();};
  const horseColor = horse.hexColor || "#1e293b";
  const { jump, health, speed, variant } = horse;
  const processedStats = translateStatsForDisplay({ jump, health, speed, variant });

  return (
    <main className={styles.pageWrapper}>
      <button className={styles.backButton} onClick={onBackClick}>
        ← Back
      </button>

      <header className={styles.header}>
        <h1 
          className={styles.heading} 
          style={{ color: horseColor }}
        >
          {horse.name}
        </h1>
        <span className={horse.status === 0 ? styles.statusDead : styles.statusAlive}>
          {horse.status === 0 ? "Deceased" : "Living"}
        </span>
      </header>

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

      <section className={styles.detailsSection}>
        <div className={styles.detailRow}>
          <strong>Appearance Variant</strong>
          <span>{processedStats.variant|| "Standard"}</span>
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
    </main>
  );
}

function StatShapeCard({ label, value, unit, subtext, shapeId, horseColor }: { label: string; value: any; unit?: string; subtext?: string; shapeId: string; horseColor: string; }) {
  return (
    <div 
      className={styles.shapeCard} 
      data-shape={shapeId}
      style={{ '--shape-color': horseColor } as React.CSSProperties} 
    >
      <div className={styles.shapeTextContainer}>
        <div className={styles.shapeLabel}>{label}</div>
        <div className={styles.shapeValue}>
          {value ?? "N/A"}<small className={styles.shapeUnit}> {unit}</small>
        </div>
        {subtext && <div className={styles.shapeSubtext}>{subtext}</div>}
      </div>
    </div>
  );
}
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

      <div className={styles.statsGrid}>
        <StatCard 
          label="Speed" 
          value={processedStats.speed?.toFixed(2)} 
          unit="bps" 
          subtext="Blocks per second"
        />
        <StatCard 
          label="Jump" 
          value={processedStats.jump?.toFixed(2)} 
          unit="blocks" 
          subtext="Max height"
        />
        <StatCard 
          label="Health" 
          value={processedStats.health?.toFixed(2)} 
          unit="hearts" 
          subtext="Total vitality"
        />
        <StatCard 
          label="Generation" 
          value={horse.generation} 
          subtext="Lineage depth"
        />
      </div>

      <section className={styles.detailsSection}>
        <div className={styles.detailRow}>
          <strong>Appearance</strong>
          <span>{processedStats.variant}</span>
        </div>
        <hr className={styles.divider} />
        <div className={styles.bloodlineWrapper}>
          <h3 className={styles.sectionTitle}>Bloodline Genealogy</h3>
          <BloodlineDisplay bloodlines={horse.bloodlines} />
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, unit, subtext }: { label: string; value: any; unit?: string; subtext?: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.statValue}>
        {value ?? "N/A"} <small className={styles.statUnit}>{unit}</small>
      </div>
      {subtext && <span className={styles.statSubtext}>{subtext}</span>}
    </div>
  );
}

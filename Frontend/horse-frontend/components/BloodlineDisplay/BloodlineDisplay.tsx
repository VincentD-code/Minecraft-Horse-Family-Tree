import { Horse } from "@/types/horse";
import { BLOODLINE_COLORS } from "@/utils/genetics";
import * as styles from '../BloodlineDisplay/BloodlineDisplay.css';

interface BloodlineDisplayProps {
  bloodlines: Horse['bloodlines'];
}

export function BloodlineDisplay({ bloodlines }: BloodlineDisplayProps) {
  if (!bloodlines || Object.keys(bloodlines).length === 0) return null;

  // Sort by percentage descending
  const sorted = Object.entries(bloodlines).sort(([, a], [, b]) => b - a);

  return (
    <div className={styles.bloodlineSection}>
      <h3 className={styles.bloodlineHeading}>Genetic Composition</h3>
      <div className={styles.bloodlineList}>
        {sorted.map(([name, percent]) => {
          const color = BLOODLINE_COLORS[name] || "#94a3b8"; // Fallback to slate
          const percentageValue = (percent * 100).toFixed(1);
          const width = `${percentageValue}%`;

          return (
            <div key={name} className={styles.bloodlineRow}>
              <div className={styles.bloodlineInfo}>
                <span className={styles.bloodlineName}>{name}</span>
                <span className={styles.bloodlinePercent}>{percentageValue}%</span>
              </div>
              <div className={styles.progressTrack}>
                <div 
                  className={styles.progressBar} 
                  style={{ 
                    width, 
                    backgroundColor: color 
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
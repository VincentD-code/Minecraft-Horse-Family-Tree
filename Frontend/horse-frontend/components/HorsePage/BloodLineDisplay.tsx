import { Horse } from "@/types/horse";
import { BLOODLINE_COLORS } from "@/lib/genetics";
import * as styles from './HorsePage.css';

interface BloodlineDisplayProps {
  bloodlines: Horse['bloodlines'];
}

export function BloodlineDisplay({ bloodlines }: BloodlineDisplayProps) {
  // Guard clause if data is missing
  if (!bloodlines || Object.keys(bloodlines).length === 0) return null;

  // Sort by percentage descending
  const sorted = Object.entries(bloodlines).sort(([, a], [, b]) => b - a);

  return (
    <div className={styles.bloodlineSection}>
      <h3 style={{ margin: '20px 0 10px 0' }}>Genetic Composition</h3>
      <div className={styles.bloodlineList}>
        {sorted.map(([name, percent]) => {
          const color = BLOODLINE_COLORS[name] || BLOODLINE_COLORS["Unknown"];
          const width = `${(percent * 100).toFixed(1)}%`;

          return (
            <div key={name} className={styles.bloodlineRow}>
              <div className={styles.bloodlineInfo}>
                <span>{name}</span>
                <span>{width}</span>
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
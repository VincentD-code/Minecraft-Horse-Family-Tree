import * as styles from "./StatsShapeCard.css";

export default function StatShapeCard({ label, value, unit, subtext, shapeId, horseColor }: { label: string; value: any; unit?: string; subtext?: string; shapeId: string; horseColor: string; }) {
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
import { Horse } from "@/types/horse";
import * as styles from "./HorsePageHeader.css";

export default function HorsePageHeader({ horse, horseColor }: { horse: Horse; horseColor: string }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.heading} style={{ color: horseColor }}>
        {horse.name}
      </h1>
      <span
        className={horse.status === 0 ? styles.statusDead : styles.statusAlive}
      >
        {horse.status === 0 ? "Deceased" : "Living"}
      </span>
    </header>
  );
}

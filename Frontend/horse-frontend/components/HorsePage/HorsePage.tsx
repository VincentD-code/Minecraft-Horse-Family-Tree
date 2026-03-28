"use client";
import { Horse } from "@/types/horse";
import { useRouter } from "next/navigation";
import * as styles from "./HorsePage.css";
import { translateStatsForDisplay } from "@/utils/translateRawStats";
import Button from "../Button/Button";
import HorsePageHeader from "./HorsePageHeader/HorsePageHeader";
import StatsShapeGrid from "./StatsShapeGrid/StatsShapeGrid";
import DetailsCard from "./DetailsCard/DetailsCard";
import { useState } from "react";

export default function HorsePage({ horse }: { horse: Horse }) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const onEditClick = () => {
    setEditMode(true);
  }
  const onBackClick = () => {
    router.back();
  };
  const horseColor = horse.hexColor || "#1e293b";
  const { jump, health, speed, variant } = horse;
  const processedStats = translateStatsForDisplay({
    jump,
    health,
    speed,
    variant,
  });

  return (
    <main className={styles.pageWrapper}>
      <Button onClick={onBackClick} text="⬅ Back" />
      <Button onClick={onBackClick} text="Edit" className={styles.editButton} />

      <HorsePageHeader horse={horse} horseColor={horseColor} />

      <StatsShapeGrid
        horse={horse}
        processedStats={processedStats}
        horseColor={horseColor}
      />

      <DetailsCard horse={horse} processedStats={processedStats} />
    </main>
  );
}

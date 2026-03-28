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
import HorseEditModal from "./HorseEditModal/HorseEditModal";

export default function HorsePage({
  horse,
  horses,
}: {
  horse: Horse;
  horses: Horse[];
}) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState<Horse>(horse);
  const onEditClick = () => {
    setEditMode(!editMode);
  };
  const onSubmitChange = () => {};

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
      <Button
        onClick={onBackClick}
        text="⬅ Back"
        className={styles.backButton}
      />

      <Button onClick={onEditClick} text="Edit" className={styles.editButton} />

      <HorseEditModal
        horse={horse}
        horses={horses}
        isOpen={editMode}
        onClose={() => setEditMode(false)}
        onSave={(updatedHorse) => {
          setFormData(updatedHorse);
          setEditMode(false);
        }}
        processedStats={processedStats}
      />

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

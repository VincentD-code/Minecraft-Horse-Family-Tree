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
import HorseEditModal from "./Modals/HorseEditModal/HorseEditModal";
import editHorseAction from "@/actions/editHorseAction";
import HorseDeleteModal from "./Modals/HorseDeleteModal/HorseDeleteModal";
import deleteHorseAction from "@/actions/deleteHorseAction";

export default function HorsePage({
  horse,
  horses,
}: {
  horse: Horse;
  horses: Horse[];
}) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const onEditClick = () => {
    setEditMode(!editMode);
  };

  const onDeleteClick = () => {
    setDeleteMode(true);
  }

  const onBackClick = () => {
    router.back();
  };
  const horseColor = horse.hexColor || "#1e293b";
  const { jump, health, speed, variant } = horse;
  console.log("Raw Stats:", { jump, health, speed, variant });
  const processedStats = translateStatsForDisplay({
    jump,
    health,
    speed,
    variant,
  });
  console.log("Processed Stats:", processedStats);

  const onSaveEdits = (formData: Horse) => {
    editHorseAction(horse, formData);
    setEditMode(false);
  }

  const onDeleteConfirm = () => {
    deleteHorseAction(horse.id);
    router.push("/horses");
  }

  const parent1Name = horse.parentId1 ? horses.find(h => h.id === horse.parentId1)?.name || "Unknown" : "None";
  const parent2Name = horse.parentId2 ? horses.find(h => h.id === horse.parentId2)?.name || "Unknown" : "None";

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.buttonRow}>
      <Button
        onClick={onBackClick}
        text="⬅ Back"
      />

      <div className={styles.buttonRow}>
      <Button onClick={onEditClick} text="Edit" />
      <Button onClick={onDeleteClick} text="Delete" className={styles.deleteButton} />
      </div>
      </div>

      <HorseEditModal
        horse={horse}
        horses={horses}
        isOpen={editMode}
        onClose={() => setEditMode(false)}
        onSave={onSaveEdits}
        processedStats={processedStats}
      />

      <HorseDeleteModal isOpen={deleteMode} onClose={() => setDeleteMode(false)} onConfirm={onDeleteConfirm} />

      <HorsePageHeader horse={horse} horseColor={horseColor} />

      <StatsShapeGrid
        horse={horse}
        processedStats={processedStats}
        horseColor={horseColor}
      />

      <DetailsCard horse={horse} processedStats={processedStats} parent1Name={parent1Name} parent2Name={parent2Name} />
    </main>
  );
}

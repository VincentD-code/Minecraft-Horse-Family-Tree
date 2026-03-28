import { getAllHorses } from "@/lib/horses";
import { Horse } from "@/types/horse";
import { useEffect, useState } from "react";
import Select from "react-select";
import * as styles from "./HorseEditModal.css";
import Button from "@/components/Button/Button";
import {
  ProcessedStats,
  untranslateStat,
  encodeVariant,
} from "@/utils/translateRawStats";

interface HorseEditModalProps {
  horse: Horse;
  horses: Horse[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedHorse: Horse) => void;
  processedStats: ProcessedStats;
}

export default function HorseEditModal({
  horse,
  horses,
  isOpen,
  onClose,
  onSave,
  processedStats,
}: HorseEditModalProps) {
  const [formData, setFormData] = useState({ ...horse });
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  const parentOptions = horses.map((horse) => ({
    value: horse.id.toString(),
    label: horse.name,
  }));

  const statusOptions = [
    { value: "Alive", label: "Alive" },
    { value: "Dead", label: "Dead" },
  ];

  const handleChange = (field: string, value: string | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (field: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: untranslateStat(field, value),
    }));
  };

  const handleVariantChnage = (value: string) => {
    setFormData((prev) => ({ ...prev, variant: encodeVariant(value) }));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Edit {horse.name}</h2>
        <label>Parent 1</label>
        <Select
          options={parentOptions}
          defaultValue={parentOptions.filter((opt) =>
            horse.sireId?.includes(opt.value),
          )}
          onChange={(selected) => handleChange("sireId", selected?.value)}
        />
        <label>Parent 2</label>
        <Select
          options={parentOptions}
          defaultValue={parentOptions.filter((opt) =>
            horse.damId?.includes(opt.value),
          )}
          onChange={(selected) => handleChange("damId", selected?.value)}
        />

        <label>Status</label>
        <Select
          options={statusOptions}
          defaultValue={statusOptions.find((opt) =>
            opt.label === (horse.status === 0 ? "Dead" : "Alive"),
          )}
        />

        <div>
          <div className={styles.statRow}>
            <label>speed</label>
            <input
              value={processedStats.speed.toFixed(2)}
              onChange={(e) =>
                handleStatChange("speed", parseFloat(e.target.value))
              }
            />
          </div>
          <div className={styles.statRow}>
            <label>health</label>
            <input
              value={processedStats.health.toFixed(2)}
              onChange={(e) =>
                handleStatChange("health", parseFloat(e.target.value))
              }
            />
          </div>
          <div className={styles.statRow}>
            <label>jump</label>
            <input
              value={processedStats.jump.toFixed(2)}
              onChange={(e) =>
                handleStatChange("jump", parseFloat(e.target.value))
              }
            />
          </div>
        </div>

        <div className={styles.buttonRow}>
          <Button onClick={onClose} text="Cancel" />
          <Button onClick={() => onSave(formData)} text="Save Changes" />
        </div>
      </div>
    </div>
  );
}

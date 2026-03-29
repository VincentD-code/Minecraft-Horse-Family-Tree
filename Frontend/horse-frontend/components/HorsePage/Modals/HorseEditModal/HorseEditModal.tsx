import { Horse } from "@/types/horse";
import { useState } from "react";
import Select from "react-select";
import * as modalStyles from "../Modals.css";
import * as styles from "./HorseEditModal.css";
import Button from "@/components/Button/Button";
import Switch from "@mui/material/Switch";
import { ProcessedStats, untranslateStat } from "@/utils/translateRawStats";
import { FormControlLabel } from "@mui/material";
import { HorseStats } from "@/utils/parseHorseStats";
import StatsBox from "@/components/StatsBox/StatsBox";

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
  const [rawStatsView, setRawStatsView] = useState(false);

  if (!isOpen) return null;

  const parentOptions = horses.map((horse) => ({
    value: horse.id.toString(),
    label: horse.name,
  }));

  const statusOptions = [
    { value: 1, label: "Alive" },
    { value: 0, label: "Dead" },
  ];

  const handleImportedStats = (newStats: HorseStats) => {
    setFormData((prev) => ({
      ...prev,
      speed: newStats.speed,
      health: newStats.health,
      jump: newStats.jump,
      variant: newStats.variant,
    }));
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (field: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: untranslateStat(field, value),
    }));
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRawStatsView(!event.target.checked);
  };

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.modal}>
        <h2>Edit {horse.name}</h2>
        <label>Parent 1</label>
        <Select
          options={parentOptions}
          isClearable={false}
          defaultValue={parentOptions.find(
            (opt) => opt.value === horse.parentId1,
          )}
          onChange={(selected) => {
            if (selected) {
              handleChange("parentId1", selected.value);
            }
          }}
        />
        <label>Parent 2</label>
        <Select
          options={parentOptions}
          defaultValue={parentOptions.find(
            (opt) => opt.value === horse.parentId2,
          )}
          onChange={(selected) => {
            if (selected) {
              handleChange("parentId2", selected.value);
            }
          }}
        />

        <label>Status</label>
        <Select
          options={statusOptions}
          defaultValue={statusOptions.find(
            (opt) => opt.label === (horse.status === 0 ? "Dead" : "Alive"),
          )}
          onChange={(selected) => {
            if (selected) {
              handleChange("status", selected.value);
            }
          }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={!rawStatsView}
              onChange={handleViewChange}
              size="small"
            />
          }
          label={rawStatsView ? "Raw Stats" : "Processed Stats"}
        />
        {rawStatsView ? (
          <StatsBox onStatsParsed={handleImportedStats} />
        ) : (
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
        )}

        <div className={styles.buttonRow}>
          <Button onClick={onClose} text="Cancel" />
          <Button onClick={() => onSave(formData)} text="Save Changes" />
        </div>
      </div>
    </div>
  );
}

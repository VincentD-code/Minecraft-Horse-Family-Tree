import { Horse } from "@/types/horse";
import { useEffect, useState } from "react";
import Select from "react-select";
import * as modalStyles from "../Modals.css";
import * as styles from "./HorseEditModal.css";
import Button from "@/components/Common/Button/Button";
import Switch from "@/components/Common/Switch/Switch";
import { translateStat, untranslateStat } from "@/utils/translateRawStats";
import { HorseStats } from "@/utils/parseHorseStats";
import StatsBox from "@/components/Common/StatsBox/StatsBox";
import StatRow from "../StatRow/StatRow";
import VariantSelector from "@/components/Common/VariantSelector/VariantSelector";

import * as statRowStyles from "../StatRow/StatRow.css";

interface HorseEditModalProps {
  horse: Horse;
  horses: Horse[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedHorse: Horse) => void;
}

export default function HorseEditModal({
  horse,
  horses,
  isOpen,
  onClose,
  onSave,
}: HorseEditModalProps) {
  const [formData, setFormData] = useState({ ...horse });
  const [rawStatsView, setRawStatsView] = useState(false);
  const [displayStats, setDisplayStats] = useState({
    speed: translateStat("speed", horse.speed).toString(),
    health: translateStat("health", horse.health).toString(),
    jump: translateStat("jump", horse.jump).toString(),
  });

  useEffect(() => {
    setDisplayStats({
      speed: translateStat("speed", formData.speed).toString(),
      health: translateStat("health", formData.health).toString(),
      jump:
        translateStat("jump", formData.jump) < 0
          ? "0"
          : translateStat("jump", formData.jump).toString(),
    });
  }, [formData.speed, formData.health, formData.jump]);

  const handleTextChange = (field: string, textValue: string) => {
    setDisplayStats((prev) => ({ ...prev, [field]: textValue }));

    const numericValue = parseFloat(textValue);
    if (!isNaN(numericValue)) {
      setFormData((prev) => ({
        ...prev,
        [field]: untranslateStat(field, numericValue),
      }));
    }
  };

  if (!isOpen) return null;

  const parentOptions = horses.map((horse) => ({
    value: horse.id.toString(),
    label: horse.name,
  }));

  const onCancel = () => {
    setFormData({ ...horse });
    onClose();
  };

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

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRawStatsView(!event.target.checked);
  };

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.modal}>
        {/* //allow for changing horse name as well, key by _id */}
        <h2>Edit {horse.name}</h2>
        {parentOptions.length > 1 && (
          <>
            <label className={statRowStyles.label}>Parent 1</label>
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
            <label className={statRowStyles.label}>Parent 2</label>
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
          </>
        )}
        <label className={statRowStyles.label}>Status</label>
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

        <VariantSelector 
          selectedVariant={formData.variant} 
          onChange={(v) => handleChange("variant", v)} 
        />

        <div style={{ marginTop: '16px' }}>
          <Switch
            label={rawStatsView ? "Raw Stats" : "Processed Stats"}
            checked={!rawStatsView}
            onChange={(checked) => setRawStatsView(!checked)}
            labelLeft={false}
          />
        </div>
        {rawStatsView ? (
          <StatsBox onStatsParsed={handleImportedStats} />
        ) : (
          <>
            <StatRow
              text="Speed"
              fieldName="speed"
              displayStats={displayStats}
              handleTextChange={handleTextChange}
            />
            <StatRow
              text="Health"
              fieldName="health"
              displayStats={displayStats}
              handleTextChange={handleTextChange}
            />
            <StatRow
              text="Jump"
              fieldName="jump"
              displayStats={displayStats}
              handleTextChange={handleTextChange}
            />
          </>
        )}
        <div className={styles.buttonRow}>
          <Button onClick={onCancel} text="Cancel" />
          <Button onClick={() => onSave(formData)} text="Save Changes" />
        </div>
      </div>
    </div>
  );
}

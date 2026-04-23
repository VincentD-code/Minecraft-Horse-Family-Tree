"use client";
import { Horse } from "@/types/horse";
import { HorseStats } from "@/utils/parseHorseStats";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Select from "react-select";
import * as styles from "./CreateHorseForm.css";
import StatsBox from "@/components/Common/StatsBox/StatsBox";
import Switch from "@/components/Common/Switch/Switch";
import { translateStat, untranslateStat } from "@/utils/translateRawStats";
import StatRow from "../../StatRow/StatRow";
import { createHorseData } from "../HorseCreateModal";
import VariantSelector from "@/components/Common/VariantSelector/VariantSelector";

export interface CreateHorseFormProps {
  horses: Horse[];
  setError: (val: boolean) => void;
  formData: createHorseData;
  setFormData: Dispatch<SetStateAction<createHorseData>>;
}

export default function CreateHorseForm({
  horses,
  formData,
  setFormData,
}: CreateHorseFormProps) {
  const [statsView, setStatsView] = useState(false);
  const [displayStats, setDisplayStats] = useState({
    speed: translateStat("speed", formData.speed).toString(),
    health: translateStat("health", formData.health).toString(),
    jump: translateStat("jump", formData.jump).toString(),
  });

  const handleSelectChange = (
    field: keyof createHorseData,
    value: string | number | undefined,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value ?? "",
    }));
  };

  const handleImportedStats = (newStats: HorseStats) => {
    setFormData((prev) => ({
      ...prev,
      speed: newStats.speed,
      health: newStats.health,
      jump: newStats.jump,
      variant: newStats.variant,
    }));
  };

  useEffect(() => {
    setDisplayStats({
      speed: (statsView ? formData.speed : translateStat("speed", formData.speed)).toString(),
      health: (statsView ? formData.health : translateStat("health", formData.health)).toString(),
      jump: (statsView ? formData.jump : translateStat("jump", formData.jump)).toString(),
    });
  }, [formData.speed, formData.health, formData.jump, statsView]);

  const handleTextChange = (
    field: string,
    textValue: string,
  ) => {
    setDisplayStats((prev) => ({ ...prev, [field]: textValue }));

    const numericValue = parseFloat(textValue);
    if (!isNaN(numericValue)) {
      setFormData((prev) => ({
        ...prev,
        [field]: statsView ? numericValue : untranslateStat(field, numericValue),
      }));
    }
  };

  const parentOptions = horses.map((horse) => ({
    value: horse.id.toString(),
    label: horse.name,
  }));
  const statusOptions = [
    { value: 1, label: "Alive" },
    { value: 0, label: "Dead" },
  ];

  return (
    <div className={styles.container}>
      <form>
        <div className={styles.fields}>
          <div className={styles.nameRow}>
            <label className={styles.label}>Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData((prev: createHorseData) => ({...prev, name: e.target.value}))}
              placeholder="Name"
              className={styles.nameField}
            />
          </div>

          {statsView && <StatsBox onStatsParsed={handleImportedStats} />}

          {parentOptions.length > 1 && (
            <>
              <Select
                options={parentOptions}
                placeholder="Parent 1"
                value={parentOptions.find(o => o.value === formData.parentId1)}
                onChange={(val) => handleSelectChange("parentId1", val?.value)}
                className={styles.field}
                menuPortalTarget={null}
              />
              <Select
                options={parentOptions}
                placeholder="Parent 2"
                value={parentOptions.find(o => o.value === formData.parentId2)}
                onChange={(val) => handleSelectChange("parentId2", val?.value)}
                className={styles.field}
                menuPortalTarget={null}
              />
            </>
          )}

          <Select
            options={statusOptions}
            placeholder="Status"
            value={statusOptions.find(o => o.value === formData.status)}
            onChange={(val) => handleSelectChange("status", val?.value)}
            className={styles.field}
            menuPortalTarget={null}
          />

          <VariantSelector 
            selectedVariant={formData.variant} 
            onChange={(v) => handleSelectChange("variant", v)} 
          />

          <div style={{ marginTop: '16px' }}>
            <Switch
              label={statsView ? "Raw Stats" : "Processed Stats"}
              checked={!statsView}
              onChange={(checked) => setStatsView(!checked)}
              labelLeft={false}
            />
          </div>

          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
          </div>
        </div>
      </form>
    </div>
  );
}

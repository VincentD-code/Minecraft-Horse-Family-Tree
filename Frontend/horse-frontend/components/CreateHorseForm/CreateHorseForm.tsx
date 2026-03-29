"use client";
import createHorseAction from "@/actions/createHorseAction";
import { Horse } from "@/types/horse";
import { HorseStats, parseHorseStats } from "@/utils/parseHorseStats";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Select from "react-select";
import * as styles from "./CreateHorseForm.css";
import StatsBox from "../StatsBox/StatsBox";
export interface CreateHorseFormProps {
  horses: Horse[];
}

export default function CreateHorseForm({ horses }: CreateHorseFormProps) {
  const [stats, setStats] = useState<HorseStats | null>(null);
  const [error, setError] = useState(false);
  const router = useRouter();

  const onBack = () => {
    router.back();
  };

  const handleImportedStats = (newStats: HorseStats) => {
    setStats((prev) => ({
      ...prev,
      speed: newStats.speed,
      health: newStats.health,
      jump: newStats.jump,
      variant: newStats.variant,
    }));
  };
  
  const parentOptions = horses.map((horse) => ({
    value: horse.id.toString(),
    label: horse.name,
  }));
  const statusOptions = [
    { value: "Alive", label: "Alive" },
    { value: "Dead", label: "Dead" },
  ];

  return (
    <>
    <button onClick={onBack}>Back</button>
      <form action={createHorseAction} className={styles.container}>
        <div className={styles.row}>
          <input name="name" placeholder="Name" className={styles.field} />
          <Select
            options={parentOptions}
            placeholder="Parent 1"
            name="sireId"
            className={styles.field}
          />
          <Select
            options={parentOptions}
            placeholder="Parent 2"
            name="damId"
            className={styles.field}
          />
          <Select
            options={statusOptions}
            placeholder="Status"
            name="status"
            className={styles.field}
          />
        </div>

        <StatsBox onStatsParsed={handleImportedStats} />

        {/* Hidden fields populated from parsed stats */}
        <input type="hidden" name="speed" value={stats?.speed ?? ""} />
        <input type="hidden" name="health" value={stats?.health ?? ""} />
        <input type="hidden" name="jump" value={stats?.jump ?? ""} />
        <input type="hidden" name="variant" value={stats?.variant ?? ""} />

        <button type="submit" disabled={!stats}>
          Create
        </button>
      </form>
    </>
  );
}

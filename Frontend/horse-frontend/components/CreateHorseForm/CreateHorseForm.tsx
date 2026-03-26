"use client";
import createHorseAction from "@/actions/createHorseAction";
import { Horse } from "@/types/horse";
import { HorseStats, parseHorseStats } from "@/utils/parseHorseStats";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Select from "react-select";
import * as styles from "./CreateHorseForm.css";
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
  const handleStatsPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const parsed = parseHorseStats(e.target.value);
    setStats(parsed);
    setError(!parsed && e.target.value.length > 0);
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

        <textarea
          placeholder="Paste /summon stats here..."
          onChange={handleStatsPaste}
          rows={4}
        />
        {error && (
          <p>Could not parse stats — is this a valid /summon command?</p>
        )}

        {/* Hidden fields populated from parsed stats */}
        <input type="hidden" name="speed" value={stats?.speed ?? ""} />
        <input type="hidden" name="health" value={stats?.health ?? ""} />
        <input type="hidden" name="jump" value={stats?.jump ?? ""} />
        <input type="hidden" name="variant" value={stats?.variant ?? ""} />

        {stats && (
          <ul>
            <li>Speed: {stats.speed}</li>
            <li>Health: {stats.health}</li>
            <li>Jump: {stats.jump}</li>
            <li>Variant: {stats.variant}</li>
          </ul>
        )}

        <button type="submit" disabled={!stats}>
          Create
        </button>
      </form>
    </>
  );
}

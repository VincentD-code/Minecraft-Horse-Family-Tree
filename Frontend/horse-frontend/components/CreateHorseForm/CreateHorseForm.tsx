"use client"
import createHorseAction from "@/actions/createHorseAction";
import { HorseStats, parseHorseStats } from "@/utils/parseHorseStats";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateHorseForm() {
    const [stats, setStats] = useState<HorseStats | null>(null);
    const [error, setError] = useState(false);
    const router = useRouter();

    const onBack = () => {
        router.back()
    }
    const handleStatsPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const parsed = parseHorseStats(e.target.value);
    setStats(parsed);
    setError(!parsed && e.target.value.length > 0);
  };

  return (
    <>
    <form action={createHorseAction}>
      <input name="name" placeholder="Name" />
      <input name="sireId" placeholder="Sire ID" />
      <input name="damId" placeholder="Dam ID" />
      <select name="status">
        <option value="Alive">Alive</option>
        <option value="Dead">Dead</option>
      </select>

      <textarea
        placeholder="Paste /summon stats here..."
        onChange={handleStatsPaste}
        rows={4}
      />
      {error && <p>Could not parse stats — is this a valid /summon command?</p>}

      {/* Hidden fields populated from parsed stats */}
      <input type="hidden" name="speed"   value={stats?.speed   ?? ""} />
      <input type="hidden" name="health"  value={stats?.health  ?? ""} />
      <input type="hidden" name="temper"  value={stats?.temper  ?? ""} />
      <input type="hidden" name="jump"    value={stats?.jump    ?? ""} />
      <input type="hidden" name="variant" value={stats?.variant ?? ""} />

      {stats && (
        <ul>
          <li>Speed: {stats.speed}</li>
          <li>Health: {stats.health}</li>
          <li>Temper: {stats.temper}</li>
          <li>Jump: {stats.jump}</li>
          <li>Variant: {stats.variant}</li>
        </ul>
      )}

      <button type="submit" disabled={!stats}>Create</button>
    </form>
    <button onClick={onBack}>Back</button>
    </>
  );
}

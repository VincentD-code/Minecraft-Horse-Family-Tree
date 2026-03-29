import { HorseStats, parseHorseStats } from "@/utils/parseHorseStats";
import { useState } from "react";

interface StatsBoxProps {
    onStatsParsed: (stats: HorseStats) => void;
}

export default function StatsBox({ onStatsParsed }: StatsBoxProps){
    const [localStats, setLocalStats] = useState<HorseStats | null>(null);
    const [error, setError] = useState(false);
    const handleStatsPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const parsed = parseHorseStats(e.target.value);

        if (parsed) {
            setLocalStats(parsed);
            onStatsParsed(parsed);
            setError(false);
        } else {
            setError(e.target.value.length > 0);
        }
      };
      
    return(
        <>
            <textarea
              placeholder="Paste /summon stats here..."
              onChange={handleStatsPaste}
              rows={4}
            />
            {error && (
              <p>Could not parse stats — is this a valid /summon command?</p>
            )}

            {localStats && (
              <ul>
                <li>Speed: {localStats.speed}</li>
                <li>Health: {localStats.health}</li>
                <li>Jump: {localStats.jump}</li>
                <li>Variant: {localStats.variant}</li>
              </ul>
            )}
          </>
    )
}
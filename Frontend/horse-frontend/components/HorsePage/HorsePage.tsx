"use client"
import { Horse } from "@/types/horse";
import { useRouter } from "next/navigation";
import * as styles from './HorsePage.css';
import { translateStatsForDisplay } from "@/utils/translateRawStats";

export default function HorsePage({ horse }: {horse: Horse}){
    const router = useRouter();
    const onBackClick = () => {
        router.back()
    }

    const {jump, health, speed, variant} = horse;
    const processedStats = translateStatsForDisplay({jump, health, speed, variant})

    return(
        <main>
            <button className={styles.backButton} onClick={onBackClick}>Back</button>
            <h1 className={styles.heading}>{horse.name}</h1>
            <div className={styles.container}>
                <p><strong>Status:</strong> {horse.status === 0 ? "Dead" : "Alive"}</p>
                <p><strong>Speed:</strong> {processedStats.speed ? processedStats.speed.toFixed(2) : 'N/A'} [blocks per second]</p>
                <p><strong>Jump:</strong> {processedStats.jump ? processedStats.jump.toFixed(2) : 'N/A'} [blocks]</p>
                <p><strong>Health:</strong> {processedStats.health ? processedStats.health.toFixed(2) : 'N/A'} [hearts]</p>
                <p><strong>Variant:</strong> {processedStats.variant}</p>
            </div>
        </main>
    )
}
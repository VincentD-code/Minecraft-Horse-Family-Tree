"use client"
import { Horse } from "@/types/horse";
import { useRouter } from "next/navigation";
import * as styles from './HorsePage.css';

export default function HorsePage({ horse }: {horse: Horse}){
    const router = useRouter();
    const onBackClick = () => {
        router.back()
    }

    return(
        <main>
            <button className={styles.backButton} onClick={onBackClick}>Back</button>
            <h1 className={styles.heading}>{horse.name}</h1>
            <div className={styles.container}>
                <p><strong>Status:</strong> {horse.status === 0 ? "Dead" : "Alive"}</p>
                <p><strong>Speed:</strong> {horse.speed || 'N/A'}</p>
                <p><strong>Jump:</strong> {horse.jump || 'N/A'}</p>
                <p><strong>Health:</strong> {horse.health || 'N/A'}</p>
            </div>
        </main>
    )
}
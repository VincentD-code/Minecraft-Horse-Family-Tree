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
                <section>
                    <h3>Statistics</h3>
                    <p><strong>Status:</strong> {horse.status === 0 ? "Dead" : "Alive"}</p>
                    <p><strong>Speed:</strong> {horse.speed_raw || 'N/A'}</p>
                    <p><strong>Jump:</strong> {horse.jump_raw || 'N/A'}</p>
                    <p><strong>Health:</strong> {horse.health || 'N/A'}</p>
                    <p><strong>Variant ID:</strong> {horse.variant_id || 'N/A'}</p>
                </section>

                <section>
                    <h3>Lineage</h3>
                    <p><strong>Sire (Parent 1):</strong> {horse.sireName || 'Wild'}</p>
                    <p><strong>Dam (Parent 2):</strong> {horse.damName || 'Wild'}</p>
                </section>
            </div>
        </main>
    )
}
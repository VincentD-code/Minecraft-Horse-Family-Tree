import clientPromise from './mongodb';

import { Horse } from '@/types/horse';

export async function getAllHorses(): Promise<Horse[]>{
    try {
        const db_name = process.env.DB_NAME;
        const collection_name = process.env.COLLECTION_NAME;
        if (!db_name || !collection_name){
            return []
        }

        const client = await clientPromise;
        const db = client.db(db_name);

        const data = await db
            .collection(collection_name)
            .find({})
            .toArray();

        // We map the Mongo documents to your existing Horse interface
        return data.map((row: any) => ({
            id: String(row._id).trim(),
            name: row.name || row.name,
            sireId: row['parent_id_1'] || row.sireId,
            damId: row['parent_id_2'] || row.damId,
            sireName: row.parent_1 || row.sireName,
            damName: row.parent_2 || row.damName,
            status: row.status === "Dead" ? 0 : 1,
            speed_raw: row.speed_raw ? parseFloat(row.speed_raw) : undefined,
            jump_raw: row.jump_raw ? parseFloat(row.jump_raw) : undefined,
            health: row.health ? parseFloat(row.health) : undefined,
            variant_id: row.variant_id
        }));
    } catch (error) {
        console.error("Database error:", error);
        return [];
    }
}

export async function getHorseById(id: string): Promise<Horse | undefined>{
    const horses = getAllHorses();
    const horse = (await horses).find(h => h.id === id);

    return horse;
}
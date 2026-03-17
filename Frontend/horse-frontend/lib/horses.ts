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
            name: row.Name || row.name,
            sireId: row['parent id 1'] || row.sireId,
            damId: row['parent id 2'] || row.damId,
            sireName: row.Parent1 || row.sireName,
            damName: row.Parent2 || row.damName,
            status: row.Status === "Dead" ? 0 : 1,
            speed: row.Speed ? parseFloat(row.Speed) : undefined,
            jump: row.Jump ? parseFloat(row.Jump) : undefined,
            health: row.Health ? parseFloat(row.Health) : undefined,
            appearance: row.Appearance
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
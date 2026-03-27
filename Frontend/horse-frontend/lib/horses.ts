import { InsertOneResult } from 'mongodb';
import clientPromise from './mongodb';
import { createHorseRequest, Horse } from '@/types/horse';
import { calculateHorseGenetics } from '@/lib/genetics';

export async function getAllHorses(): Promise<Horse[]> {
    try {
        const db_name = process.env.DB_NAME;
        const collection_name = process.env.COLLECTION_NAME;
        
        if (!db_name || !collection_name) {
            console.error("Missing DB environment variables");
            return [];
        }

        const client = await clientPromise;
        const db = client.db(db_name);

        const data = await db
            .collection(collection_name)
            .find({})
            .toArray();

        const horseList: Horse[] = data.map((row: any) => ({
            id: String(row._id).trim(),
            name: row.name || "Unknown",
            sireId: row.parentId1 || row.sireId || null,
            damId: row.parentId2 || row.damId || null,
            sireName: row.parent1 || row.sireName || "Unknown",
            damName: row.parent2 || row.damName || "Unknown",
            status: row.status === "Dead" ? 0 : 1,
            speed: parseFloat(row.speedRaw) || 0,
            jump: parseFloat(row.jumpRaw) || 0,
            health: parseFloat(row.health) || 0,
            variant: parseFloat(row.variantId) || 0,
            generation: 0, 
            originBlood: row.originBlood || row.bloodline || row.Bloodline || "Unknown",
        }));

        const horseMap = new Map(horseList.map(h => [h.id, h]));
        const generationCache = new Map<string, number>();


        function calculateGeneration(id: string): number {

            if (generationCache.has(id)) return generationCache.get(id)!;

            const horse = horseMap.get(id);
            
            if (!horse || (!horse.sireId && !horse.damId)) {
                generationCache.set(id, 0);
                return 0;
            }
            
            let sireGen = -1
            let damGen = -1

            if (horse.sireId && horseMap.has(horse.sireId)) {
                sireGen = calculateGeneration(horse.sireId);
            } else if (horse.sireId) {
                sireGen = 0;
            }

            if (horse.damId && horseMap.has(horse.damId)) {
                damGen = calculateGeneration(horse.damId);
            } else if (horse.damId) {
                damGen = 0;
            }
            
            const currentGen = Math.max(sireGen, damGen) + 1;
            
            generationCache.set(id, currentGen);
            return currentGen;
        }

        return horseList.map(horse => {
            const gen = calculateGeneration(horse.id);
            const genetics = calculateHorseGenetics(horse, horseList);

            return {
                ...horse,
                generation: gen,
                bloodlines: genetics.dna,
                hexColor: genetics.color
            };
        });

    } catch (error) {
        console.error("Database error:", error);
        return [];
    }
}

export async function getHorseById(id: string): Promise<Horse | undefined> {
    const horses = await getAllHorses();
    return horses.find(h => h.id === id);
}

export async function createHorse(request: createHorseRequest): Promise<string | undefined> {
    try {
        const db_name = process.env.DB_NAME;
        const collection_name = process.env.COLLECTION_NAME;
        if (!db_name || !collection_name) return;

        const client = await clientPromise;
        const db = client.db(db_name);

        const response = await db.collection(collection_name).insertOne(request);
        if (!response.acknowledged) {
            console.error("Error writing to db");
            return;
        }
        return response.insertedId.toString();
    } catch (error) {
        console.error("Error creating horse", error);
        return;
    }
}
import { MongoClient } from 'mongodb';
import { mergeDna, calculateColorFromDna, BLOODLINE_COLORS } from "./genetics/utils"
import { BloodlineMap } from '@/types/horse';

// Your existing logic refactored for the migration
const cache = new Map<string, any>();

export async function runMigration() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db(process.env.DB_NAME);
  const horsesCollection = db.collection('horse-collection');

  // 1. Pull all horses into memory for fast lookup
  const allHorses = await horsesCollection.find({}).toArray();
  const horseMap = new Map(allHorses.map(h => [h._id.toString(), h]));

  console.log(`Starting migration for ${allHorses.length} horses...`);

  const bulkOps: any[] = [];

  interface spec {
    dna: BloodlineMap;
    hexColor: string;
    generation: number;
  }

  // 2. The Recursive Function
  function getGenetics(horseId: string) : spec | null {
    if (cache.has(horseId)) return cache.get(horseId);

    const horse = horseMap.get(horseId);
    if (!horse) return null;

    let result;

    // Founder Case: No parents
    if (!horse.parentId1 && !horse.parentId2) {
      let blood = horse.originBlood || "Unknown";
      if (blood === "Void Born") blood = "Celestial Grass";
      
      const dna = { [blood]: 1.0 };
      result = {
        dna,
        hexColor: BLOODLINE_COLORS[blood] || "#444444",
        generation: 0
      };
    } 
    // Descendant Case
    else {
      const sireStats = horse.parentId1 ? getGenetics(horse.parentId1) : null;
      const damStats = horse.parentId2 ? getGenetics(horse.parentId2) : null;

      // Use the helpers we wrote earlier
      const dna = mergeDna(
        sireStats?.dna || { "Unknown": 1.0 }, 
        damStats?.dna || { "Unknown": 1.0 }
      );
      
      result = {
        dna,
        hexColor: calculateColorFromDna(dna),
        generation: Math.max(sireStats?.generation || 0, damStats?.generation || 0) + 1
      };
    }

    cache.set(horseId, result);
    return result;
  }

  // 3. Process every horse
  allHorses.forEach(horse => {
    const calculated = getGenetics(horse._id.toString());
    
    bulkOps.push({
      updateOne: {
        filter: { _id: horse._id },
        update: { 
          $set: { 
            dna: calculated?.dna,
            hexColor: calculated?.hexColor,
            generation: calculated?.generation 
          } 
        }
      }
    });
  });

  // 4. Execute Bulk Update
  if (bulkOps.length > 0) {
    const result = await horsesCollection.bulkWrite(bulkOps);
    console.log(`Updated ${result.modifiedCount} horses.`);
  }

  await client.close();
  console.log("Migration complete!");
}

runMigration().catch(console.error);
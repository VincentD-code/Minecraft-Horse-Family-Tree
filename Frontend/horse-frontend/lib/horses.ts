import { Collection, Document, ObjectId, WithId } from "mongodb";
import clientPromise from "./mongodb";
import { createHorseRequest, editHorseRequest, Horse } from "@/types/horse";
import { unstable_noStore as noStore } from "next/cache";

export async function getRecentHorses(limit: number = 10): Promise<Horse[]> {
  noStore();
  try {
    const horses = await getCollection();
    const data = await horses.find({}).sort({ _id: -1 }).limit(limit).toArray();

    return data.map((row: WithId<Document>) => ({
      id: String(row._id).trim(),
      name: row.name || "Unknown",
      parentId1: row.parentId1 || null,
      parentId2: row.parentId2 || null,
      status: row.status,
      speed: parseFloat(row.speed) || 0,
      jump: parseFloat(row.jump) || 0,
      health: parseFloat(row.health) || 0,
      variant: parseFloat(row.variantId) || 0,
      generation: parseFloat(row.generation) || 0,
      hexColor: row.hexColor || "#000000",
      dna: row.dna || {},
    }));
  } catch (error) {
    console.error("Error fetching recent horses:", error);
    return [];
  }
}

export async function getAllHorses(): Promise<Horse[]> {
  noStore();
  try {
    const horses = await getCollection();

    const data = await horses.find({}).toArray();

    const horseList: Horse[] = data.map((row: WithId<Document>) => ({
      id: String(row._id).trim(),
      name: row.name || "Unknown",
      parentId1: row.parentId1 || null,
      parentId2: row.parentId2 || null,
      status: row.status,
      speed: parseFloat(row.speed) || 0,
      jump: parseFloat(row.jump) || 0,
      health: parseFloat(row.health) || 0,
      variant: parseFloat(row.variantId) || 0,
      generation: parseFloat(row.generation) || 0,
      hexColor: row.hexColor || "#000000",
      dna: row.dna || {},
    }));

    return horseList;
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}

export async function getHorseById(id: string): Promise<Horse | undefined> {
  noStore();
  try {
    const horses = await getCollection();

    const response = await horses.findOne({ _id: new ObjectId(id) });
    if (!response) {
      console.error("Horse not found with ID:", id);
      return;
    }

    const horse: Horse = {
      id: String(response._id).trim(),
      name: response.name || "Unknown",
      parentId1: response.parentId1 || null,
      parentId2: response.parentId2 || null,
      status: response.status,
      speed: parseFloat(response.speed) || 0,
      jump: parseFloat(response.jump) || 0,
      health: parseFloat(response.health) || 0,
      variant: parseFloat(response.variantId) || 0,
      generation: parseFloat(response.generation) || 0,
      dna: response.dna || {},
      hexColor: response.hexColor || "#000000",
    };

    return horse;
  } catch (error) {
    console.error("Error fetching horse by ID", error);
    return;
  }
}

export async function createHorse(
  request: createHorseRequest,
): Promise<string | undefined> {
  noStore();
  try {
    const horses = await getCollection();

    const response = await horses.insertOne(request);
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

export async function editHorse(
  id: string,
  request: editHorseRequest,
): Promise<string | undefined> {
  noStore();
  try {
    const horses = await getCollection();

    const filter = { _id: new ObjectId(id) };
    const update = { $set: request };

    const result = await horses.updateOne(filter, update, { upsert: false });
    return result.modifiedCount > 0 ? id : undefined;
  } catch (error) {
    console.error("Error editing horse", error);
    return;
  }
}

export async function deleteHorse(id: string): Promise<boolean> {
  noStore();
  try {
    const horses = await getCollection();

    const result = await horses.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting horse", error);
    return false;
  }
}

export async function getStablesStats() {
  noStore();
  try {
    const horses = await getCollection();
    const stats = await horses.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          alive: [{ $match: { status: { $ne: 0 } } }, { $count: "count" }],
          averages: [
            {
              $group: {
                _id: null,
                avgSpeed: { $avg: "$speed" },
                avgJump: { $avg: "$jump" },
              },
            },
          ],
        },
      },
    ]).toArray();

    const result = stats[0];
    return {
      total: result.total[0]?.count || 0,
      alive: result.alive[0]?.count || 0,
      avgSpeed: result.averages[0]?.avgSpeed || 0,
      avgJump: result.averages[0]?.avgJump || 0,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { total: 0, alive: 0, avgSpeed: 0, avgJump: 0 };
  }
}

export async function getHorsesByIds(ids: string[]): Promise<Horse[]> {
  noStore();
  if (!ids.length) return [];
  try {
    const horses = await getCollection();
    const objectIds = ids.map(id => new ObjectId(id));
    const data = await horses.find({ _id: { $in: objectIds } }).toArray();
    
    // Map back in the order requested
    const horseMap = new Map<string, Horse>(data.map((row: WithId<Document>) => [row._id.toString(), {
      id: row._id.toString(),
      name: row.name || "Unknown",
      parentId1: row.parentId1 || undefined,
      parentId2: row.parentId2 || undefined,
      status: row.status,
      speed: parseFloat(row.speed) || 0,
      jump: parseFloat(row.jump) || 0,
      health: parseFloat(row.health) || 0,
      variant: parseFloat(row.variantId) || 0,
      generation: parseFloat(row.generation) || 0,
      hexColor: row.hexColor || "#000000",
      dna: row.dna || {},
    }]));

    return ids.map(id => horseMap.get(id)).filter((h): h is Horse => !!h);
  } catch (error) {
    console.error("Error fetching horses by ids:", error);
    return [];
  }
}

async function getCollection(): Promise<Collection<Document>> {
  const db_name = process.env.DB_NAME;
  const collection_name = process.env.COLLECTION_NAME;
  if (!db_name || !collection_name)
    throw new Error("Database or Collection not set");

  const client = await clientPromise;
  const db = client.db(db_name);
  const horses = db.collection(collection_name);
  if (!horses) throw new Error("Collection not found");
  return horses;
}

import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { createHorseRequest, editHorseRequest, Horse } from "@/types/horse";
import { unstable_noStore as noStore } from 'next/cache';

export async function getAllHorses(): Promise<Horse[]> {
  noStore();
  try {
    const db_name = process.env.DB_NAME;
    const collection_name = process.env.COLLECTION_NAME;

    if (!db_name || !collection_name) {
      console.error("Missing DB environment variables");
      return [];
    }

    const client = await clientPromise;
    const db = client.db(db_name);

    const data = await db.collection(collection_name).find({}).toArray();

    const horseList: Horse[] = data.map((row: any) => ({
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
    const db_name = process.env.DB_NAME;
    const collection_name = process.env.COLLECTION_NAME;
    if (!db_name || !collection_name) return;

    const client = await clientPromise;
    const db = client.db(db_name);
    const horses = db.collection(collection_name);

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
    const db_name = process.env.DB_NAME;
    const collection_name = process.env.COLLECTION_NAME;
    if (!db_name || !collection_name) return;

    const client = await clientPromise;
    const db = client.db(db_name);
    const horses = db.collection(collection_name);

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
    const db_name = process.env.DB_NAME;
    const collection_name = process.env.COLLECTION_NAME;
    if (!db_name || !collection_name) return;

    const client = await clientPromise;
    const db = client.db(db_name);
    const horses = db.collection(collection_name);

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
    const db_name = process.env.DB_NAME;
    const collection_name = process.env.COLLECTION_NAME;
    if (!db_name || !collection_name) return false;

    const client = await clientPromise;
    const db = client.db(db_name);
    const horses = db.collection(collection_name);

    const result = await horses.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting horse", error);
    return false;
  }
}

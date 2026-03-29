"use server";

import { deleteHorse } from "@/lib/horses";
import { revalidatePath } from 'next/cache';

export default async function deleteHorseAction(id: string) {
    await deleteHorse(id);
    revalidatePath("/horses");
}
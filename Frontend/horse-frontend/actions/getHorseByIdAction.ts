"use server";

import { getHorseById } from "@/lib/horses";
import { revalidatePath } from 'next/cache';

export default async function getHorseByIdAction(id: string) {
    const horse = await getHorseById(id);
    revalidatePath(`/horses/${id}`);
    return horse;
}
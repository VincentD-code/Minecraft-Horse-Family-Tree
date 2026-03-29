"use server";

import { getHorseById } from "@/lib/horses";

export default async function getHorseByIdAction(id: string) {
    const horse = await getHorseById(id);
    return horse;
}
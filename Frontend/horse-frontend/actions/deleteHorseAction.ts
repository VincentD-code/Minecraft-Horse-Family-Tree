"use server";

import { deleteHorse } from "@/lib/horses";

export default async function deleteHorseAction(id: string) {
    await deleteHorse(id);
}
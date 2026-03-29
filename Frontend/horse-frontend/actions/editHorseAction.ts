"use server";

import { editHorse } from "@/lib/horses";
import { Horse, editHorseRequest } from "@/types/horse";

export default async function editHorseAction(horse: Horse, formData: Horse) {
  const data: editHorseRequest = {
    id: horse.id,
    name: horse.name,
    parentId1: formData.parentId1,
    parentId2: formData.parentId2,
    status: formData.status,
    speed: formData.speed,
    health: formData.health,
    jump: formData.jump,
    variant: formData.variant,
  };
  await editHorse(horse.id, data);
}
"use server";

import { editHorse, getHorseById } from "@/lib/horses";
import { Horse, editHorseRequest } from "@/types/horse";
import { processNewHorseGenetics } from "@/utils/genetics/service";

export default async function editHorseAction(horse: Horse, formData: Horse) {
  const parentId1 = formData.parentId1;
  const parentId2 = formData.parentId2;
  let parent1, parent2;

  if (parentId1 && parentId2) {
    [parent1, parent2] = await Promise.all([
      getHorseById(parentId1),
      getHorseById(parentId2),
    ]);}

    const { dna, hexColor, generation } = processNewHorseGenetics(
      parent1,
      parent2,
    );
  

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
    dna: dna,
    hexColor: hexColor,
    generation: generation,
  };
  await editHorse(horse.id, data);
}

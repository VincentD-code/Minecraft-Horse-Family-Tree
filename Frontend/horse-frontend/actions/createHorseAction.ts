"use server";
import { createHorseData } from "@/components/Modals/HorseCreateModal/HorseCreateModal";
import { createHorse, getHorseById } from "@/lib/horses";
import { createHorseRequest } from "@/types/horse";
import { processNewHorseGenetics } from "@/utils/genetics/service";
import { revalidatePath } from "next/cache";

export default async function createHorseAction(formData: createHorseData) {
  const parentId1 = formData.parentId1;
  const parentId2 = formData.parentId2;
  //chnage this to allow for selection of bloodline for origin horses

  const [parent1, parent2] = await Promise.all([
    getHorseById(parentId1),
    getHorseById(parentId2),
  ]);

  const { dna, hexColor, generation } = processNewHorseGenetics(
    parent1,
    parent2,
  );

  const data: createHorseRequest = {
    name: formData.name as string,
    parentId1: formData.parentId1 as string,
    parentId2: formData.parentId2 as string,
    status: formData.status,
    speed: formData.speed,
    health: formData.health,
    jump: formData.jump,
    variant: formData.variant,
    dna: dna,
    hexColor: hexColor,
    generation: generation,
  };
  const result = await createHorse(data);

  revalidatePath("/horses");

  if (result) {
    return { id: result, name: data.name };
  }
}

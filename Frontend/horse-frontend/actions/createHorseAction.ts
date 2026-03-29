"use server";
import { createHorse, getHorseById } from "@/lib/horses";
import { createHorseRequest } from "@/types/horse";
import { processNewHorseGenetics } from "@/utils/genetics/service";

export default async function createHorseAction(formData: FormData) {
  const parentId1 = formData.get("parentId1") as string;
  const parentId2 = formData.get("parentId2") as string;

  const [parent1, parent2] = await Promise.all([
    getHorseById(parentId1),
    getHorseById(parentId2),
  ]);

  const { dna, hexColor, generation } = processNewHorseGenetics(
    parent1,
    parent2,
  );

  const data: createHorseRequest = {
    name: formData.get("name") as string,
    parentId1: formData.get("parentId1") as string,
    parentId2: formData.get("parentId2") as string,
    status: formData.get("status") === "Alive" ? 1 : 0,
    speed: parseFloat(formData.get("speed") as string),
    health: parseFloat(formData.get("health") as string),
    jump: parseFloat(formData.get("jump") as string),
    variant: parseFloat(formData.get("variant") as string),
    dna: dna,
    hexColor: hexColor,
    generation: generation,
  };
  await createHorse(data);
}

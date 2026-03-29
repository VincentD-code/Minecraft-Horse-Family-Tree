"use server";
import { createHorse, getHorseById } from "@/lib/horses";
import { createHorseRequest } from "@/types/horse";
import { processNewHorseGenetics } from "@/utils/genetics/service";

export default async function createHorseAction(formData: FormData) {
  const sireId = formData.get("sireId") as string;
  const damId = formData.get("damId") as string;

  const [sire, dam] = await Promise.all([
    getHorseById(sireId),
    getHorseById(damId)
  ])

  const {dna, hexColor, generation} = processNewHorseGenetics(sire, dam);

  const data: createHorseRequest = {
    name: formData.get("name") as string,
    sireId: formData.get("sireId") as string,
    damId: formData.get("damId") as string,
    status: formData.get("status") === "Alive" ? 1 : 0,
    speed: parseFloat(formData.get("speed") as string),
    health: parseFloat(formData.get("health") as string),
    jump: parseFloat(formData.get("jump") as string),
    variant: parseFloat(formData.get("variant") as string),
    dna: dna,
    hexColor: hexColor,
    generation: generation
  };
  await createHorse(data);
}

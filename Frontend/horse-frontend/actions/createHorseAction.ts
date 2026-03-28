"use server";
import { createHorse, editHorse } from "@/lib/horses";
import { createHorseRequest, editHorseRequest, Horse } from "@/types/horse";

export async function createHorseAction(formData: FormData) {
  const data: createHorseRequest = {
    name: formData.get("name") as string,
    sireId: formData.get("sireId") as string,
    damId: formData.get("damId") as string,
    status: formData.get("status") === "Alive" ? 1 : 0,
    speed: parseFloat(formData.get("speed") as string),
    health: parseFloat(formData.get("health") as string),
    jump: parseFloat(formData.get("jump") as string),
    variant: parseFloat(formData.get("variant") as string),
  };
  await createHorse(data);
}

export async function editHorseAction(horse: Horse, formData: FormData) {
  const data: editHorseRequest = {
    id: horse.id,
    name: horse.name,
    sireId: formData.get("sireId") as string,
    damId: formData.get("damId") as string,
    status: formData.get("status") === "Alive" ? 1 : 0,
    speed: parseFloat(formData.get("speed") as string),
    health: parseFloat(formData.get("health") as string),
    jump: parseFloat(formData.get("jump") as string),
    variant: parseFloat(formData.get("variant") as string),
  };
  await editHorse(horse.id, data);
}

"use server"
import { createHorse } from "@/lib/horses";
import { createHorseRequest } from "@/types/horse";

export default async function createHorseAction(formData: FormData) {
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

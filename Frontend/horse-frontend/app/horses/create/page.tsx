import CreateHorseForm from "@/components/CreateHorseForm/CreateHorseForm";
import { getAllHorses } from "@/lib/horses";

export default async function CreateHorsePage(){
    const horses = await getAllHorses();
    return <CreateHorseForm horses={horses}/>
} 
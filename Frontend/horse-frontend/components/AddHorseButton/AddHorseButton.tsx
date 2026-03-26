import { useRouter } from "next/navigation";

export default function AddHorseButton() {
  const router = useRouter();
  const onAddHorse = () => {
    router.push(`/horses/create`);
  };

  return <button onClick={onAddHorse}>Add horse</button>;
}

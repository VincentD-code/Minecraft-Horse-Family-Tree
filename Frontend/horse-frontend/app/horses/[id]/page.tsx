import HorsePage from '@/components/HorsePage/HorsePage';
import { getHorseById } from '@/lib/horses'
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function getHorsePage({ params }: PageProps){
    const { id } = await params
    const horse = await getHorseById(id);

    if (!horse) {
        notFound();
    }

    return <HorsePage horse={horse}/>
}
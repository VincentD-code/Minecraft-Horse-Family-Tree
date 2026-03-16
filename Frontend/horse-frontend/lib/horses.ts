import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

import { Horse } from '@/types/horse';

export async function getAllHorses(): Promise<Horse[]>{
    const filePath = path.join(process.cwd(), 'data/horse_data.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const { data } = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true
    });

    return data.map((row: any) => ({
        id: String(row.id).trim(),
        name: row.Name,
        sireId: row['parent id 1'],
        damId: row['parent id 2'],
        sireName: row.Parent1 || undefined,
        damName: row.Parent2 || undefined,
        status: row.Status ? row.Status === "Dead" ? 0 : 1 : undefined,
        speed: row.Speed ? parseFloat(row.Speed) : undefined,
        jump: row.Jump ? parseFloat(row.jump) : undefined,
        health: row.Health ? parseFloat(row.health) : undefined,
        appearance: row.Appearance
    }));
}

export async function getHorseById(id: string): Promise<Horse | undefined>{
    const horses = getAllHorses();
    const horse = (await horses).find(h => h.id === id);

    return horse;
}
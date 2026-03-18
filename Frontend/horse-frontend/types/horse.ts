import { ObjectId } from 'mongodb';

// main type representing a horse
export interface Horse{
    id: string;
    name: string;
    sireName: string;
    sireId: string,
    damId: string,
    damName: string;
    variant_id: string;
    status: number | undefined;
    speed_raw: number | undefined;
    jump_raw: number | undefined;
    health: number | undefined;
}

// type used in the home page nodes
export interface HorseNodeData {
    labels: string;
    horse: Horse;
}
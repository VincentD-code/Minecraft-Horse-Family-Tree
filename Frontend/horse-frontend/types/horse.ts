import { ObjectId } from 'mongodb';

// main type representing a horse
export interface Horse{
    id: string;
    name: string;
    sireName: string;
    sireId: string,
    damId: string,
    damName: string;
    status: number | undefined;
    speed: number | undefined;
    jump: number | undefined;
    health: number | undefined;
}

export interface createHorseRequest{
    name: string;
    sireName: string;
    sireId: string;
    damName: string;
    status: number;
    speed: number;
    jump: number;
    health: number;
}

// type used in the home page nodes
export interface HorseNodeData {
    labels: string;
    horse: Horse;
}
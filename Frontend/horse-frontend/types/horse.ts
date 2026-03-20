// main type representing a horse
export interface Horse{
    id: string;
    name: string;
    sireId?: string,
    damId?: string,
    status: number;
    speed: number;
    jump: number;
    health: number;
    variant: number;
}

export interface createHorseRequest{
    name: string;
    sireId?: string;
    damId?: string;
    status: number;
    speed: number;
    jump: number;
    health: number;
    variant: number;
}

// type used in the home page nodes
export interface HorseNodeData {
    labels: string;
    horse: Horse;
}
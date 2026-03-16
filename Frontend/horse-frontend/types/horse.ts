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

// type used in the home page nodes
export interface HorseNodeData {
    labels: string;
    horse: Horse;
}
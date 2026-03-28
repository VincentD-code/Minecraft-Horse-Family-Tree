// main type representing a horse
export interface Horse{
    id: string;
    name: string;
    sireId?: string,
    damId?: string,
    sireName?: string; 
    damName?: string;
    status: number;
    speed: number;
    jump: number;
    health: number;
    variant: number;
    generation: number;
    originBlood?: string; 
    hexColor?: string;
    bloodlines?: BloodlineMap;
}

export type BloodlineMap = {
  [key: string]: number;
};

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
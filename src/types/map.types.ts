export type Point = [number, number];

export interface RawStep {
    length: number;
    duration: number;
    mode: string;
    polyline: {
        points: Point[];
    };
}

export interface RawLeg {
    status: string;
    steps: RawStep[];
}

export interface RawRoute {
    traffic: string;
    route: {
        legs: RawLeg[];
        flags?: {
            hasTolls?: boolean;
            hasNonTransactionalTolls?: boolean;
        };
    };
}

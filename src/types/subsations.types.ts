export interface RawCoordinates {
    x: number;
    y: number;
}

export type Coordinates = [number, number];

export interface RawSubstation {
    substation_id: number;
    coordinates: RawCoordinates;
    address: string;
    status: string;
    name: string;
    power: number;
}

export interface Substation extends Omit<RawSubstation, 'coordinates'> {
    coordinates: Coordinates;
}

export interface RawBase extends RawSubstation {
    generators_count: number;
}

export interface Base extends Omit<RawBase, 'coordinates'> {
    coordinates: Coordinates;
}

import type {Coordinates, RawCoordinates} from './map.types';

export type Status = 'active' | 'disabled' | 'waiting';

export interface RawSubstation {
    substation_id: number;
    coordinates: RawCoordinates;
    address: string;
    status: Status;
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

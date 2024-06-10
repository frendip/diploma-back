import type {Coordinates, RawCoordinates} from './map.types';

export interface RawCar {
    car_id: number;
    coordinates: RawCoordinates;
    status: 'delivered' | 'inWork' | 'inBase';
    driver_name: string;
    generator_name: string;
    generator_power: number;
    base_id: number;
}

export interface Car extends Omit<RawCar, 'coordinates'> {
    coordinates: Coordinates;
}

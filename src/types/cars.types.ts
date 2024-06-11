import type {Coordinates, RawCoordinates} from './map.types';
import type {RawSubstation, Substation} from './subsations.types';

export interface RawCar {
    car_id: number;
    coordinates: RawCoordinates;
    status: 'delivered' | 'inWork' | 'onBase';
    driver_name: string;
    generator_name: string;
    generator_power: number;
    base_id: number;
}

export interface Car extends Omit<RawCar, 'coordinates'> {
    coordinates: Coordinates;
}

export interface RawCarRoute {
    cars_route_id: number;
    car_id: number;
    start_substation_id: number;
    end_substation_id: number;
}

export interface CarRoute extends Omit<RawCarRoute, 'start_substation_id' | 'end_substation_id'> {
    cars_route_id: number;
    car_id: number;
    start_substation: Substation;
    end_substation: Substation;
}

import type {Coordinates, RawCoordinates, Route} from './map.types';
import type {Substation} from './subsations.types';

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
    route: Route;
}

export interface CarRoute extends Omit<RawCarRoute, 'start_substation_id' | 'end_substation_id'> {
    start_substation: Substation;
    end_substation: Substation;
}

export interface RawRepairingSubstation {
    repairing_substation_id: number;
    car_id: number;
    substation_id: number;
}

export interface RepairingSubstation extends Omit<RawRepairingSubstation, 'substation_id'> {
    substation: Substation;
}

export interface RawCarWithMatrix extends RawCar {
    duration_time: number;
    distance: number;
    base_name: string;
}

export interface CarWithMatrix extends Omit<RawCarWithMatrix, 'coordinates'> {
    coordinates: Coordinates;
}

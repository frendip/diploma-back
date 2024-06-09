import type {RawCoordinates, Coordinates} from '../types/subsations.types';

export const transformCoordinates = (coordinates: RawCoordinates): Coordinates => {
    return [coordinates.x, coordinates.y];
};

import type {RawCoordinates, Coordinates} from '../types/map.types';

export const transformCoordinates = (coordinates: RawCoordinates): Coordinates => {
    return [coordinates.x, coordinates.y];
};

export const unTransformCoordinates = (coordinates: Coordinates): RawCoordinates => {
    return {x: coordinates[0], y: coordinates[1]};
};

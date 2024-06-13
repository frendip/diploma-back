import {handlerRouter} from '../controllers/router.controller';
import SocketController from '../controllers/socket.controller';
import {handlerGetSubstationById} from '../controllers/substations.controller';
import {pool} from '../db';
import {Coordinates} from '../types/map.types';
import {timeout} from './timeout';

export const mockDriveRoute = async (
    start_substation_id: number,
    end_substation_id: number,
    car_id: number,
    toBase = false
) => {
    if (toBase) {
        await pool.query('DELETE FROM repairing_substations WHERE car_id = $1', [car_id]);
        await pool.query(
            'INSERT INTO cars_routes (car_id, start_substation_id, end_substation_id) VALUES ($1, $2, $3)',
            [car_id, start_substation_id, end_substation_id]
        );
        await pool.query('UPDATE substations SET status = $1 WHERE substation_id = $2', [
            `active`,
            start_substation_id
        ]);

        SocketController.updateSubstationStatus({substationId: start_substation_id, status: 'active'});
        SocketController.updateCarStatus({carId: car_id, status: 'delivered'});
    }

    const startSubstation = await handlerGetSubstationById(start_substation_id);
    const endSubstation = await handlerGetSubstationById(end_substation_id);

    if (!startSubstation || !endSubstation) return;

    const routeBorderPoints: Coordinates[] = [startSubstation.coordinates, endSubstation.coordinates];

    const router = await handlerRouter(routeBorderPoints);

    if (!router) return;

    for (let [index, point] of router.points.entries()) {
        if (index % 10 === 0) {
            SocketController.UpdateCarCoordinates({carId: car_id, newCoordinates: point as Coordinates});
            await pool.query('UPDATE cars SET coordinates = $1 WHERE car_id = $2', [`(${point.join(',')})`, car_id]);
        } else if (router.points.length - 1 === index) {
            SocketController.UpdateCarCoordinates({carId: car_id, newCoordinates: point as Coordinates});
            await pool.query('UPDATE cars SET coordinates = $1 WHERE car_id = $2', [`(${point.join(',')})`, car_id]);
        }
        await timeout(25);
    }

    await pool.query('DELETE FROM cars_routes WHERE car_id = $1', [car_id]);

    if (!toBase) {
        await pool.query('UPDATE cars SET status = $1 WHERE car_id = $2', [`inWork`, car_id]);
        await pool.query('INSERT INTO repairing_substations (car_id, substation_id) VALUES ($1, $2)', [
            car_id,
            end_substation_id
        ]);

        SocketController.updateCarStatus({carId: car_id, status: 'inWork'});

        await timeout(3000);
        mockDriveRoute(end_substation_id, start_substation_id, car_id, true);
    } else {
        await pool.query('UPDATE cars SET status = $1 WHERE car_id = $2', [`onBase`, car_id]);
        SocketController.updateCarStatus({carId: car_id, status: 'onBase'});
    }
};

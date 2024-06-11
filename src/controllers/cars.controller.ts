import {Request, Response} from 'express';
import {pool} from '../db';
import type {RawCar, Car, CarRoute, RawCarRoute} from '../types/cars.types';
import {transformCoordinates} from '../utils/formatCoordinates';
import {handlerGetSubstationById} from './substations.controller';

class CarsController {
    async getCars(req: Request, res: Response) {
        try {
            const cars = (await pool.query('SELECT * from cars')).rows as RawCar[];

            const formattedCars = cars.map((car) => ({
                ...car,
                coordinates: transformCoordinates(car.coordinates)
            })) as Car[];

            res.status(200).json({success: true, message: 'ok!', data: formattedCars});
        } catch (err) {
            res.status(500).json({success: false, message: `DB error`, err: err});
        }
    }
    async getCarById(req: Request<{id: number}>, res: Response) {
        try {
            const carId = req.params.id;

            if (Number.isNaN(carId)) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid carId.'
                });
            }

            const car = (await pool.query(`SELECT * from cars WHERE car_id = $1`, [carId])).rows[0] as RawCar;

            if (!car) {
                return res.status(404).json({success: false, message: 'Car not found'});
            }

            const formattedCars = {...car, coordinates: transformCoordinates(car.coordinates)} as Car;

            res.status(200).json({success: true, message: 'ok!', data: formattedCars});
        } catch (err) {
            res.status(500).json({success: false, message: `DB error`, err: err});
        }
    }
    async getCarRoute(req: Request<{id: number}>, res: Response) {
        try {
            const carId = req.params.id;

            if (Number.isNaN(carId)) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid carId.'
                });
            }

            const route = (await pool.query(`SELECT * from cars_routes WHERE car_id=$1`, [carId]))
                .rows[0] as RawCarRoute;

            if (!route) {
                return res.status(404).json({success: false, message: 'Car route not found'});
            }

            const startSubstation = await handlerGetSubstationById(route.start_substation_id);

            if (!startSubstation) {
                return res.status(404).json({success: false, message: 'Car start substation not found'});
            }

            const endSubstation = await handlerGetSubstationById(route.end_substation_id);

            if (!endSubstation) {
                return res.status(404).json({success: false, message: 'Car end substation not found'});
            }

            const formattedRoute = {
                cars_route_id: route.cars_route_id,
                car_id: route.car_id,
                start_substation: startSubstation,
                end_substation: endSubstation
            } as CarRoute;

            res.status(200).json({success: true, message: 'ok!', data: formattedRoute});
        } catch (err) {
            res.status(500).json({success: false, message: `DB error`, err: err});
        }
    }
}

export default new CarsController();

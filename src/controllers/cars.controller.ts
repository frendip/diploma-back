import {Request, Response} from 'express';
import {pool} from '../db';
import {RawCar, Car} from '../types/cars.types';
import {transformCoordinates} from '../utils/formatCoordinates';

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
}

export default new CarsController();

import {Request, Response} from 'express';
import {pool} from '../db';
import type {Base, RawBase, RawSubstation, Substation} from '../types/subsations.types';
import {transformCoordinates} from '../utils/formatCoordinates';
import type {CarWithMatrix, RawCarWithMatrix} from '../types/cars.types';

const handlerGetSubstationById = async (substationId: number): Promise<Substation | undefined> => {
    const substation = (await pool.query(`SELECT * from substations WHERE substation_id = $1`, [substationId]))
        .rows[0] as RawSubstation;

    if (!substation) {
        return;
    }

    return {
        ...substation,
        coordinates: transformCoordinates(substation.coordinates)
    } as Substation;
};

const handlerGetSubstations = async (status?: Substation['status'] | 'all'): Promise<Substation[]> => {
    const substations = (await pool.query('SELECT * from substations')).rows as RawSubstation[];

    const formattedSubstations = substations.map((substation) => ({
        ...substation,
        coordinates: transformCoordinates(substation.coordinates)
    })) as Substation[];

    let filteredSubstations: Substation[];
    if (!status || status === 'all') {
        filteredSubstations = formattedSubstations;
    } else {
        filteredSubstations = formattedSubstations.filter((substation) => substation.status === status);
    }

    return filteredSubstations;
};

const handlerGetBases = async (): Promise<Base[]> => {
    const bases = (
        await pool.query(`SELECT * from substations 
        JOIN bases ON substations.substation_id = bases.base_id`)
    ).rows as RawBase[];

    return bases.map((substation) => ({
        ...substation,
        coordinates: transformCoordinates(substation.coordinates)
    })) as Base[];
};
class SubstationsController {
    async getSubstations(req: Request<{}, {}, {}, {status?: Substation['status'] | 'all'}>, res: Response) {
        try {
            const {status} = req.query;

            const substations = await handlerGetSubstations(status);

            res.status(200).json({success: true, message: 'ok!', data: substations});
        } catch (err) {
            res.status(500).json({success: false, message: `DB error`, err: err});
        }
    }

    async getSubstationById(req: Request<{id: number}>, res: Response) {
        try {
            const substationId = req.params.id;

            if (Number.isNaN(substationId)) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid baseId.'
                });
            }

            const substation = await handlerGetSubstationById(substationId);

            if (!substation) {
                return res.status(404).json({success: false, message: 'Substation not found'});
            }

            res.status(200).json({success: true, message: 'ok!', data: substation});
        } catch (err) {
            res.status(500).json({success: false, message: `DB error`, err: err});
        }
    }

    async setSubstation(req: Request<{}, {}, Omit<Substation, 'substation_id'>>, res: Response) {
        try {
            const newSubstation = req.body;

            await pool.query(
                'INSERT INTO substations (coordinates, status, power, name, address) VALUES ($1, $2, $3, $4, $5)',
                [
                    `(${newSubstation.coordinates.join(',')})`,
                    newSubstation.status,
                    newSubstation.power,
                    newSubstation.name,
                    newSubstation.address
                ]
            );
            res.status(200).json({success: true, message: 'ok!'});
        } catch (err) {
            res.status(500).json({success: false, message: `DB error`, err: err});
        }
    }

    async deleteSubstation(req: Request<{}, {}, {}, {substation_id: string}>, res: Response) {
        try {
            const substation_id = req.query.substation_id;
            await pool.query(`DELETE FROM substations WHERE substation_id = $1`, [substation_id]);
            res.status(200).json({success: true, message: 'ok!'});
        } catch (err) {
            res.status(500).json({success: false, message: `DB error`, err: err});
        }
    }

    async getSubstationRepairCars(req: Request<{id: number}>, res: Response) {
        try {
            const substationId = req.params.id;

            if (Number.isNaN(substationId)) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid substationId.'
                });
            }

            const cars = (
                await pool.query(
                    `select cars.*, substations.name as base_name, duration_time, distance from distance_matrix
                    join cars on cars.base_id = distance_matrix.base_id
                    join substations on substations.substation_id = distance_matrix.base_id
                    where distance_matrix.substation_id = $1 and cars.status = 'onBase'`,
                    [substationId]
                )
            ).rows as RawCarWithMatrix[];

            const formattedCars = cars.map((car) => ({
                ...car,
                duration_time: +(car.duration_time / 60).toFixed(0),
                coordinates: transformCoordinates(car.coordinates)
            })) as CarWithMatrix[];

            const filteredCars = formattedCars.sort((carA, carB) => carA.duration_time - carB.duration_time);

            res.status(200).json({success: true, message: 'ok!', data: filteredCars});
        } catch (err) {
            res.status(500).json({success: false, message: `DB error`, err: err});
        }
    }

    async getBases(req: Request, res: Response) {
        try {
            const formattedBases = await handlerGetBases();

            res.status(200).json({success: true, message: 'ok!', data: formattedBases});
        } catch (err) {
            res.status(500).json({success: false, message: `DB error`, err: err});
        }
    }
}

export {handlerGetSubstations, handlerGetSubstationById, handlerGetBases};
export default new SubstationsController();

import {Request, Response} from 'express';
import {pool} from '../db';
import type {Base, RawBase, RawSubstation, Substation} from '../types/subsations.types';
import {transformCoordinates} from '../utils/formatCoordinates';

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
class SubstationsController {
    async getSubstations(req: Request<{}, {}, {}, {status?: Substation['status'] | 'all'}>, res: Response) {
        try {
            const substations = (await pool.query('SELECT * from substations')).rows as RawSubstation[];

            const formattedSubstations = substations.map((substation) => ({
                ...substation,
                coordinates: transformCoordinates(substation.coordinates)
            })) as Substation[];

            const {status} = req.query;

            let filteredSubstations: Substation[];
            if (!status || status === 'all') {
                filteredSubstations = formattedSubstations;
            } else {
                filteredSubstations = formattedSubstations.filter((substation) => substation.status === status);
            }

            res.status(200).json({success: true, message: 'ok!', data: filteredSubstations});
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

    async deleteSubstation(req: Request<{}, {}, {substation_id: number}>, res: Response) {
        try {
            const {substation_id} = req.body;
            await pool.query(`DELETE FROM substations WHERE substation_id = $1`, [substation_id]);
            res.status(200).json({success: true, message: 'ok!'});
        } catch (err) {
            res.status(500).json({success: false, message: `DB error`, err: err});
        }
    }

    async getBases(req: Request, res: Response) {
        try {
            const bases = (
                await pool.query(`SELECT * from substations 
                JOIN bases ON substations.substation_id = bases.base_id`)
            ).rows as RawBase[];

            const formattedBases = bases.map((substation) => ({
                ...substation,
                coordinates: transformCoordinates(substation.coordinates)
            })) as Base[];

            res.status(200).json({success: true, message: 'ok!', data: formattedBases});
        } catch (err) {
            res.status(500).json({success: false, message: `DB error`, err: err});
        }
    }
}

export {handlerGetSubstationById};
export default new SubstationsController();

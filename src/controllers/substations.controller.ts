import {Request, Response} from 'express';
import {pool} from '../db';
import {transformCoordinates} from '../utils/formatCoordinates';
import type {RawBase, Base, RawSubstation, Substation} from '../types/subsations.types';

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

export default new SubstationsController();

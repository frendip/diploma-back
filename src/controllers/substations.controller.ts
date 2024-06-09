import {Request, Response} from 'express';
import {pool} from '../db';
import {transformCoordinates} from '../utils/formatCoordinates';
import type {RawSubstation, Substation} from '../types/subsations.types';

class SubstationsController {
    async getSubstations(req: Request, res: Response) {
        try {
            const substations = (await pool.query('SELECT * from substations')).rows as RawSubstation[];

            const formattedSubstations = substations.map((substation) => ({
                ...substation,
                coordinates: transformCoordinates(substation.coordinates)
            })) as Substation[];

            res.status(200).json({success: true, message: 'ok!', data: formattedSubstations});
        } catch (err) {
            res.status(500).json({success: false, message: `DB error`, err: err});
        }
    }
}

export default new SubstationsController();

import {handlerGetBases, handlerGetSubstations} from '../controllers/substations.controller';
import {pool} from '../db';

export const fillDistanceMatrix = async () => {
    try {
        const bases = (await handlerGetBases()).map((base) => ({
            base_id: base.substation_id,
            coordinates: base.coordinates
        }));
        const substations = (await handlerGetSubstations()).map((substation) => ({
            substation_id: substation.substation_id,
            coordinates: substation.coordinates
        }));

        const distanceMatrixUrl = new URL('https://api.routing.yandex.net/v2/distancematrix');
        distanceMatrixUrl.searchParams.set('apikey', process.env.ROUTER_API_KEY!);
        distanceMatrixUrl.searchParams.set('origins', bases.map((base) => base.coordinates.reverse()).join('|'));
        distanceMatrixUrl.searchParams.set(
            'destinations',
            substations.map((substation) => substation.coordinates.reverse()).join('|')
        );

        const res = await fetch(distanceMatrixUrl);
        const data = (await res.json()).rows;

        const baseDistanceMatrix = data.map((row) =>
            row.elements.map((element) => ({distance: element.distance.value, duration: element.duration.value}))
        );

        await pool.query('TRUNCATE TABLE distance_matrix');

        for (const [baseIndex, base] of baseDistanceMatrix.entries()) {
            for (const [substationIndex, substation] of base.entries()) {
                await pool.query(
                    `INSERT INTO distance_matrix (substation_id, base_id, duration_time, distance) VALUES ($1, $2, $3, $4)`,
                    [
                        substations[substationIndex].substation_id,
                        bases[baseIndex].base_id,
                        substation.duration,
                        substation.distance
                    ]
                );
            }
        }
    } catch (err) {
        throw new Error(String(err));
    }
};

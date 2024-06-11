import {config} from 'dotenv';
import {Request, Response} from 'express';
config();

class GeocodeController {
    async getAddressFromCoordinates(req: Request<{}, {}, {}, {coordinates: string}>, res: Response) {
        try {
            const coordinates = req.query.coordinates;

            const geocodeUrl = new URL('https://geocode-maps.yandex.ru/1.x');
            geocodeUrl.searchParams.set('apikey', process.env.GEOCODE_API_KEY!);
            geocodeUrl.searchParams.set('geocode', coordinates);
            geocodeUrl.searchParams.set('format', 'json');

            const response = await fetch(geocodeUrl);
            if (response.status !== 200) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error. Failed to fetch address.'
                });
            }
            const data = (await response.json()).response.GeoObjectCollection.featureMember[0].GeoObject
                .metaDataProperty.GeocoderMetaData.text;
            const formattedData = data.split(', ').slice(1).join(', ');

            res.status(200).json({
                success: true,
                message: 'ok!',
                data: formattedData
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: err
            });
        }
    }
}

export default new GeocodeController();

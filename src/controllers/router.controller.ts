import {config} from 'dotenv';
import type {Request, Response} from 'express';
import type {Point, RawRoute} from '../types/map.types';
config();

export const handlerRouter = async (waypoints: Point[]) => {
    const reversedWaypoints = waypoints.map((point) => point.reverse()) as Point[];

    const routeUrl = new URL('https://api.routing.yandex.net/v2/route');
    routeUrl.searchParams.set('apikey', process.env.ROUTER_API_KEY!);
    routeUrl.searchParams.set('waypoints', reversedWaypoints.map((x) => x.join(',')).join('|'));

    const routeRes = await fetch(routeUrl);
    if (routeRes.status !== 200) {
        return;
    }

    const rawRoute = (await routeRes.json()) as RawRoute;
    const rawLegs = rawRoute.route.legs;

    const points = rawLegs
        .flatMap((leg) => leg.steps)
        .flatMap((step) => step.polyline.points)
        .map((point) => point.reverse());

    let duration = rawLegs.flatMap((leg) => leg.steps).reduce((total, x) => total + x.duration, 0);
    duration = Math.ceil(duration);

    let distance = rawLegs.flatMap((leg) => leg.steps).reduce((total, x) => total + x.length, 0);
    distance = Math.ceil(distance);

    return {points, duration, distance};
};
class RouterController {
    async getRoute(req: Request<{}, {}, {}, {waypoints: string}>, res: Response) {
        try {
            const {waypoints} = req.query;

            const formattedWaypoints = JSON.parse(waypoints) as Point[];
            if (formattedWaypoints.length < 2) {
                return res.status(401).json({
                    success: false,
                    message: 'There must be at least two waypoints.'
                });
            }

            const data = await handlerRouter(formattedWaypoints);

            if (!data) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error. Failed to build a route.'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Router created successfully.',
                data
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

export default new RouterController();

import http from 'http';
import {Server, Socket, ServerOptions} from 'socket.io';
import {Coordinates} from '../types/map.types';
import {Car} from '../types/cars.types';
import {Substation} from '../types/subsations.types';

interface UpdateCarCoordinatesProps {
    carId: number;
    newCoordinates: Coordinates;
}

interface UpdateCarStatusProps {
    carId: number;
    status: Car['status'];
}

interface UpdateSubstationStatusProps {
    substationId: number;
    status: Substation['status'];
}
class SocketController {
    private static io: Server;

    public static initialize(httpServer: http.Server, options?: Partial<ServerOptions>) {
        this.io = new Server(httpServer, options);

        this.io.on('connection', (socket: Socket) => {
            console.log('New websocket client connected');

            socket.on('disconnect', () => {
                console.log('Websocket client disconnected');
            });
        });
    }

    public static UpdateCarCoordinates(props: UpdateCarCoordinatesProps): void {
        if (!this.io) return;

        this.io.emit('updateCarCoordinates', props);
    }

    public static updateCarStatus(props: UpdateCarStatusProps): void {
        if (!this.io) return;

        this.io.emit('updateCarStatus', props);
    }

    public static updateSubstationStatus(props: UpdateSubstationStatusProps) {
        if (!this.io) return;

        this.io.emit('updateSubstationStatus', props);
    }
}

export default SocketController;

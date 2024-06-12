import http from 'http';
import {Server, Socket, ServerOptions} from 'socket.io';

class SocketController {
    private static io: Server;

    public static initialize(httpServer: http.Server, options?: Partial<ServerOptions>) {
        this.io = new Server(httpServer, options);

        this.io.on('connection', (socket: Socket) => {
            console.log('New client connected');

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    public static sendCustomMessage(message: string): void {
        if (!this.io) return;

        this.io.emit('message', message);
        console.log('ОТРАБОТАЛО');
    }
}

export default SocketController;

import cors from 'cors';
import express from 'express';
import carsRouter from './routes/cars.routes';
import geocodeRouter from './routes/geocode.routes';
import routerRouter from './routes/router.routes';
import substationsRouter from './routes/substations.routes';
import {fillDistanceMatrix} from './utils/fillDistanceMatrix';
import http from 'http';
import {config} from 'dotenv';
import SocketController from './controllers/socket.controller';
config();

const PORT = process.env.PORT || '4000';
const SOCKET_OPTIONS = {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
};

const app = express();
const HTTP = http.createServer(app);
SocketController.initialize(HTTP, SOCKET_OPTIONS);

app.use(cors());
app.use(express.json());

app.use('/router', routerRouter);
app.use('/substations', substationsRouter);
app.use('/cars', carsRouter);
app.use('/geocode', geocodeRouter);

HTTP.listen(PORT, () => {
    // setInterval(() => {
    //     fillDistanceMatrix();
    // }, 5000);
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

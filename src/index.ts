import cors from 'cors';
import {config} from 'dotenv';
import express from 'express';
import http from 'http';
import SocketController from './controllers/socket.controller';
import carsRouter from './routes/cars.routes';
import geocodeRouter from './routes/geocode.routes';
import routerRouter from './routes/router.routes';
import substationsRouter from './routes/substations.routes';
import {setDbData} from './db';
import {fillDistanceMatrix} from './utils/fillDistanceMatrix';
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

HTTP.listen(PORT, async () => {
    // await setDbData();
    // await fillDistanceMatrix();
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

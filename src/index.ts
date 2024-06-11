import cors from 'cors';
import {config} from 'dotenv';
import express from 'express';
import carsRouter from './routes/cars.routes';
import geocodeRouter from './routes/geocode.routes';
import routerRouter from './routes/router.routes';
import substationsRouter from './routes/substations.routes';
config();

const PORT = process.env.PORT || '4000';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/router', routerRouter);
app.use('/substations', substationsRouter);
app.use('/cars', carsRouter);
app.use('/geocode', geocodeRouter);

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

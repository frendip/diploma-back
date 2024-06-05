import express from 'express';
import cors from 'cors';
import routerRouter from './routes/router.routes';
import {config} from 'dotenv';
config();

const PORT = process.env.PORT || '3000';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/router', routerRouter);

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

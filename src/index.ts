import express from 'express';
import cors from 'cors';
import {config} from 'dotenv';
config();

const PORT = process.env.PORT || '3000';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    return res.send('Hello world');
});

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

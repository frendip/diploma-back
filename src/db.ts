import {config} from 'dotenv';
import {Pool} from 'pg';
config();

const {DB_HOST, DB_NAME, DB_USER, DB_PASS} = process.env;

export const pool = new Pool({
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASS,
    ssl: true
});

import {config} from 'dotenv';
import {readFileSync} from 'fs';
import path from 'path';
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

const tables = ['substations', 'bases', 'cars', 'cars_routes', 'repairing_substations'];

export const setDbData = async () => {
    for (let table of tables.reverse()) {
        await pool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    }

    await pool.query(`TRUNCATE TABLE distance_matrix RESTART IDENTITY CASCADE`);

    for (let table of tables.reverse()) {
        const expression = readFileSync(path.join(__dirname, `/sql/${table}.table.sql`), 'utf8');
        await pool.query(expression);
    }
};

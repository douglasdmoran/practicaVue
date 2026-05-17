import pkg  from 'pg';

import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Obligatorio para Supabase
    }
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error conectando a Supabase:', err.stack);
    } else {
        console.log('Conexión exitosa. Hora del servidor:', res.rows[0].now);
    }
});
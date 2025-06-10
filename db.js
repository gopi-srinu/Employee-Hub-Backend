const { text } = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'Haasteam20#',
    host: 'localhost',
    port: 5432,
    database: 'EmployeeHub'
})

pool.connect((err, client, release) => {
    if (err) {
        console.log('Error Connecting Database', err.stack);
    } else {
        console.log('Database Connected Successfully.');
        release();
    }
})

module.exports = pool;

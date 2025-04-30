require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false,
    },
    max: 50,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000, 
    maxRetries: 3 
});

// Handle pool errors
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
});

// Connection with retry logic
const connect = async (retries = 3) => {
    while (retries) {
        try {
            const client = await pool.connect();
            client.release();
            console.log("Connected to the database");
            return;
        } catch (error) {
            retries--;
            console.error(`Failed to connect. Retries left: ${retries}`, error);
            if (!retries) throw error;
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

const query = async (text, params) => {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res;
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    } finally {
        client.release();
    }
};

const transaction = async (callback) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const result = await callback(client);
        await client.query("COMMIT");
        return result;
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Transaction Error:", err);
        throw err;
    } finally {
        client.release();
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await pool.end();
        console.log('Pool has ended');
        process.exit(0);
    } catch (err) {
        console.error('Error during pool shutdown', err);
        process.exit(1);
    }
});

module.exports = {
    query,
    transaction,
    connect
};
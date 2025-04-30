const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./src/database/pg.database');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: ['http://localhost:5173', 'https://os.netlabdte.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/store', require('./src/routes/store.route'));
app.use('/user', require('./src/routes/user.route'));
app.use('/item', require('./src/routes/item.route'));
app.use('/transaction', require('./src/routes/transaction.route'));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    shutdown();
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    shutdown();
});

const shutdown = async () => {
    console.log('Attempting graceful shutdown...');
    try {
        await db.pool.end();
        server.close(() => {
            console.log('Server closed');
            process.exit(1);
        });
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
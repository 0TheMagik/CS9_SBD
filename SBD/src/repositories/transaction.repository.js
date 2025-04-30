const { transaction } = require('../database/pg.database');

exports.createTransaction = async (transactionData) => {
    try {
        const result = await transaction(async (client) => {
            const res = await client.query(
                "INSERT INTO transactions (item_id, quantity, user_id, status, total) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [transactionData.item_id, transactionData.quantity, transactionData.user_id, transactionData.status, transactionData.total]
            );
            return res.rows[0];
        });
        return result;
    } catch (error) {
        console.error("Error executing createTransaction query", error);
        throw error;
    }
};

exports.transactionPayment = async (transaction_id) => {
    try {
        const result = await transaction(async (client) => {
            const transRes = await client.query(
                "SELECT * FROM transactions WHERE id = $1 FOR UPDATE",
                [transaction_id]
            );
            if (transRes.rowCount === 0) {
                throw new Error("Transaction not found");
            }
            const transaction = transRes.rows[0];

            if (transaction.status === 'paid') {
                throw new Error("Transaction already paid");
            }

            const itemRes = await client.query(
                "SELECT * FROM items WHERE id = $1 FOR UPDATE",
                [transaction.item_id]
            );
            if (itemRes.rowCount === 0) {
                throw new Error("Item not found");
            }
            const item = itemRes.rows[0];
            if (item.stock < transaction.quantity) {
                throw new Error("Insufficient item stock");
            }

            const userRes = await client.query(
                "SELECT * FROM users WHERE id = $1 FOR UPDATE",
                [transaction.user_id]
            );
            if (userRes.rowCount === 0) {
                throw new Error("User not found");
            }
            const user = userRes.rows[0];
            if (user.balance < transaction.total) {
                throw new Error("Insufficient user balance");
            }

            const updatedTrans = await client.query(
                "UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *",
                [transaction_id]
            );

            await client.query(
                "UPDATE items SET stock = stock - $1 WHERE id = $2",
                [transaction.quantity, transaction.item_id]
            );

            await client.query(
                "UPDATE users SET balance = balance - $1 WHERE id = $2",
                [transaction.total, transaction.user_id]
            );

            return updatedTrans.rows[0];
        });
        return result;
    } catch (error) {
        console.error("Error executing transactionPayment query", error);
        throw error;
    }
};

exports.deleteTransaction = async (id) => {
    try {
        const result = await transaction(async (client) => {
            const res = await client.query(
                "DELETE FROM transactions WHERE id = $1 RETURNING *",
                [id]
            );
            if (res.rowCount === 0) {
                throw new Error("Transaction not found");
            }
            return res.rows[0];
        });
        return result;
    } catch (error) {
        console.error("Error executing deleteTransaction query", error);
        throw error;
    }
};

exports.getTransactions = async () => {
    try {
        const result = await transaction(async (client) => {
            const res = await client.query("SELECT * FROM transactions");
            return res.rows;
        });
        return result;
    } catch (error) {
        console.error("Error executing getTransactions query", error);
        throw error;
    }
};

const handleError = (res, error, message) => {
    console.error(message, {
        error: error.message, // Pesan error
        stack: error.stack    // Stack trace untuk debugging
    });
    return res.status(500).json({
        success: false,
        message: message || "An unexpected error occurred",
        data: null
    });
};

module.exports = handleError;
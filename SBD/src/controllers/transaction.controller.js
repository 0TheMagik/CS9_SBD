const transactionRepository = require('../repositories/transaction.repository');
const baseResponse = require('../utils/baseResponse.util');
const itemRepository = require('../repositories/item.repository');

const getItemPrice = async (item_id) => {
    try {
        const item = await itemRepository.getItemById(item_id);
        if (!item) {
            throw new Error('Item not found');
        }
        return item.price;
    } catch (error) {
        console.error("Error retrieving item price", {
            error: error.message, // Menyertakan pesan error
            stack: error.stack,   // Menyertakan stack trace untuk debugging
            item_id               // Menyertakan ID item untuk konteks
        });
        throw new Error('Failed to retrieve item price'); 
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const { item_id, quantity, user_id } = req.body;
        console.log("Received data:", { item_id, quantity, user_id });

        const itemPrice = await getItemPrice(item_id);
        const total = itemPrice * quantity;

        const transaction = {
            item_id,
            quantity,
            user_id,
            status: 'pending',
            total
        };
        const result = await transactionRepository.createTransaction(transaction);
        return baseResponse(res, true, 201, "Transaction created successfully", result);
    } catch (error) {
        console.error("Error creating transaction", error);
        return baseResponse(res, false, 500, "Error creating transaction", error);
    }
};

exports.transactionPayment = async (req, res) => {
    try {
        const { transaction_id } = req.params;
        const result = await transactionRepository.transactionPayment(transaction_id);
        return baseResponse(res, true, 200, "Payment successful", result);
    } catch (error) {
        console.error("Error processing payment", error);
        return baseResponse(res, false, 500, "Error processing payment", error);
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await transactionRepository.deleteTransaction(id);
        return baseResponse(res, true, 200, "Transaction deleted", result);
    } catch (error) {
        if (error.message === "Transaction not found") {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        console.error("Error deleting transaction", {
            error: error.message, // Menyertakan pesan error
            stack: error.stack,   // Menyertakan stack trace untuk debugging
            params: req.params    // Menyertakan parameter request
        });
        return baseResponse(res, false, 500, "An unexpected error occurred while deleting the transaction", null); 
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const result = await transactionRepository.getTransactions();
        return baseResponse(res, true, 200, "Transactions retrieved successfully", result);
    } catch (error) {
        console.error("Error retrieving transactions", {
            error: error.message, // Menyertakan pesan error
            stack: error.stack    // Menyertakan stack trace untuk debugging
        });
        return baseResponse(res, false, 500, "An unexpected error occurred while retrieving transactions", null); 
    }
};
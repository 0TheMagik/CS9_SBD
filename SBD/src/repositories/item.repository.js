const db = require('../database/pg.database');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: 'dh8kyfm2o',
    api_key: '187641212338329',
    api_secret: 'bz74k7nFsoNypxO9wOLF5Iz-MiQ',
});

exports.createItem = async (item) => {
    const { name, price, store_id, image, stock } = item;
    try {
        const uploadResult = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResult.secure_url;

        const res = await db.query(
            "INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, price, store_id, imageUrl, stock]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing", error);
        throw error;
    }
};

exports.getAllItems = async () => {
    try {
        const res = await db.query("SELECT * FROM items");
        return res.rows;
    } catch (error) {
        console.error("Error executing", error);
        throw error;
    }
};

exports.getItemById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM items WHERE id = $1", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing", error);
        throw error;
    }
};

exports.getItemByStoreId = async (store_id) => {
    try {
        const res = await db.query("SELECT * FROM items WHERE store_id = $1", [store_id]);
        return res.rows;
    } catch (error) {
        console.error("Error executing", error);
        throw error;
    }
};

exports.updateItem = async (item) => {
    const { name, price, image, stock, id } = item;
    try {
        let imageUrl = null;
        if (image) {
            const uploadResult = await cloudinary.uploader.upload(image);
            imageUrl = uploadResult.secure_url;
        }

        const res = await db.query(
            "UPDATE items SET name = $1, price = $2, image_url = $3, stock = $4 WHERE id = $5 RETURNING *",
            [name, price, imageUrl, stock, id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing", error);
        throw error;
    }
};

exports.deleteItem = async (id) => {
    try {
        const res = await db.query(
            "DELETE FROM items WHERE id = $1 RETURNING *",
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing", error);
        throw error;
    }
};
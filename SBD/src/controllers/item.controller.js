const itemRepository = require('../repositories/item.repository');
const storeRepository = require('../repositories/store.repository');
const baseResponse = require('../utils/baseResponse.util');

exports.createItem = async (req, res) => {
    const { name, price, store_id, stock } = req.body;
    if (!name || !price || !store_id) {
        return baseResponse(res, false, 400, 'Name, price, and store are required', null);
    }
    try {
        const store = await storeRepository.getStoreById(store_id);
        if (!store) {
            return baseResponse(res, false, 404, 'Store not found', null);
        }

        const image = req.file;
        let imageBase64 = null;
        if (image) {
            imageBase64 = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
        }
        
        const item = await itemRepository.createItem({ 
            name: name, 
            price: price, 
            store_id: store_id, 
            image: imageBase64,
            stock: stock
        });

        baseResponse(res, true, 201, 'Item created successfully', item);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await itemRepository.getAllItems();
        baseResponse(res, true, 200, 'Items retrieved successfully', items);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.getItemById = async (req, res) => {
    const id = req.params.id;
    try {
        const item = await itemRepository.getItemById(id);
        if (!item) {
            return baseResponse(res, false, 404, 'Item not found', null);
        }
        baseResponse(res, true, 200, 'Item retrieved successfully', item);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.getItemByStoreId = async (req, res) => {
    const store_id = req.params.store_id;
    try {
        const items = await itemRepository.getItemByStoreId(store_id);
        baseResponse(res, true, 200, 'Items retrieved successfully', items);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.updateItem = async (req, res) => {
    const { name, price, stock, id } = req.body;
    if (!id || !name || !price) {
        return baseResponse(res, false, 400, 'ID, name, and price are required', null);
    }
    try {
        const image = req.file;
        let imageBase64 = null;
        if (image) {
            imageBase64 = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
        }

        const updatedItem = await itemRepository.updateItem({
            name,
            price,
            image: imageBase64,
            stock,
            id
        });

        baseResponse(res, true, 200, 'Item updated successfully', updatedItem);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedItem = await itemRepository.deleteItem(id);
        if (!deletedItem) {
            return baseResponse(res, false, 404, 'Item not found', null);
        }
        baseResponse(res, true, 200, 'Item deleted', deletedItem);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
};
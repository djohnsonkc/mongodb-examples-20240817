/*

Examples using the CRUD (CREATE, READ, UPDATE, DELETE) helpers

Room for Improvement: Declare dbName and collectionName for crudHelper instead of passing in for each call

*/

const crudHelper = require('./mongodb/crudHelper');
const pool = require('./mongodb/connectionPool');
const dbName = 'my-database-name';
const collectionName = 'my-collection-name';

exports.addItem = async function (req, res) {
    const result = await crudHelper.addItem(dbName, collectionName, req.body);
    if(result.data) {
        return res.status(200).json(result.data)
    }
    else {
        res.status(400).json(result.error);
    }
}

exports.getAllItems = async function (req, res) {
    const result = await crudHelper.getAllItems(dbName, collectionName, 25);
    if(result.data) {
        return res.status(200).json(result.data)
    }
    else {
        res.status(400).json(result.error);
    }
}

exports.getItemById = async function (req, res) {
    const id = req.params['id'];
    const result = await crudHelper.getItemById(dbName, collectionName, id);
    if (result.data) {
        return res.status(200).json(result.data)
    }
    else {
        return res.status(404).json({ message: "not found", error: result.error })
    }
}

// Use PATCH when you don't want to accidentally destroy the record if our POST-ed JSON doesn't have all of the attributes
exports.updateItem = async function (req, res) {
    const id = req.params['id'];
    const result = await crudHelper.updateItem(dbName, collectionName, id, req.body);
    if (result.data) {
        return res.status(200).json(result.data)
    }
    else {
        return res.status(404).json({ message: "not found", error: result.error })
    }
}

// Let's turn this off, just in case
exports.deleteItem = async function (req, res) {
    const id = req.params['id'];
    const result = await crudHelper.deleteItem(dbName, collectionName, id);
    if (result.data) {
        return res.status(200).json(result.data)
    }
    else {
        return res.status(404).json({ message: "not found", error: result.error })
    }
}

// Use PATCH to update a portion of the document
exports.patchUpdate = async function (req, res) {
    // verifyToken middleware seems to catch token issues
    const id = req.access_token_issuer.my_object_id;
    const result = await crudHelper.getItemById(dbName, collectionName, id);
    if (result.data) {
        const updateResult = await crudHelper.patchItem(dbName, collectionName, id, "my-collection-name", req.body.myAttributes);
        if (updateResult.data) {
            return res.status(200).json(updateResult.data)
        }
        else {
            return res.status(404).json({ message: "not found", error: updateResult.error })
        }
    }
    else {
        return res.status(404).json({ message: "not found", error: result.error })
    }

}


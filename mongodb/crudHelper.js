/*

Some helper functions for basic CRUD operations to fetch, insert, update, and delete

*/

const mongodb = require('mongodb');
const pool = require('./connectionPool');

async function getAllItems(dbName, collectionName, limit, query, fieldList) {

    try {
        const client = pool.getClient();
        const cursor = client
            .db(dbName)
            .collection(collectionName)
            .find(query)
            .limit(limit)
            .project(fieldList);
        const results = await cursor.toArray();
        return { data: results }
    }
    catch (err) {
        console.log("getAllItems error", err);
        return { error: err, data: null };
    }
}


async function getItemById(dbName, collectionName, _id) {

    try {
        const database = pool.getDatabase();
        const collection = database.collection(collectionName);
        const findOneQuery = { _id: mongodb.ObjectId.createFromHexString(_id) };
        const result = await collection.findOne(findOneQuery);
        return { data: result };
    }
    catch (err) {
        console.log("getItemById error", err);
        return { error: err };
    }
}


async function addItem(dbName, collectionName, data) {

    const database = pool.getDatabase();
    const collection = database.collection(collectionName);
    try {
        const result = await collection.insertOne(data);
        console.log(`${result.insertedCount} documents successfully inserted.\n`);

        return { data: result };

    } catch (err) {
        console.error(`Something went wrong trying to insert the new documents: ${err}\n`);

        return { error: err }
    }

}


async function updateItem(dbName, collectionName, _id, data) {

    try {
        const database = pool.getDatabase();
        const collection = database.collection(collectionName);
        const findOneQuery = { _id: mongodb.ObjectId.createFromHexString(_id) };
        // strip off the _id so we can save the entire document
        const doc = this.stripDocumentOfID(data);
        const updateDoc = { $set: { ...doc } }

        // The following updateOptions document specifies that we want the *updated*
        // document to be returned. By default, we get the document as it was *before*
        // the update.
        const updateOptions = { returnOriginal: false };

        const updateResult = await collection.findOneAndUpdate(
            findOneQuery,
            updateDoc,
            updateOptions,
        );

        return { data: updateResult };
    }
    catch (err) {
        console.log("getAllItems error", err);
        return { error: err, data: null };
    }
}
// IMPORTANT: use this to ONLY update part of the document at a time to avoid clobbering the entire document if the POST-ed JSON is incomplete
async function patchItem(dbName, collectionName, _id, keyName, value) {

    try {
        const database = pool.getDatabase();
        const collection = database.collection(collectionName);
        const findOneQuery = { _id: mongodb.ObjectId.createFromHexString(_id) };
        const updateDoc = { $set: { [keyName]: value } }

        // The following updateOptions document specifies that we want the *updated*
        // document to be returned. By default, we get the document as it was *before*
        // the update.
        const updateOptions = { returnOriginal: false };

        const updateResult = await collection.findOneAndUpdate(
            findOneQuery,
            updateDoc,
            updateOptions,
        );

        return { data: updateResult };
    }
    catch (err) {
        console.log("getAllItems error", err);
        return { error: err, data: null };
    }
}
// IMPORTANT: like patch, but ONLY ADDs an item into an array
async function pushItemIntoArray(dbName, collectionName, _id, keyName, jsonObject) {

    try {
        const database = pool.getDatabase();
        const collection = database.collection(collectionName);
        const findOneQuery = { _id: mongodb.ObjectId.createFromHexString(_id) };
        const updateDoc = { $push: { [keyName]: jsonObject } }

        // The following updateOptions document specifies that we want the *updated*
        // document to be returned. By default, we get the document as it was *before*
        // the update.
        const updateOptions = { returnOriginal: false };

        const updateResult = await collection.findOneAndUpdate(
            findOneQuery,
            updateDoc,
            updateOptions,
        );

        return { data: updateResult };
    }
    catch (err) {
        console.log("getAllItems error", err);
        return { error: err, data: null };
    }
}

async function deleteItem(dbName, collectionName, _id) {

    try {
        const database = pool.getDatabase();
        const collection = database.collection(collectionName);
        const findOneQuery = { _id: mongodb.ObjectId.createFromHexString(_id) };
        const deleteResult = await collection.deleteOne(findOneQuery);

        return { data: deleteResult };
    }
    catch (err) {
        console.log("getAllItems error", err);
        return { error: err, data: null };
    }
}

async function deleteAll(dbName, collectionName, filter) {

    try {
        const database = pool.getDatabase();
        const collection = database.collection(collectionName);
        const deleteResult = await collection.deleteMany(filter);
        return { data: deleteResult };
    }
    catch (err) {
        console.log("getAllItems error", err);
        return { error: err, data: null };
    }
}


// this strips off the _id property to allow the entire document to be saved without having to declare all of the properties and values
function stripDocumentOfID(data) {

    const doc = Object.keys(data).filter(objKey =>
        objKey !== '_id').reduce((newObj, key) => {
            newObj[key] = data[key];
            return newObj;
        }, {}
        );
    //console.log("doc", doc);

    return doc;
}


function convertStringToObjectId(_id) {

    return mongodb.ObjectId.createFromHexString(_id);
}


// DO EXPORTS HERE...
module.exports = {
    convertStringToObjectId,
    stripDocumentOfID,
    getAllItems,
    getItemById,
    addItem,
    updateItem,
    patchItem,
    pushItemIntoArray,
    deleteItem,
    deleteAll
};
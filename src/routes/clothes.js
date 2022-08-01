'use strict';

const express = require('express');

const clothesCollection = require('../models/index.js').Clothes;

const router = express.Router();

// RESTful Route Declarations
router.get('/clothes', getClothes);
router.get('/clothes/:id', getOneClothes);
router.post('/clothes', createClothes);
router.put('/clothes/:id', updateClothes);
router.delete('/clothes/:id', deleteClothes);

// RESTful Route Handlers
async function getClothes(req, res) {
    try {
        const allClothes = await clothesCollection.read();
        if(allClothes.length == 0) {
            res.status(200).send('There are no clothes available!');
        } else {
            res.status(200).json(allClothes);
        }
    } catch (error) {
        console.log(error);
    }
}

async function getOneClothes(req, res) {
    try {
        const id = req.params.id;
        const theClothes = await clothesCollection.read(id);
        if(theClothes == undefined) {
            res.status(404).send(`We don't have a valid clothes id for ${id}`);
        } else {
            res.status(200).json(theClothes);
        }
    } catch (error) {
        console.log(error);
    }
}

async function createClothes(req, res) {
    try {
        const record = req.body;
        const newClothes = await clothesCollection.create(record);
        res.status(200).json(newClothes);
    } catch (error) {
        console.log(error);
    }
}

async function updateClothes(req, res) {
    try {
        const id = req.params.id;
        const obj = req.body;
        const updatedClothes = await clothesCollection.update(id, obj);
        if(id != updatedClothes.id) {
            res.status(404).send(`There are no clothes with id ${id} to update!`);
        } else {
            res.status(200).json(updatedClothes);
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteClothes(req, res) {
    try {
        const id = req.params.id;
        const deletedClothes = await clothesCollection.delete(id);
        if(!deletedClothes) {
            res.status(404).send(`There are no clothes with id ${id} to delete!`);
        } else {
            res.status(200).json(deletedClothes);
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = router;

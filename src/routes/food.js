'use strict';

const express = require('express');

const FoodCollection = require('../models/index.js').Food;

// const app = express();

const router = express.Router();

// RESTful Route Declarations - these all get exported via router, then we import them in our server.js file and simply use app.use(foodRoutes);

router.get('/food', getFood);
router.get('/food/:id', getOneFood);
router.post('/food', createFood);
router.put('/food/:id', updateFood);
router.delete('/food/:id', deleteFood);

// RESTful Route Handlers
async function getFood(req, res) {
    try {
        const allFood = await FoodCollection.read();
        if(allFood.length == 0) {
            res.status(200).json({
                message: `There is no food with id 1 to delete!`
            });
        } else {
            res.status(200).json(allFood);
        }
    } catch (error) {
        console.log(error);
    }
}

async function getOneFood(req, res) {
    try {
        const id = req.params.id;
        const theFood = await FoodCollection.read(id);
        res.status(200).json(theFood);
        if(theFood == undefined){
            res.status(404).send(`We don't have a valid food id for ${id}!`);
        } else {
            res.status(200).json(theFood);
        }
    } catch (error) {
        console.log(error);
    }
}

async function createFood(req, res) {
    try {
        const record = req.body;
        const newFood = await FoodCollection.create(record);
        res.status(200).json(newFood);
    } catch (error) {
        console.log(error);
    }
}

async function updateFood(req, res) {
    try {
        const id = req.params.id;
        const record = req.body;
        const updatedFood = await FoodCollection.update(id, record);
        if(id != updatedFood.id) {
          res.status(404).send(`There is no food with id ${id} to update!`);
        } else {
            res.status(200).json(updatedFood);
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteFood(req, res) {
    try {
        const id = req.params.id;
        const deletedFood = await FoodCollection.read(id);
        if(!deletedFood) {
            res.status(404).json({
                message: `There is no food with id ${id} to delete!`
            });
        } else {
            await FoodCollection.delete(id);
            res.status(200).json(deletedFood);
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = router;

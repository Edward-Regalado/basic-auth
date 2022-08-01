'use strict';

const express = require('express');
const usersCollection = require('../models/index.js').Users;

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getOneUsers);
router.post('/users', createUsers);

async function getAllUsers(req, res) {
    try {
        const allUsers = await usersCollection.read();
        if(allUsers.length == 0) {
            res.status(200).send('There are no users available!');
        } else {
            res.status(200).json(allUsers);
        }
    } catch (error) {
        console.error(error);
    }
}

async function getOneUsers(req, res) {
    try {
        const id = req.params.id;
        const Users = await usersCollection.read(id);
        if(Users == undefined) {
            res.status(404).send(`We don't have a valid user id for ${id}`);
        } else {
            res.status(200).json(Users);
        }
    } catch (error) {
        console.log(error);
    }
}


async function createUsers(req, res) {
    try {
        const record = req.body;
        const newUser = await usersCollection.create(record);
        res.status(201).json(newUser);
        console.log(`user created successfully ${record.username}`);
        // }
    } catch (error) {
        if(error.name === 'SequelizeUniqueConstraintError') {
            res.status(500).send('user already exists');
            // console.log(error);
        } else {
            res.status(500).send("Some else failed on the backend!");
        }
    }
}

module.exports = router;

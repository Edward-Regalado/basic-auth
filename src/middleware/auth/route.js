const { Users } = require('../../models/index.js');
const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

async function singUpUser(req, res) {
    try {
        const data = req.body;
        // const user =  JSON.stringify(data);
        const check = await Users.model.findOne({
            where: {
                username: req.body.username
            },
        });

        // if check comes back as null, then create a new user
        // console.log(`CHECK VARIABLE: ${check}`);
        // console.log(`USER VARIABLE: ${user}`);
        // console.log(`DATA VARIABLE: ${data}`);

        if(check === null) {
            const newUser = await Users.create(data);
            res.status(201).json(newUser);
            console.log(`new user created: ${newUser}`);
        } else {
            res.status(500).send('username already exists!');
        }
    } catch (error) {
            console.log(error);
    }
}

async function singInUser(req, res) {
    try {
        const user = await Users.model.findOne({
            where: {
                username: req.body.username
            },
        });
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if(isValid) {
            res.status(200).send(user);
            console.log(`${JSON.stringify(user.username)} is validated!`);
            return;
        }
    } catch (error) {
        console.log(error);
    }
    res.status(403).send("Invalid username or password");
}

router.post('/signup', singUpUser);
router.post('/signin', singInUser);

module.exports = router;

const express = require('express')
const router = express.Router();
const database = require('../database/database');
const bcrypt = require('bcryptjs');

router.post('/register', (req, res) => {

    let body = req.body;

    let id = String(Math.floor(Math.random() * 9)) + String(Math.floor(Math.random() * (999999999 - 100000000) + 100000000))

    database.addUser(id, body.email, body.username, body.password, body.premium)

    res.send({success: true})
});

module.exports = router;

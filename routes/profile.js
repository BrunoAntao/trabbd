const express = require('express')
const router = express.Router();
const database = require('../database/database');
const bcrypt = require('bcryptjs');

router.get('/profile', (req, res) => {

    database.getUser(req.query.email, (response) => {

      res.send({success: true, data: response})
    })
});

module.exports = router;

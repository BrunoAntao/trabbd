const express = require('express')
const router = express.Router();
const database = require('../database/database');
const bcrypt = require('bcryptjs');

router.post('/login', (req, res) => {

    let body = req.body;

    database.verifyUser(body.email, body.password, (result) =>{

      res.send({success: result})

  });
})

module.exports = router;

const express = require('express')
const router = express.Router();
const database = require('../database/database');
const bcrypt = require('bcryptjs');

router.get('/playlists', (req, res) => {

    database.getPl(req.query.email, (response) => {

        let names = [];

        response.map( el => {

          names.push(Object.values(el)[0]);

        })

        res.send(names);
    })
});

router.post('/playlists', (req, res) => {

    let body = req.body;

    database.addPl(body.name, body.email, (response) => {

          res.send(response)
    })
});

router.delete('/playlists', (req, res) => {

  let params = req.query;

  params.name = params.name.trim();

  database.removePl(params.name, params.email, (response) => {

    res.send(response);

  })
});



module.exports = router;

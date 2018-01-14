const express = require('express')
const router = express.Router();
const database = require('../database/database');
const bcrypt = require('bcryptjs');

router.post('/musics', (req,res) => {

  let body = req.body;

  database.addMusic(body.plName, body.email, body.name, body.author, body.style)

});

router.get('/musics', (req, res) => {

  let body = req.query;

  database.getMusics(body.name, body.email, (response) => {

    let musics = {name: body.name, musics: []}

    response.map( el => {

      let info = Object.values(el);

      musics.musics.push({name: info[1], style: info[2], author: info[3]})

    });

    res.send(musics);

  })

});

router.delete('/musics', (req, res) => {

  let params = req.query;

  database.removeMusic(params.name, params.email, params.plName, (response) => {

    
  })
})

module.exports = router;

const pg = require('pg');
const bcrypt = require('bcryptjs');

let client = new pg.Client("postgres://postgres:27deagosto@localhost:5432/music");

module.exports = {

  connect: function(){

      client.connect();

      console.log("Connected to database");

  },

  addUser: function (id, email, username, password, premium) {

    bcrypt.genSalt(10, (err, salt) => {

      bcrypt.hash(password, salt, (err, hash) => {

        if(premium){

          client.query('Insert into userpl values($1, $2, $3, $4)', [id, email, username, hash]);

          client.query('Insert into premium values($1, $2)', [id, 23.9]);

        } else {

          client.query('Insert into userpl values($1, $2, $3, $4)', [id, email, username, hash]);

          client.query('Insert into casual values($1, $2)', [id, 5]);

        }

      });

    });

  },

  verifyUser: function (email, password, callback) {

    client.query('Select pass from userpl where email = $1', [email]).then( result => {

      bcrypt.compare(password, result.rows[0].pass, function(err, res) {

        callback(res)

      });

    });

  },

  getUser: function (email, callback) {

    client.query('Select * from userpl where email = $1', [email]).then( result => {

        callback(result.rows[0]);

    });

  },

  addPl: function (name, email, callback) {

    let playlistId = String(Math.floor(Math.random() * 9)) + String(Math.floor(Math.random() * (999999999 - 100000000) + 100000000))

    client.query('Select user_id from userpl where email = $1', [email]).then( result => {

      let id = result.rows[0].user_id;

      client.query('Select * from casual where user_id = $1', [id]).then( result => {

        let user = result.rows[0];

        if(user == undefined) {

          client.query('Insert into playlist values($1, $2)', [name.trim(), playlistId]);

          client.query('Insert into user_playlist values($1, $2)', [id, playlistId]);

        } else if(user.playlist_number > 0) {

          client.query('Insert into playlist values($1, $2)', [name.trim(), playlistId]);

          client.query('Update casual set playlist_number = playlist_number - 1 where user_id = $1', [id]);

          client.query('Insert into user_playlist values($1, $2)', [id, playlistId]);

        }
      })

    }).catch( (err) => {console.log(err);});


    callback({success: true})

  },

  getPl: function (email, callback) {

      client.query('Select name from playlist where playlist_id = some (Select playlist_id from user_playlist where user_id = (Select user_id from userpl where email = $1))', [email]).then( result => {

          callback(result.rows);

    }).catch( (err) => { console.log(err); });

  },

  removePl: function (name, email, callback) {

      client.query('Select playlist_id from user_playlist natural join playlist where user_id = (Select user_id from userpl where email = $1) and name = $2', [email,name]).then( result => {

        let pl_id = result.rows[0].playlist_id;

        client.query('Delete from music where music_id = some (Select music_id from playlist_musics where playlist_id = $1)', [pl_id]).then( result => {

          client.query('Delete from playlist where playlist_id = $1', [pl_id]);

        }).catch( (err) => { console.log(err); });

      callback({success: true})

    }).catch( (err) => { console.log(err); });


    client.query('Select user_id from userpl where email = $1', [email]).then( result => {

      let id = result.rows[0].user_id;

      client.query('Select * from casual where user_id = $1', [id]).then( result => {

        let user = result.rows[0];

        if(user != undefined && user.playlist_number < 5){

          client.query('Update casual set playlist_number = playlist_number + 1 where user_id = $1', [id]);

        }

      }).catch( (err) => { console.log(err); });

    }).catch( (err) => { console.log(err); });

  },

  addMusic: function (plName, email, name, author, style) {

    let music_id = String(Math.floor(Math.random() * 9)) + String(Math.floor(Math.random() * (999999999 - 100000000) + 100000000))

    client.query('Select playlist_id from user_playlist natural join playlist where user_id = (Select user_id from userpl where email = $1) and name = $2', [email, plName]).then( result => {

      let playlist_id = result.rows[0].playlist_id;

      client.query('Insert into music values($1, $2, $3, $4)', [music_id, name, style, author]);

      client.query('Insert into playlist_musics values($1, $2)', [music_id, playlist_id]);

    }).catch( (err) => { console.log(err); });

  },

  removeMusic: function (music, email, playlist, callback) {

    client.query('Select music_id from playlist_musics natural join music where playlist_id = (Select playlist_id from user_playlist natural join playlist where user_id = (Select user_id from userpl where email = $1) and name = $2) and name = $3', [email, playlist, music]).then( result => {

      let music_id = result.rows[0].music_id;

      client.query('Delete from music where music_id = $1', [music_id]);

    }).catch( (err) => { console.log(err); });

  },

  getMusics: function (name, email, callback) {

    client.query('Select * from music where music_id = some (Select music_id from playlist_musics where playlist_id = (Select playlist_id from user_playlist natural join playlist where user_id = (Select user_id from userpl where email = $1) and name = $2))', [email, name]).then( result => {

      let musics = result.rows;

      callback(musics);

    }).catch( (err) => { console.log(err); });

  },

  client: client

}

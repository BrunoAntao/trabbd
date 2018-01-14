let express = require('express');
let path = require('path');
let database = require('./database/database.js');

let musicRoute = require('./routes/musics');
let profileRoute = require('./routes/profile');
let playlistRoute = require('./routes/playlists');
let loginRoute = require('./routes/login');
let registerRoute = require('./routes/register');
let bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.json());

app.use('/', musicRoute);
app.use('/', profileRoute);
app.use('/', playlistRoute);
app.use('/', loginRoute);
app.use('/', registerRoute);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {

 res.sendFile(path.join(__dirname, 'public/views/index.html'));

})

app.listen(8000, function () {

  database.connect();

  console.log('App listening on port 8000!');
})

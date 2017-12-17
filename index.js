//Express middleware and routing

const express = require('express');
const config = require('./config')
const Twit = require('twit');

const T = Twit(config);

const app = express();

//Specifies Pug as template engine for Express so that paths render Pug templates
app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', (req, res) => {
  T.get('followers/ids', { screen_name: config.screen_name },  function (err, data, response) {
    console.log(data)
  })
  res.render('index');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

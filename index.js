//Express middleware and routing

const express = require('express');
const config = require('./config')
const { DateTime } = require('luxon');
const Twit = require('twit');

const T = Twit(config);

const app = express();

const tweetData = [];

//Specifies Pug as template engine for Express so that paths render Pug templates
app.set('view engine', 'pug');

app.use(express.static('public'));

T.get('followers/ids', { screen_name: config.screen_name },  function (err, data, res) {
  tweetData.friends = data.ids.length;
});

T.get('friends/list', { screen_name: config.screen_name, count: 5 },  function (err, data, res) {
  // tweetData.friendsList.usernames = data.users;

  //Data for 5 most recent friends: data.users
  // console.log(data.users[0]);

  // console.log(data.users[0].name);
  // console.log(data.users[0].screen_name);

  // tweetText
  console.log("Text", data.users[0].status.text);


  // timeSinceTweet
  console.log("Created at", data.users[0].status.created_at);
  console.log(new Date().toLocaleString());
  // avatarBigger
  // retweetCountOfTweet
  // likeCountOfTweet (might have another name in API)


});

app.get('/', (req, res) => {

  res.locals.screen_name = config.screen_name;
  res.locals.friends = tweetData.friends;
  console.log(tweetData)
  // let followersCount = 0;
  //
  //
  //
  // res.locals.followersCount = followersCount;

  res.render('index'
  // , { screen_name: `@${config.screen_name} }`
  );
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

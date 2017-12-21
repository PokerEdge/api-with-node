//Express middleware and routing

const express = require('express');
const config = require('./config')
const Twit = require('twit');
const moment = require('moment');
// moment.format();

const app = express();
const port = process.env.PORT || 3000;

const T = Twit(config);
const Now = new Date();

const tweetData = {
  staticData: [],
  timelineData: [],
  friendsData: [],
  DMData: []
};

//Specifies Pug as template engine so Express renders Pug templates
app.set('view engine', 'pug');
// app.set("views", path.join(__dirname, "views"));

app.use(express.static('public'));

T.get('users/profile_banner', { screen_name: config.screen_name },  function (err, data, res) {
  //Prevent 404 error if no profile image is rendered for the auth user
  if (!err) {
    tweetData.staticData.profileImageURL = data.sizes.web_retina.url;
  }
});

// Friends count
T.get('followers/ids', { screen_name: config.screen_name },  function (err, data, res) {
  tweetData.staticData.friends = data.ids.length;
});

// Timeline data
T.get('statuses/user_timeline', { screen_name: config.screen_name, count: 5 },  function (err, data, res) {

  // *** Auth user avatar set from "normal" size to "bigger" size
  tweetData.staticData.userAvatarImage = data[0].user.profile_image_url_https.replace("normal", "bigger");

  // *** Name of auth user
  tweetData.staticData.name = data[0].user.name;

  // ****************************************************************
  // ***** iterable data is below: A TWEET in timelineData: [] ******
  // ****************************************************************

  // *** Tweet text of auth user
  tweetData.timelineData.tweetText = data[0].text;

  // *** Time since Tweet
  tweetData.timelineData.timeSinceTweet = moment(data[0].created_at).fromNow();

  // *** retweetCountOfTweet
  tweetData.timelineData.retweetCount = data[0].retweet_count;

  // *** likeCountOfTweet (might have another name in API)
  tweetData.timelineData.likeCount = data[0].favorite_count;

});

// Following data
T.get('friends/list', { screen_name: config.screen_name, count: 5 },  function (err, data, res) {

  // ****************************************************************
  // ***** iterable data is below: A FRIEND in friendsData: [] ******
  // ****************************************************************

  // *** Real name of friend
  tweetData.friendsData.friendName = data.users[0].name;

  // *** Screen name of friend
  tweetData.friendsData.friendScreenName = data.users[0].screen_name;

  // *** Avatar of friend (bigger)
  tweetData.friendsData.friendAvatar = data.users[0].profile_image_url_https.replace("normal", "bigger");

  // *** Is auth user following friend? (boolean)
  tweetData.friendsData.isFriendFollowed = data.users[0].following;

});

T.get('direct_messages', { count: 5 }, function (err,data, res) {

  // *******************************************************
  // ***** iterable data is below: A DM in DMData: [] ******
  // *******************************************************

  // *** Message sender's avatar
  tweetData.DMData.senderAvatar = data[0].sender.profile_image_url_https.replace("normal","bigger");

  // *** Text from sender's message
  tweetData.DMData.senderMessage = data[0].text;

  // *** Time from DM being sent
  tweetData.DMData.timeOfDM = moment(data[0].created_at).fromNow();

});

app.get('/', (req, res) => {

  //Non iterable data
  res.locals.screen_name = config.screen_name;
  res.locals.friends = tweetData.staticData.friends;
  res.locals.profileImageURL = tweetData.staticData.profileImageURL;
  res.locals.userAvatarImage = tweetData.staticData.userAvatarImage;
  res.locals.name = tweetData.staticData.name;

  // Timeline data (iterable)
  res.locals.tweetText = tweetData.timelineData.tweetText;
  res.locals.retweetCount = tweetData.timelineData.retweetCount;
  res.locals.likeCount = tweetData.timelineData.likeCount;
  res.locals.timeSinceTweet = tweetData.timelineData.timeOfTweet;

  // Following data (iterable)
  res.locals.friendName = tweetData.friendsData.friendName;
  res.locals.friendScreenName = tweetData.friendsData.friendScreenName;
  res.locals.friendAvatar = tweetData.friendsData.friendAvatar;
  res.locals.isFriendFollowed = tweetData.friendsData.isFriendFollowed;

  //DM data (iterable)
  res.locals.senderAvatar = tweetData.DMData.senderAvatar;
  res.locals.senderMessage = tweetData.DMData.senderMessage;
  res.locals.timeOfDM = tweetData.DMData.timeOfDM;

  res.render('index');
});

// ***************************
// ***** ERROR HANDLING ******
// ***************************

app.use((req, res, next) => {
  let err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

app.use((req, res, next) => {
  let err = new Error("Internal Server Error");
  err.status = 500;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.screen_name = config.screen_name;
  res.locals.error = err;
  res.status(err.status);
  res.render('error')
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

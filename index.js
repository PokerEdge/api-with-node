// Express initializes app to be a function handler
const express = require('express');
const app = express();

// Create Node.JS server and use express app as event emitter
const server = require('http').createServer(app);

// Mount io onto Node.JS http server to open stream/sockets/etc. depending on browser
const io = require('socket.io').listen(server);

// Import config file information (sensitive user data and screen name)
const config = require('./config')

const Twit = require('twit');
const moment = require('moment');

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

io.sockets.on('connection', function(socket){
  // Events we want to emit go into here

  console.log('A user has connected');

  socket.on('disconnect', function(data){
    console.log('A user has disconnected');
  });

  // "Send message"
  //Post tweet to Timeline
  //Submit validated data as POST request (this happens and is emitted to index.js)
    //The post request after a "tweet" (just the text) is emitted to index.js should also contain
    //the following data that is acquired within index.js
      //Text of Tweet (emitted by socket on validated form submission)
      //Time of Tweet
      //username
      //screen_name
      //userAvatarImage
      //retweetCountOfTweet
      //likeCountOfTweet
  socket.on('tweet', function(data){

    // Logs out the tweet text in server console
    console.log(data);

    //CREATES AND SENDS TWEET WITH THIS HANDLER: post request that is inside of emitter
    io.sockets.emit('new tweet', { tweet: data} ); //let's pass tweet data to client

  });

});

const T = Twit(config);

const staticData = [];
const twitterPostData = [];
const followersData = [];
const msgData = [];

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

// ****************************
// ***** GET DATA FOR APP *****
// ****************************

T.get('users/profile_banner', { screen_name: config.screen_name },  function (err, data, res) {
  //Prevent 404 error if no profile image is rendered for the auth user
  if (!err) {
    staticData.profileImageURL = data.sizes.web_retina.url;
  }
});

// Friends count
T.get('followers/ids', { screen_name: config.screen_name },  function (err, data, res) {
  staticData.friends = data.ids.length;
});

// Timeline data
  // *** CHANGE ITERATOR NUMBER ALONG WITH ANY CHANGE TO "count" VALUE, here the value is 5 ***
T.get('statuses/user_timeline', { screen_name: config.screen_name, count: 5 },  function (err, data, res) {

  // *** Auth user avatar set from "normal" size to "bigger" size
  staticData.userAvatarImage = data[0].user.profile_image_url_https.replace("normal", "bigger");

  // *** Name of auth user
  staticData.name = data[0].user.name;

  for( let i = 0; i < 5; i++ ){

    let timelineData = {};

    // *** Auth user avatar set from "normal" size to "bigger" size
    timelineData.userAvatarImage = data[0].user.profile_image_url_https.replace("normal", "bigger");

    // *** Name of auth user
    timelineData.name = data[0].user.name;

    // *** Tweet text of auth user
    timelineData.tweetText = data[i].text;

    // *** Time since Tweet
      // 'Thu Dec 21 17:10:36 +0000 2017'
    timelineData.timeSinceTweet = moment(data[i].created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY').fromNow();

    // *** retweetCountOfTweet
    timelineData.retweetCount = data[i].retweet_count;

    // *** likeCountOfTweet
    timelineData.likeCount = data[i].favorite_count;

    twitterPostData.push(timelineData);

  }

});

// Following data aka "friends" data
  // *** CHANGE ITERATOR NUMBER ALONG WITH ANY CHANGE TO "count" VALUE, here the value is 5 ***
T.get('friends/list', { screen_name: config.screen_name, count: 5 },  function (err, data, res) {

  for( let i = 0; i < 5; i++ ){

    let friendsData = {};

    // *** Real name of friend
    friendsData.friendName = data.users[i].name;

    // *** Screen name of friend
    friendsData.friendScreenName = data.users[i].screen_name;

    // *** Avatar of friend (bigger)
    friendsData.friendAvatar = data.users[i].profile_image_url_https.replace("normal", "bigger");

    // *** Is auth user following friend? (boolean)
    friendsData.isFriendFollowed = data.users[i].following;

    followersData.push(friendsData);
  }

});

// Direct message data
  // *** CHANGE ITERATOR NUMBER ALONG WITH ANY CHANGE TO "count" VALUE, here the value is 5 ***
T.get('direct_messages', { count: 5 }, function (err,data, res) {

  for( let i = 0; i < 5; i++ ){

    let DMData = {};

    // *** Message sender's avatar
    DMData.senderAvatar = data[i].sender.profile_image_url_https.replace("normal","bigger");

    // *** Text from sender's message
    DMData.senderMessage = data[i].text;

    // *** Time from DM being sent
    DMData.timeOfDM = moment(data[i].created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY').fromNow();

    msgData.push(DMData);

  }

});

// ***********************
// ***** HOME ROUTE  *****
// ***********************

app.get('/', (req, res) => {

  //Static data
  res.locals.screen_name = config.screen_name;
  res.locals.friends = staticData.friends;
  res.locals.profileImageURL = staticData.profileImageURL;
  res.locals.userAvatarImage = staticData.userAvatarImage;
  res.locals.name = staticData.name;

  res.render('index', { twitterPostData, followersData, msgData });
});

//On Submit
  // pop tweetObject off array of tweetObjects
  // format the post request's tweet object using the below listed variables
  // push this status update onto the array of tweetObjects
//Create new tweet object
  // timeSinceTweet, userAvatarImage, name, screen_name,
    // tweetText (also argument of request), retweetCount, likeCount

// app.post('/', (req, res) => {
//     let T = new Twit(config);
//     T.post('statuses/update', { status: req.body.newTweet }, (err, data) => {
//         if (err) return res.send(err);
//         let tweetData = {};
//         tweetData.picture = data.user.profile_image_url;
//         tweetData.author = '<h4>' + data.user.name + '</h4> @' + data.user.screen_name;
//         tweetData.date = new Date(data.created_at).toLocaleString();
//         tweetData.like = data.favorite_count;
//         tweetData.retweet = data.retweet_count;
//         tweetData.message = data.text;
//         res.send(tweetData);
//     });
// });

// **************************
// ***** ERROR HANDLING *****
// **************************

app.use((req, res, next) => {
  let err = new Error("Duplicate Tweet");
  err.status = 403;
  next(err);
});

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
  res.locals.profileImageURL = staticData.profileImageURL;
  res.locals.error = err;
  res.locals.errorStatus = err.status;

  res.render('error');
});

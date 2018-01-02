// Express initializes 'app' to be a function handler
const express = require('express');
const app = express();

// Create Node.JS server and use express app as event emitter
const server = require('http').createServer(app);

// Mount io onto Node.JS http server to open stream/sockets/etc. depending on browser
const io = require('socket.io').listen(server);

// Import config file information (sensitive user data and screen name)
const config = require('./config')

const Twit = require('twit');
const T = Twit(config);

const moment = require('moment');

const staticData = [];
const twitterPostData = [];
const followersData = [];
const msgData = [];

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Open two-way connection between server and client
io.sockets.on('connection', function(socket){

  console.log('A user has connected');

  socket.on('disconnect', function(data){
    console.log('A user has disconnected');
  });

  // Event handler for 'on valid text submission on client'
  socket.on('tweet', function(data){

    T.post('statuses/update', {status: data}, function(err, data, res){

      if (err) { return next(err); }

      let newTweetData = {};

        // *** Text of Tweet ( emitted by socket on validated form submission: {status:data} )
        newTweetData.text = data.text;

        // *** Time of Tweet
        newTweetData.timeSinceTweet = moment(data.created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY').fromNow();

        // *** username
        newTweetData.name = data.user.name;

        // *** screen_name
        newTweetData.screen_name = data.user.screen_name;

        // *** userAvatarImage
        newTweetData.userAvatarImage = data.user.profile_image_url_https.replace("normal","bigger");

        // *** retweetCountOfTweet
        newTweetData.retweetCountOfTweet = 0;

        // *** likeCountOfTweet
        newTweetData.likeCountOfTweet = 0;

        // *** emit {newTweetData} object back to client side to be used to contruct a styled timeline element
        io.sockets.emit('new tweet', { newTweetData } );

    });

  });

});

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

// ****************************
// ***** GET DATA FOR APP *****
// ****************************

T.get('users/profile_banner', { screen_name: config.screen_name },  function (err, data, res) {

  // Check for 404 error if no profile image is rendered for the auth user
  // If no profile image is found, the app displays a fallback background color
  if (!err) {
    staticData.profileImageURL = data.sizes.web_retina.url;
  }

});

// Friends count
T.get('followers/ids', { screen_name: config.screen_name },  function (err, data, res) {
  if (err) { return next(err); }
  staticData.friends = data.ids.length;
});

// Timeline data
  // *** CHANGE ITERATOR NUMBER ALONG WITH ANY CHANGE TO "count" VALUE, here the value is 5 ***
T.get('statuses/user_timeline', { screen_name: config.screen_name, count: 5 },  function (err, data, res) {

  if (err) { return next(err); }

  for( let i = 0; i < 5; i++ ){

    let timelineData = {};

    // *** Auth user avatar set from "normal" size to "bigger" size
    timelineData.userAvatarImage = data[0].user.profile_image_url_https.replace("normal", "bigger");

    // *** Name of auth user
    timelineData.name = data[0].user.name;

    // *** Tweet text of auth user
    timelineData.tweetText = data[i].text;

    // *** Time since Tweet
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

  if (err) { return next(err); }

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
T.get('direct_messages', { count: 5 }, function (err, data, res) {

  if (err) { return next(err); }

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

  res.render('index', { twitterPostData, followersData, msgData } );
});


// **************************
// ***** ERROR HANDLING *****
// **************************

app.get('/error', (req, res) => {

  let err = new Error("Page Not Found");

  res.locals.screen_name = config.screen_name;
  res.locals.profileImageURL = staticData.profileImageURL;
  res.locals.errStatus = 404;
  res.locals.error = err;

  res.render('error');
});

app.get('/500', (req, res) => {

  let err = new Error("Internal Server Error");

  res.locals.screen_name = config.screen_name;
  res.locals.profileImageURL = staticData.profileImageURL;
  res.locals.errStatus = 500;
  res.locals.error = err;

  res.render('500');
});

app.use( (req, res, next) => {

  res.status(404).redirect('error');
});

app.use( (err, req, res, next) => {

  console.error(err);
  res.status(500).redirect('500');

});

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
})

T.get('statuses/user_timeline', { screen_name: config.screen_name, count: 5 },  function (err, data, res) {

  //Timeline data

  // *** Auth user avatar set from "normal" size to "bigger" size
  tweetData.staticData.userAvatarImage = data[0].user.profile_image_url_https.replace("normal", "bigger");

  // *** Name of auth user
  tweetData.staticData.name = data[0].user.name;


  // *******************************************************
  // ***** iterable data is below this point: A TWEET ******
  // *******************************************************

  // *** Tweet text of auth user
  tweetData.timelineData.tweetText = data[0].text;

  // *** Time of Tweet
    //CONVERT TO TIME SINCE TWEET e.g. "4h"

  // tweetData.timelineData.timeOfTweet = data[0].created_at;
  tweetData.timelineData.timeOfTweet = moment(data[0].created_at).fromNow();

  // console.log(tweetData.timelineData.timeOfTweet);

  var dur = tweetData.timelineData.timeOfTweet;
  console.log('Current time                 ', Now);
  console.log('Tweet time altered by moment ', tweetData.timelineData.timeOfTweet);


  // *** retweetCountOfTweet
  tweetData.timelineData.retweetCount = data[0].retweet_count;

  // *** likeCountOfTweet (might have another name in API)
  tweetData.timelineData.likeCount = data[0].favorite_count;

});

T.get('followers/ids', { screen_name: config.screen_name },  function (err, data, res) {
  tweetData.staticData.friends = data.ids.length;
});

T.get('direct_messages', { count: 5 }, function (err,data, res) {

  // **************************
  // **** ITERABLE DM DATA ****
  // **************************


  // Message sender's avatar
  tweetData.DMData.senderAvatar = data[0].sender.profile_image_url_https.replace("normal","bigger");

  // Text from sender's message
  tweetData.DMData.senderMessage = data[0].text;

  // Time from DM being sent
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
  res.locals.timeOfTweet = tweetData.timelineData.timeOfTweet;

  // Following data (iterable)
    // Real name of friend
    // Screen name of friend
    // Avatar of friend (bigger)


  //DM data (iterable)
  res.locals.senderAvatar = tweetData.DMData.senderAvatar;
  res.locals.senderMessage = tweetData.DMData.senderMessage;
  res.locals.timeOfDM = tweetData.DMData.timeOfDM;

  // console.log(res.locals);

  //Can render the detructured tweet and DM as an argument to res.render()
  res.render('index');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

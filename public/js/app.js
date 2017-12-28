// ~function(){
  'use strict';

  var socket = io.connect();

  // $('form').submit(function(){
  //   socket.emit('chat message', $('#m').val());
  //   $('#m').val('');
  //   return false;
  // });

  const $tweetTextArea = $('#tweet-textarea');
  const $tweetLengthDisplay = $('#tweet-char');
  const $tweetStyle = $('.app--tweet--char');
  const maxTweetLength = 280;
  let tweetLength;

  const $tweetButton = $('.button-primary');

  //Handler to manage Tweet length and styles
  $tweetTextArea.keyup(function(){

    tweetLength = $tweetTextArea.val().length;
    $tweetLengthDisplay.text(maxTweetLength - tweetLength);

    if ( tweetLength > maxTweetLength && !($tweetStyle.hasClass('invalidLength')) ){
      $tweetStyle.addClass('invalidLength');
    }

    if ( tweetLength <= maxTweetLength && $tweetStyle.hasClass('invalidLength') ){
      $tweetStyle.removeClass('invalidLength');
    }

  });


  $tweetButton.submit(function(e){
    e.preventDefault();

    //Prevent tweet from sending if tweet length is too long
    if (tweetLength > maxTweetLength){

      //Change to error style
      console.log("Error: Tweet is too long!")

    } else {

      //Log tweet text
      console.log( $tweetTextArea.val() );

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

      //Resets for after valid submission
      $tweetTextArea.val('');
      $tweetLengthDisplay.text(maxTweetLength);
    }
  });


// }();
